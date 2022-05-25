require('dotenv').config()

const { getLocFromRef } = require('@bibletags/bibletags-versification');
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
    host: process.env.DB_NAME || "localhost",
    database: process.env.HOST || 'bibletags',
    user: process.env.USERNAME || "root",
    password: process.env.PASSWORD || "",
    multipleStatements: true,
  })

  console.log(`\nSTARTING populateUGNTUnitWordsTable...\n`)

  await connection.query(`TRUNCATE ugntUnitWords`)

  const bookIdAndVerseNumberToLocMap = {}

  // loop columns
  for(let wordCol of wordColumnsToUse) {

    console.log(`Starting ${wordCol}...`)

    const [ uniqueVals ] = await connection.query(`SELECT DISTINCT \`${wordCol}\` FROM ugntWords`)
    const updates = []

    // loop word or parsing
    for(let uniqueValRow of uniqueVals) {
      const uniqueVal = uniqueValRow[wordCol]
      if(!uniqueVal) continue

      const scopeMap = {}
      const [ allWordsWithThisUniqueVal ] = await connection.query(`SELECT * FROM ugntWords WHERE \`${wordCol}\`= ? ORDER BY bookId, verseNumber, wordNumber`, [ uniqueVal ])

      for(let word of allWordsWithThisUniqueVal) {

        const key = `${word.bookId}:${word.verseNumber}`
        scopeMap[key] = scopeMap[key] || []

        const info = getWordInfoFromWordRow(word)

        scopeMap[key].push(info)

        bookIdAndVerseNumberToLocMap[`verseNumber:${key}`] = getLocFromRef(word)

      }

      updates.push(`INSERT INTO ugntUnitWords (id, scopeMap) VALUES ('verseNumber:${wordCol}:${uniqueVal}', '${JSON.stringify(scopeMap).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')`)

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
    updates.push(`INSERT INTO ugntUnitRanges (id, originalLoc) VALUES ('${bookIdAndVerseNumber}', '${bookIdAndVerseNumberToLocMap[bookIdAndVerseNumber]}')`)
  }

  const chunkSize = 500
  for(let idx=0; idx<updates.length; idx+=chunkSize) {
    await connection.query(updates.slice(idx, idx+chunkSize).join(';'))
  }
  console.log(`  ...${updates.length} rows inserted.\n`)

  console.log(`\nCOMPLETED\n`)
  process.exit()

})()
