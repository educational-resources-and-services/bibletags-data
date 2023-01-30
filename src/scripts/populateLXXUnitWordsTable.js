require('dotenv').config()

const { getLocFromRef, getCorrespondingRefs, getNextOriginalLoc, getRefFromLoc } = require('@bibletags/bibletags-versification');
const { getWordInfoFromWordRow } = require('@bibletags/bibletags-ui-helper');
const mysql = require('mysql2/promise')

const wordColumnsToUse = [
  "form",
  "definitionId",
  "lemma",
  "pos",
  "type",
  "mood",
  "aspect",
  "voice",
  "person",
  "case",
  "gender",
  "number",
  "attribute",
]

;(async() => {

  const connection = await mysql.createConnection({
    host: process.env.RDS_HOST || "localhost",
    database: process.env.RDS_DATABASE || 'BibleTags',
    user: process.env.RDS_USERNAME || "root",
    password: process.env.RDS_PASSWORD || "",
    multipleStatements: true,
  })

  console.log(`\nSTARTING populateLXXUnitWordsTable...\n`)

  // Check that there are no originalLocs that are not translated nor accounted for in the LXX versification
  const [ allLxxLocs ] = await connection.query(`SELECT loc FROM lxxVerses`)
  const lxxLocsObj = {}
  allLxxLocs.forEach(({ loc }) => {
    lxxLocsObj[loc] = true
  })
  let originalLoc = `01001001`
  let missingLxxLocs = {}
  while(!/^40/.test(originalLoc)) {
    const lxxRefs = getCorrespondingRefs({
      baseVersion: {
        info: {
          versificationModel: 'original',
        },
        ref: getRefFromLoc(originalLoc),
      },
      lookupVersionInfo: {
        versificationModel: 'lxx',
      },
    })

    if(
      lxxRefs !== false
      && (
        lxxRefs.some(lxxRef => !lxxLocsObj[getLocFromRef(lxxRef).split(':')[0]])
      )
    ) {
      missingLxxLocs[originalLoc] = true
    }

    originalLoc = getNextOriginalLoc(originalLoc)
  }
  if(Object.values(missingLxxLocs).length > 0) {
    console.log(`\nThe following originalLocs have no corresponding loc in the LXX, and no required \`null\` row in the LXX versification:`)
    console.log(Object.keys(missingLxxLocs).sort().join(`\n`))
    process.exit()
  }

  await connection.query(`TRUNCATE lxxUnitWords`)
  await connection.query(`TRUNCATE lxxUnitRanges`)

  const bookIdAndVerseNumberToLocMap = {}
  const versificationErrorsAlreadyNotes = {}

  // loop columns
  for(let wordCol of wordColumnsToUse) {

    console.log(`Starting ${wordCol}...`)

    const [ uniqueVals ] = await connection.query(`SELECT DISTINCT \`${wordCol}\` FROM lxxWords`)
    const updates = []

    // loop word or parsing
    for(let uniqueValRow of uniqueVals) {
      const uniqueVal = uniqueValRow[wordCol]
      if(!uniqueVal) continue

      const scopeMap = {}
      const [ allWordsWithThisUniqueVal ] = await connection.query(`SELECT * FROM lxxWords WHERE \`${wordCol}\`= ? ORDER BY bookId, verseNumber, wordNumber`, [ uniqueVal ])

      for(let word of allWordsWithThisUniqueVal) {

        const key = `${word.bookId}:${word.verseNumber}`

        const info = getWordInfoFromWordRow(word)

        const originalRefs = getCorrespondingRefs({
          baseVersion: {
            info: {
              versificationModel: 'lxx',
            },
            ref: word,
          },
          lookupVersionInfo: {
            versificationModel: 'original',
          },
        })

        // Do not include deuterocanonical books (or passages) in default Bible Tags searches.
        if(!originalRefs) {
          const loc = getLocFromRef(word)
          if(!versificationErrorsAlreadyNotes[loc]) {
            versificationErrorsAlreadyNotes[loc] = true
          }
          continue
        }

        scopeMap[key] = scopeMap[key] || []
        scopeMap[key].push(info)

        if(originalRefs.length > 2) originalRefs.splice(1, originalRefs.length - 2)
        bookIdAndVerseNumberToLocMap[`verseNumber:${key}`] = originalRefs.map(originalRef => getLocFromRef(originalRef).split(':')[0]).join('-')

      }

      updates.push(`INSERT INTO lxxUnitWords (id, scopeMap) VALUES ('verseNumber:${wordCol}:${uniqueVal}', '${JSON.stringify(scopeMap).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')`)

    }

    const chunkSize = 500
    for(let idx=0; idx<updates.length; idx+=chunkSize) {
      await connection.query(updates.slice(idx, idx+chunkSize).join(';'))
    }
    console.log(`  ...${updates.length} rows inserted.\n`)

  }

  if(Object.values(versificationErrorsAlreadyNotes).length > 0) {
    console.log(``)
    console.log(`Versification warnings (LXX does not coorespond to original):`)
    console.log(``)
    console.log(Object.keys(versificationErrorsAlreadyNotes).sort().join(`\n`))
    console.log(``)
  }

  console.log(`Starting unit ranges...`)

  const updates = []
  for(let bookIdAndVerseNumber in bookIdAndVerseNumberToLocMap) {
    updates.push(`INSERT INTO lxxUnitRanges (id, originalLoc) VALUES ('${bookIdAndVerseNumber}', '${bookIdAndVerseNumberToLocMap[bookIdAndVerseNumber]}')`)
  }

  const chunkSize = 500
  for(let idx=0; idx<updates.length; idx+=chunkSize) {
    await connection.query(updates.slice(idx, idx+chunkSize).join(';'))
  }
  console.log(`  ...${updates.length} rows inserted.\n`)

  console.log(`\nCOMPLETED\n`)
  process.exit()

})()
