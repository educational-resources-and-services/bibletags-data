require('dotenv').config()

const { setUpConnection } = require('./connect')

;(async () => {

  setUpConnection({ setUpCascadeDeletes: true })

  try {
  await global.connection.query(
    `
      SET FOREIGN_KEY_CHECKS = 0;
      ${
        Object.keys(global.connection.models)
          .filter(model => (
            ![
              'uhbVerse',
              'uhbWord',
              'ugntVerse',
              'ugntWord',
              'definition',
            ].includes(model)
          ))
          .map(model => `TRUNCATE table ${global.connection.models[model].tableName};`)
          .join('')
      }
      SET FOREIGN_KEY_CHECKS = 1;
    `
  )

  await global.connection.sync({ alter: true })
  await global.connection.authenticate()
} catch(e) { console.log('eee', e)}

  console.log('Database reset.')
  process.exit()

})()