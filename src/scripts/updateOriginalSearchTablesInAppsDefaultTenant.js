const Database = require('better-sqlite3')
const fs = require('fs-extra')
const { Op } = require('sequelize')
require('dotenv').config()

const { setUpConnection } = require('../db/connect')

;(async() => {

  if(!global.connection) {
    console.log('Establishing DB connection...')
    setUpConnection()
    await global.connection.authenticate()
    console.log('...DB connection established.')
  }

  const { models } = global.connection

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
  const baseDir = `../bibletags-react-native-app/defaultTenant/versions/original`
  const bundledBaseDir = `../bibletags-react-native-app/defaultTenant/assets/bundledVersions/original`
  const searchDir = `${baseDir}/search`
  await fs.remove(searchDir)
  await fs.ensureDir(searchDir)

  for(let text in typesByText) {

    // create the unitWords sqlite files

    for(let type of typesByText[text]) {

      const [ unitWords ] = await global.connection.query(`SELECT * FROM ${text}UnitWords WHERE id LIKE "verseNumber:${type}:%" ORDER BY id`)

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
          insert.run({ id, scopeMap })
          numRows++
        })
      })()

    }

    // create the unitRanges sqlite files

    const [ unitRanges ] = await global.connection.query(`SELECT * FROM ${text}UnitRanges ORDER BY id`)

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

  {  // create the lemmas sqlite file
    const [ lemmas ] = await global.connection.query(`SELECT * FROM lemmas ORDER BY id`)

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
  }

  {  // create the definitions sqlite file
    const definitions = await models.definition.findAll({
      include: [
        {
          model: models.partOfSpeech,
          attributes: [ 'pos' ],
          required: false,
        },
      ],
      order: [ 'id' ]
    })

    await fs.remove(`${baseDir}/definitions.db`)
    const db = new Database(`${baseDir}/definitions.db`)
    const tableName = `definitions`

    const create = db.prepare(
      `CREATE TABLE ${tableName} (
        id TEXT PRIMARY KEY,
        lex TEXT,
        nakedLex TEXT,
        lexUnique INTEGER,
        vocal TEXT,
        simplifiedVocal TEXT,
        hits INTEGER,
        lxx TEXT,
        lemmas TEXT,
        forms TEXT,
        pos TEXT
      );`
    )
    create.run()
    numDbs++

    const insert = db.prepare(`INSERT INTO ${tableName} (id, lex, nakedLex, lexUnique, vocal, simplifiedVocal, hits, lxx, lemmas, forms, pos) VALUES (@id, @lex, @nakedLex, @lexUnique, @vocal, @simplifiedVocal, @hits, @lxx, @lemmas, @forms, @pos)`)
    db.transaction(() => {
      definitions.forEach(({ dataValues, partOfSpeeches }) => {
        insert.run({
          ...dataValues,
          lexUnique: dataValues.lexUnique ? 1 : 0,
          lxx: JSON.stringify(dataValues.lxx),
          lemmas: JSON.stringify(dataValues.lemmas),
          forms: JSON.stringify(dataValues.forms),
          pos: JSON.stringify(partOfSpeeches.map(({ pos }) => pos)),
        })
        numRows++
      })
    })()

    await fs.copy(`${baseDir}/definitions.db`, `${bundledBaseDir}/definitions.db`, { overwrite: true })
  }

  // report

  console.log(`  ...${numRows} rows inserted in ${numDbs} db's.\n`)

  console.log(`\nCOMPLETED\n`)
  process.exit()

})()