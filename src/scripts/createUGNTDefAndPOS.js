require('dotenv').config()

const mysql = require('mysql2')
const fs = require('fs').promises
const { stripGreekAccents, stripHebrewVowelsEtc, stripVocalOfAccents } = require('@bibletags/bibletags-ui-helper')

const utils = require('./utils')

const connection = mysql.createConnection({
  host: process.env.DB_NAME || "localhost",
  database: process.env.HOST || 'bibletags',
  user: process.env.USERNAME || "root",
  password: process.env.PASSWORD || "",
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

    if(result2.length > 0) {

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

      lemmas = JSON.stringify([ ...new Set(lemmas.sort()) ])
      forms = JSON.stringify([ ...new Set(forms.sort()) ])

      const simplifiedVocal = stripVocalOfAccents(vocal)
      if(/[^- a-z]/.test(simplifiedVocal)) throw `Unexpected char in vocal: ${simplifiedVocal}`

      const defUpdate = {
        lex,
        nakedLex: stripGreekAccents(stripHebrewVowelsEtc(lex)).toLowerCase(),
        lexUnique: uniqueStateOfLexemes[lex],
        vocal,
        simplifiedVocal,
        hits,
        // lxx: JSON.stringify([]),  // this info is not yet known
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
    uniqueStateOfLexemes[row.word] = uniqueStateOfLexemes[row.word] ? 0 : 1
  })

  // get all distinct strongs from ugntWords and see if there are any not in dodsonHasEntryByStrongs
  const statement3 = `SELECT DISTINCT definitionId, lemma FROM ugntWords`
  const result3 = await utils.queryAsync({ connection, statement: statement3 })
  const missingStrongs = []
  for(let row3 of result3) {
    const strongs = row3.definitionId
    if(!dodsonHasEntryByStrongs[strongs]) {
      if(missingStrongs.includes(strongs)) {
        if(
          (strongs !== 'G41775' && row3.lemma === 'πολύ')  // this one already checks out; πολλά is the correct lex value
        ) {
          console.log(`  **** word in ugntWords that is not in dodson has multiple lemmas`, strongs)
        }
      } else {
        missingStrongs.push(strongs)
        uniqueStateOfLexemes[row3.lemma] = uniqueStateOfLexemes[row3.lemma] ? 0 : 1
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

  console.log(`  - ${dodsonOnlyCount} words in dodson, but not in ugntWords.`)
  console.log(`  - Strongs numbers skipped due to bad formation: ${Object.keys(badStrongs).join(', ')}`)

  const numRowsUpdated = await utils.doUpdatesInChunksAsync({ connection, updates })
  console.log(`\n  ${numRowsUpdated} rows inserted.\n`)

  missingStrongs.forEach(strongs => {
    console.log(`  - ${strongs} in ugntWords, but not in dodson. 'lex' has been added from lemmas, but 'vocal' remains blank.`)
  })

  console.log(`\nCOMPLETED\n`)
  process.exit()

})
