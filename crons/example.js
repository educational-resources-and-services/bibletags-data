const { Op, fn } = require('sequelize')

const { setUpConnection } = require('../src/db/connect')

const example = async () => {
  const cronId = parseInt(Math.random() * 999999)
  console.log(`Beginning cron run (cron id:${cronId})...`)

  const now = Date.now()

  try {

    // Connect to DB if not already connected
    if(!global.connection) {
      console.log(`Establishing DB connection (cron id:${cronId})...`)
      setUpConnection()
      await global.connection.authenticate()
      console.log(`...DB connection established (cron id:${cronId}).`)
    }

    const { models } = global.connection

    await global.connection.transaction(async t => {



    })

    console.log(`...completed cron run (cron id:${cronId}).`)

  } catch(err) {
    console.error(`cron failed (cron id:${cronId}).`, err)
    delete global.connection  // to make sure it is reset next time
  }
}

module.exports = example