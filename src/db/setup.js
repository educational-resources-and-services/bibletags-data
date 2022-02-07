require('dotenv').config()

const { setUpConnection } = require('./connect')

;(async () => {

  try {

    setUpConnection({ setUpCascadeDeletes: true })

    await global.connection.sync({ force: true })
    await global.connection.authenticate()

    console.log('Database setup.')
    process.exit()

  } catch(e) { console.log(e) }

})()