const { Op, fn } = require('sequelize')

const { setUpConnection } = require('../src/db/connect')
const calculateTagSets = require('../src/calculateTagSets')

const rerunCalcTagSetsForUntaggedVerses = async ({ day, halfHourIdx }) => {  // day: 0-6, halfHourIdx: 0-47
  const cronId = parseInt(Math.random() * 999999)
  console.log(`Beginning cron run for rerunCalcTagSetsForUntaggedVerses (cron id:${cronId})...`)

  const now = Date.now()
  const bookIds = Array(66).fill().map((x, idx) => idx+1)
  const bookIdsToDo = bookIds.filter(bookId => bookId % 48 === halfHourIdx).join('|')

  try {

    // Connect to DB if not already connected
    if(!global.connection) {
      console.log(`Establishing DB connection for rerunCalcTagSetsForUntaggedVerses (cron id:${cronId})...`)
      setUpConnection()
      await global.connection.authenticate()
      console.log(`...DB connection established for rerunCalcTagSetsForUntaggedVerses (cron id:${cronId}).`)
    }

    const { models } = global.connection

    const versions = await models.version.findAll({
      order: [[ 'id' ]],
    })

    for(let idx in versions) {
      if(parseInt(idx, 10) % 7 !== day) continue  // for each version, only run once per week

      const versionId = versions[idx].id

      const tagSets = await models.tagSet.findAll({
        where: {
          versionId,
          status: [ 'automatch', 'none' ],
          loc: {
            [Op.regexp]: `^0?(${bookIdsToDo})[0-9]{6}`,
          },
        },
      })

      console.log(`rerunCalcTagSetsForUntaggedVerses cron – versionId: ${versionId}, bookIds: ${bookIdsToDo}, ${tagSets.length} tag sets (cron id:${cronId})`)

      let count = 0
      for(let currentTagSet of tagSets) {
        await global.connection.transaction(async t => {
          await calculateTagSets({
            currentTagSet,
            t,
          })
        })
        if(++count % 100 === 0) console.log(`rerunCalcTagSetsForUntaggedVerses cron – ${count} tag sets done (cron id:${cronId})`)
      }

      console.log(`rerunCalcTagSetsForUntaggedVerses cron – completed versionId: ${versionId}, bookIds: ${bookIdsToDo} (cron id:${cronId})`)

    }

    console.log(`...completed cron run for rerunCalcTagSetsForUntaggedVerses in ${(Date.now() - now)/1000} seconds (cron id:${cronId}).`)

  } catch(err) {
    console.error(`cron rerunCalcTagSetsForUntaggedVerses failed (cron id:${cronId}).`, err)
    delete global.connection  // to make sure it is reset next time
  }
}

module.exports = rerunCalcTagSetsForUntaggedVerses