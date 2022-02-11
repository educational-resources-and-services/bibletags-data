require('dotenv').config()

const { getLocFromRef } = require('@bibletags/bibletags-versification');
const mysql = require('mysql2/promise')

const wordColumnsToUse = [
  "form",
  "definitionId",
  "lemma",
  "isAramaic",
  "b",
  "l",
  "k",
  "m",
  "sh",
  "v",
  "h1",
  "h2",
  "h3",
  "pos",
  "stem",
  "aspect",
  "type",
  "person",
  "gender",
  "number",
  "state",
  "h4",
  "h5",
  "n",
  "suffixPerson",
  "suffixGender",
  "suffixNumber",
]

;(async() => {

  const connection = await mysql.createConnection({
    host: process.env.DB_NAME || "localhost",
    database: process.env.HOST || 'bibletags',
    user: process.env.USERNAME || "root",
    password: process.env.PASSWORD || "",
    multipleStatements: true,
  })

  console.log(`\nSTARTING...\n`)

  await connection.query(`TRUNCATE uhbUnitWords`)

  const bookIdAndVerseNumberToLocMap = {}

  // loop columns
  for(let wordCol of wordColumnsToUse) {

    console.log(`Starting ${wordCol}...`)

    const [ uniqueVals ] = await connection.query(`SELECT DISTINCT \`${wordCol}\` FROM uhbWords`)
    const updates = []

    // loop word or parsing
    for(let uniqueValRow of uniqueVals) {
      const uniqueVal = uniqueValRow[wordCol]
      if(!uniqueVal) continue

      const scopeMap = {}
      const [ allWordsWithThisUniqueVal ] = await connection.query(`SELECT * FROM uhbWords WHERE \`${wordCol}\`= ? ORDER BY bookId, verseNumber, wordNumber`, [ uniqueVal ])

      for(let word of allWordsWithThisUniqueVal) {

        const key = `${word.bookId}:${word.verseNumber}`
        scopeMap[key] = scopeMap[key] || []

        const info = [
          word.wordNumber,
          word.form,
          word.definitionId ? parseInt(word.definitionId.slice(1), 10) : 0,
          word.lemma || 0,
          `H${word.type || `${word.pos}_`}${word.stem || '__'}${word.aspect || '_'}${word.person || '_'}${word.gender || '_'}${word.number || '_'}${word.state || '_'}`,
        ]

        const booleanColInfo = (
          ['isAramaic','b','l','k','m','sh','v','h1','h2','h3','h4','h5','n']
            .map(col => (
              word[col]
                ? col.slice(-1)
                : ''
            ))
            .join('')
        )
        const suffixInfo = (
          word.suffixPerson
            ? `${word.suffixPerson}${word.suffixGender}${word.suffixNumber}`
            : ''
        )

        if(booleanColInfo || suffixInfo) {
          info.push(booleanColInfo)
          if(suffixInfo) {
            info.push(suffixInfo)
          }
        }

        scopeMap[key].push(info)

        bookIdAndVerseNumberToLocMap[`verseNumber:${key}`] = getLocFromRef(word)

      }

      updates.push(`INSERT INTO uhbUnitWords (id, scopeMap) VALUES ('verseNumber:${wordCol}:${uniqueVal}', '${JSON.stringify(scopeMap).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')`)

    }

    const chunkSize = 500
    for(let idx=0; idx<updates.length; idx+=chunkSize) {
      await connection.query(updates.slice(idx, idx+chunkSize).join(';'))
    }
    console.log(`  ...${updates.length} rows inserted.\n`)

  }

  console.log(`Starting unit ranges...`)

  const updates = []
  for(let bookIdAndVerseNumber in bookIdAndVerseNumberToLocMap) {
    updates.push(`INSERT INTO uhbUnitRanges (id, originalLoc) VALUES ('${bookIdAndVerseNumber}', '${bookIdAndVerseNumberToLocMap[bookIdAndVerseNumber]}')`)
  }

  const chunkSize = 500
  for(let idx=0; idx<updates.length; idx+=chunkSize) {
    await connection.query(updates.slice(idx, idx+chunkSize).join(';'))
  }
  console.log(`  ...${updates.length} rows inserted.\n`)

  console.log(`\nCOMPLETED\n`)
  process.exit()

})()
