require('dotenv').config()

const { setUpConnection } = require('./connect')

;(async () => {

  setUpConnection({ setUpCascadeDeletes: true })

  const versionTables = (
    (await global.connection.query(`SHOW TABLES`))[0].map(row => Object.values(row)[0])
      .filter(tbl => /(?:TagSets|WordHashesSetSubmissions|WordHashesSubmissions)$/.test(tbl))
  )

  await global.connection.query(
    `
      SET FOREIGN_KEY_CHECKS = 0;
      ${
        Object.keys(global.connection.models)
          .filter(model => (
            ![
              'uhbVerse',
              'uhbWord',
              'uhbUnitWord',
              'uhbUnitRange',
              'ugntVerse',
              'ugntWord',
              'ugntUnitWord',
              'ugntUnitRange',
              'definition',
              'partOfSpeech',
              'languageSpecificDefinition',
              'lemma',
            ].includes(model)
          ))
          .map(model => `TRUNCATE table ${global.connection.models[model].tableName};`)
          .join('')
      }
      ${
        versionTables
          .map(tbl => `DROP TABLE ${tbl};`)
          .join('')
      }
      SET FOREIGN_KEY_CHECKS = 1;
    `
  )

  console.log('Database reset.')
  process.exit()

})()