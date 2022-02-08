require('dotenv').config()

const { setUpConnection } = require('./connect')

;(async () => {

  setUpConnection({ setUpCascadeDeletes: true })

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
            ].includes(model)
          ))
          .map(model => `TRUNCATE table ${global.connection.models[model].tableName};`)
          .join('')
      }
      SET FOREIGN_KEY_CHECKS = 1;
    `
  )

  console.log('Database reset.')
  process.exit()

})()