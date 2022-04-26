const Database = require('better-sqlite3')
const fs = require('fs-extra')
const { Op } = require('sequelize')
require('dotenv').config()

const mysql = require('mysql2/promise')

;(async() => {

  const connection = await mysql.createConnection({
    host: process.env.DB_NAME || "localhost",
    database: process.env.HOST || 'bibletags',
    user: process.env.USERNAME || "root",
    password: process.env.PASSWORD || "",
    multipleStatements: true,
  })

  console.log(`\nSTARTING updateOriginalSearchTablesInAppsDefaultTenant...\n`)

  const typesByText = {
    uhb: [
      'aspect',
      'b',
      'definitionId',
      'form',
      'gender',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'isAramaic',
      'k',
      'l',
      'lemma',
      'm',
      'n',
      'number',
      'person',
      'pos',
      'sh',
      'state',
      'stem',
      'suffixGender',
      'suffixNumber',
      'suffixPerson',
      'type',
      'v',
    ],
    ugnt: [
      'aspect',
      'attribute',
      'case',
      'definitionId',
      'form',
      'gender',
      'lemma',
      'mood',
      'number',
      'person',
      'pos',
      'type',
      'voice',
    ],
  }

  let numRows = 0
  let numDbs = 0
  const searchDir = `../bibletags-react-native-app/defaultTenant/assets/versions/original/search`
  await fs.remove(`${searchDir}/lemmas.db`)
  await fs.ensureDir(searchDir)

  for(let text in typesByText) {

    // create the unitWords sqlite files

    for(let type of typesByText[text]) {

      const [ unitWords ] = await connection.query(`SELECT * FROM ${text}UnitWords WHERE id LIKE "verseNumber:${type}:%" ORDER BY id`)

      const db = new Database(`${searchDir}/${text}UnitWords-${type}.db`)
      const tableName = `${text}UnitWords`

      const create = db.prepare(
        `CREATE TABLE ${tableName} (
          id TEXT PRIMARY KEY,
          scopeMap TEXT
        );`
      )
      create.run()
      numDbs++

      const insert = db.prepare(`INSERT INTO ${tableName} (id, scopeMap) VALUES (@id, @scopeMap)`)
      db.transaction(() => {
        unitWords.forEach(({ id, scopeMap }) => {
          insert.run({ id, scopeMap: JSON.stringify(scopeMap) })
          numRows++
        })
      })()

    }

    // create the unitRanges sqlite files

    const [ unitRanges ] = await connection.query(`SELECT * FROM ${text}UnitRanges ORDER BY id`)

    const db = new Database(`${searchDir}/${text}UnitRanges.db`)
    const tableName = `${text}UnitRanges`

    const create = db.prepare(
      `CREATE TABLE ${tableName} (
        id TEXT PRIMARY KEY,
        originalLoc TEXT
      );`
    )
    create.run()
    numDbs++

    const insert = db.prepare(`INSERT INTO ${tableName} (id, originalLoc) VALUES (@id, @originalLoc)`)
    db.transaction(() => {
      unitRanges.forEach(({ id, originalLoc }) => {
        insert.run({ id, originalLoc })
        numRows++
      })
    })()

  }

  // create the lemmas sqlite file

  const [ lemmas ] = await connection.query(`SELECT * FROM lemmas ORDER BY id`)

  const db = new Database(`${searchDir}/lemmas.db`)
  const tableName = `lemmas`

  const create = db.prepare(
    `CREATE TABLE ${tableName} (
      id TEXT PRIMARY KEY,
      nakedLemma TEXT
    );`
  )
  create.run()
  numDbs++

  const insert = db.prepare(`INSERT INTO ${tableName} (id, nakedLemma) VALUES (@id, @nakedLemma)`)
  db.transaction(() => {
    lemmas.forEach(({ id, nakedLemma }) => {
      insert.run({ id, nakedLemma })
      numRows++
    })
  })()

  console.log(`  ...${numRows} rows inserted in ${numDbs} db's.\n`)

  console.log(`\nCOMPLETED\n`)
  process.exit()

})()