const { setUpConnection } = require('../src/db/connect')
const buildPages = require('../src/buildPages')

const rebuildAllPages = async () => {
  const cronId = parseInt(Math.random() * 999999)
  console.log(`Beginning cron run for rebuildAllPages (cron id:${cronId})...`)

  const now = Date.now()

  try {

    // Connect to DB if not already connected
    if(!global.connection) {
      console.log(`Establishing DB connection for rebuildAllPages (cron id:${cronId})...`)
      setUpConnection()
      await global.connection.authenticate()
      console.log(`...DB connection established for rebuildAllPages (cron id:${cronId}).`)
    }

    await buildPages()

    console.log(`...completed cron run for rebuildAllPages in ${(Date.now() - now)/1000} seconds (cron id:${cronId}).`)

  } catch(err) {
    console.error(`cron rebuildAllPages failed (cron id:${cronId}).`, err)
    delete global.connection  // to make sure it is reset next time
  }

}

module.exports = rebuildAllPages