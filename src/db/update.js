require('dotenv').config()

const { setUpConnection } = require('./connect')

;(async () => {

  try {

    setUpConnection({ setUpCascadeDeletes: true })

    await global.connection.sync({ alter: true })
    await global.connection.authenticate()
    
    console.log('Database updated.')
    process.exit()

  } catch(e) { console.log(e) }

})()