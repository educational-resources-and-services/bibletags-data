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

  console.log(`\nSTARTING createUHBDefAndPOS...`)

  const [ hasBdb ] = await utils.queryAsync({ connection, statement: `SHOW TABLES LIKE 'bdb'` })

  if(!hasBdb) {
    const sqlImport = (await fs.readFile(`src/data/bdb.sql`)).toString()
    await utils.queryAsync({ connection, statement: sqlImport })
  }

  const badStrongs = {}
  const bdbHasEntryByStrongs = {}
  const uniqueStateOfLexemes = {}
  let bdbOnlyCount = 0
  const updates = []

  const normalizeStrongs = strongs => {
    if(!/^H/.test(strongs)) return strongs
    const endDigit = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
    }[strongs.slice(-1)] || 0
    return `H${`000${strongs.replace(/[^0-9]/g, '')}`.slice(-4)}${endDigit}`
  }

  await utils.queryAsync({ connection, statement: `DELETE FROM partOfSpeeches WHERE definitionId LIKE 'H%'` })

  const addOnUpdates = async ({ strongs, lex, vocal="" }) => {

    const statement2 = `SELECT pos, wordNumber, lemma, form FROM uhbWords WHERE definitionId="${strongs}"`

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
        console.log(`  - Lex value not found among lemmas.`, lex, lemmas)
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
      bdbOnlyCount++
    }

  }

  const statement = `SELECT * FROM bdb WHERE src NOT LIKE "See <b data-stgs=%" OR src IS NULL`
  const result = await utils.queryAsync({ connection, statement })
  result.forEach(row => {
    const strongs = normalizeStrongs(row.id)
    bdbHasEntryByStrongs[strongs] = true
    uniqueStateOfLexemes[row.word] = uniqueStateOfLexemes[row.word] ? 0 : 1
  })

  // get all distinct strongs from uhbWords and see if there are any not in bdbHasEntryByStrongs
  const statement3 = `SELECT DISTINCT definitionId, lemma FROM uhbWords`
  const result3 = await utils.queryAsync({ connection, statement: statement3 })
  const missingStrongs = []
  for(let row3 of result3) {
    const strongs = row3.definitionId
    if(strongs && !bdbHasEntryByStrongs[row3.definitionId]) {
      if(missingStrongs.includes(strongs)) {
        if(
          strongs !== `H39190`  // already dealt with below
          && !(strongs === `H69570` && row3.lemma === `קַו`)  // checks out
        ) {
          console.log(`  **** word in uhbWords that is not in bdb has multiple lemmas`, strongs)
        }
      } else {
        let lex = row3.lemma
        if(lex === `לוּשׁ`) lex = `לָֽיִשׁ`
        missingStrongs.push(strongs)
        uniqueStateOfLexemes[lex] = uniqueStateOfLexemes[lex] ? 0 : 1
        await addOnUpdates({ strongs, lex })
      }
    }
  }

  await Promise.all(result.map(async row => {
    const strongs = normalizeStrongs(row.id)

    if(!strongs.match(/^H[0-9]{5}$/)) {
      badStrongs[strongs] = true
      return
    }

    await addOnUpdates({ strongs, lex: row.word, vocal: row.xlit })
  }))

  console.log(`  - ${bdbOnlyCount} words in bdb, but not in uhbWords.`)
  console.log(`  - Strongs numbers skipped due to bad formation: ${Object.keys(badStrongs).join(', ')}`)

  const numRowsUpdated = await utils.doUpdatesInChunksAsync({ connection, updates })
  console.log(`\n  ${numRowsUpdated} rows inserted.\n`)

  missingStrongs.forEach(strongs => {
    console.log(`  - ${strongs} in uhbWords, but not in bdb. 'lex' has been added from lemmas, but 'vocal' remains blank.`)
  })

  console.log(`\nCOMPLETED\n`)
  process.exit()

})
