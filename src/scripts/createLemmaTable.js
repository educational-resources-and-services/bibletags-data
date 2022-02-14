require('dotenv').config()

const mysql = require('mysql2/promise')
const { stripGreekAccents, stripHebrewVowelsEtc } = require('@bibletags/bibletags-ui-helper')

;(async() => {

  const connection = await mysql.createConnection({
    host: process.env.DB_NAME || "localhost",
    database: process.env.HOST || 'bibletags',
    user: process.env.USERNAME || "root",
    password: process.env.PASSWORD || "",
    multipleStatements: true,
  })

  console.log(`\nSTARTING createLemmaTable...\n`)

  await connection.query(`TRUNCATE lemmas`)

  // get distinct lemmas
  const [ distinctLemmas ] = await connection.query(`
    SELECT DISTINCT lemma FROM uhbWords
    UNION
    SELECT DISTINCT lemma FROM ugntWords
    UNION
    SELECT DISTINCT lemma FROM lxxWords
  `)

  // insert to lemmas table
  const updates = []
  distinctLemmas.forEach(({ lemma }) => {
    if(lemma) {
      updates.push(`INSERT INTO lemmas (id, nakedLemma) VALUES ('${lemma}', '${stripGreekAccents(stripHebrewVowelsEtc(lemma)).toLowerCase()}')`)
    }
  })

  const chunkSize = 500
  for(let idx=0; idx<updates.length; idx+=chunkSize) {
    await connection.query(updates.slice(idx, idx+chunkSize).join(';'))
  }
  console.log(`  ...${updates.length} rows inserted.\n`)

  console.log(`\nCOMPLETED\n`)
  process.exit()

})()