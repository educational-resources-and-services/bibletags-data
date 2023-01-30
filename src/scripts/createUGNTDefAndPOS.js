require('dotenv').config()

const mysql = require('mysql2')
const fs = require('fs').promises
const { normalizeSearchStr, stripVocalOfAccents } = require('@bibletags/bibletags-ui-helper')
const { getCorrespondingRefs } = require('@bibletags/bibletags-versification')

const utils = require('./utils')

const connection = mysql.createConnection({
  host: process.env.RDS_HOST || "localhost",
  database: process.env.RDS_DATABASE || 'BibleTags',
  user: process.env.RDS_USERNAME || "root",
  password: process.env.RDS_PASSWORD || "",
  multipleStatements: true,
})

connection.connect(async (err) => {
  if(err) throw err

  console.log(`\nSTARTING createUGNTDefAndPOS...`)

  const [ hasDodson ] = await utils.queryAsync({ connection, statement: `SHOW TABLES LIKE 'dodson'` })

  if(!hasDodson) {
    const sqlImport = (await fs.readFile(`src/data/dodson.sql`)).toString()
    await utils.queryAsync({ connection, statement: sqlImport })
  }

  const badStrongs = {}
  const dodsonHasEntryByStrongs = {}
  const uniqueStateOfLexemes = {}
  let dodsonOnlyCount = 0
  const updates = []

  const normalizeStrongs = strongs => {
    let endDigit
    if(!/\+/.test(strongs)) endDigit = 0
    if(/\+1/.test(strongs)) endDigit = 5
    if(endDigit === undefined) return ``
    return `G${`000${strongs.slice(1).replace(/\+.*$/, '')}`.slice(-4)}${endDigit}`
  }

  await utils.queryAsync({ connection, statement: `DELETE FROM partOfSpeeches WHERE definitionId LIKE 'G%'` })

  const addOnUpdates = async ({ strongs, lex, vocal="" }) => {

    const statement2 = `SELECT pos, wordNumber, lemma, form FROM ugntWords WHERE definitionId="${strongs}"`
    const result2 = await utils.queryAsync({ connection, statement: statement2 })

    const statement4 = `SELECT bookId, chapter, verse, pos, wordNumber, lemma, form FROM lxxWords WHERE definitionId="${strongs}"`
    const result4 = await utils.queryAsync({ connection, statement: statement4 })

    if(result2.length > 0 || result4.length > 0) {

      let lexHasMatchingLemma = true
      let hits = 0
      let lemmas = []
      let forms = []
      result2.forEach(({ wordNumber, lemma, form }) => {
        hits += (wordNumber ? 1 : 0)
        lemmas.push(lemma)
        forms.push(form)
        lexHasMatchingLemma = lexHasMatchingLemma || lemma === word.lex
      })

      let lxx = 0
      result4.forEach(word => {
        const { wordNumber, lemma, form } = word
        lemmas.push(lemma)
        forms.push(form)
        lexHasMatchingLemma = lexHasMatchingLemma || lemma === word.lex

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

        // Do not include deuterocanonical books (or passages) in default statistics.
        if(originalRefs) {
          lxx += (wordNumber ? 1 : 0)
        }
      })

      lemmas = JSON.stringify([ ...new Set(lemmas.sort()) ])
      forms = JSON.stringify([ ...new Set(forms.sort()) ])

      const simplifiedVocal = stripVocalOfAccents(vocal)
      if(/[^- a-z]/.test(simplifiedVocal)) throw `Unexpected char in vocal: ${simplifiedVocal}`

      const defUpdate = {
        lex,
        nakedLex: normalizeSearchStr({ str: lex }),
        lexUnique: uniqueStateOfLexemes[lex],
        vocal,
        simplifiedVocal,
        hits,
        lxx,
        lemmas,
        forms,
      }

      const set = []

      for(let col in defUpdate) {
        set.push(`${col}="${(defUpdate[col] + '').replace(/"/g, '\\"')}"`)
      }

      updates.push(`UPDATE definitions SET ${set.join(", ")} WHERE id="${strongs}"`)

      if(!lexHasMatchingLemma) {
        console.log(`  **** Lex value not found among lemmas.`, lex, lemmas)
      }

      const posInKeys = {}

      result2.forEach(row2 => posInKeys[row2.pos] = true)
      result4.forEach(row2 => posInKeys[row2.pos] = true)

      Object.keys(posInKeys).forEach(pos => {

        const posInsert = {
          pos,
          definitionId: strongs,
        }
        
        updates.push(`INSERT INTO partOfSpeeches (${Object.keys(posInsert).join(", ")}) VALUES ('${Object.values(posInsert).join("', '")}')`)
      })

    } else {
      dodsonOnlyCount++
    }

  }

  const statement = `SELECT * FROM dodson`
  const result = await utils.queryAsync({ connection, statement })
  result.forEach(row => {
    const strongs = normalizeStrongs(row.id)
    dodsonHasEntryByStrongs[strongs] = true
    uniqueStateOfLexemes[row.word] = uniqueStateOfLexemes[row.word] === undefined ? 1 : 0
  })

  // get all distinct strongs from ugntWords and see if there are any not in dodsonHasEntryByStrongs
  const statement3 = `
    SELECT DISTINCT * FROM (
      SELECT DISTINCT definitionId, lemma FROM ugntWords
      UNION
      SELECT DISTINCT definitionId, lemma FROM lxxWords
    ) AS tbl
  `
  const result3 = await utils.queryAsync({ connection, statement: statement3 })
  const missingStrongs = []
  for(let row3 of result3) {
    const strongs = row3.definitionId
    if(!dodsonHasEntryByStrongs[strongs]) {
      if(missingStrongs.includes(strongs)) {
        if(
          (strongs !== 'G41775' && row3.lemma === 'πολύ')  // this one already checks out; πολλά is the correct lex value
        ) {
          console.log(`  **** word in ugntWords/lxxWords that is not in dodson has multiple lemmas`, strongs)
        }
      } else {
        missingStrongs.push(strongs)
        uniqueStateOfLexemes[row3.lemma] = uniqueStateOfLexemes[row3.lemma] === undefined ? 1 : 0
        await addOnUpdates({ strongs, lex: row3.lemma })
      }
    }
  }

  await Promise.all(result.map(async row => {
    const strongs = normalizeStrongs(row.id)

    if(!strongs.match(/^G[0-9]{5}$/)) {
      badStrongs[strongs] = true
      return
    }

    await addOnUpdates({ strongs, lex: row.word, vocal: row.xlit })
  }))

  console.log(`  - ${dodsonOnlyCount} words in dodson, but not in ugntWords/lxxWords.`)
  console.log(`  - Strongs numbers skipped due to bad formation: ${Object.keys(badStrongs).join(', ')}`)

  const numRowsUpdated = await utils.doUpdatesInChunksAsync({ connection, updates })
  console.log(`\n  ${numRowsUpdated} rows inserted.\n`)

  missingStrongs.filter(strongs => parseInt(strongs.slice(1),10) < 60000).forEach(strongs => {
    console.log(`  - ${strongs} in ugntWords, but not in dodson. 'lex' has been added from lemmas, but 'vocal' remains blank.`)
  })

  console.log(`\nCOMPLETED\n`)
  process.exit()

})
