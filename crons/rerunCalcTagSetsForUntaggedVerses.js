const { Op } = require('sequelize')

const { setUpConnection } = require('../src/db/connect')
const calculateTagSets = require('../src/calculateTagSets')
const { getVersionTables } = require('../src/utils')
const sendEmail = require('../src/email/sendEmail')
const { adminEmail } = require('../src/constants')

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

    for(let idx=0; idx<versions.length; idx++) {
      if(parseInt(idx, 10) % 7 !== day) continue  // for each version, only run once per week

      const versionId = versions[idx].id
      const { tagSetTable } = await getVersionTables(versionId)

      const tagSets = await tagSetTable.findAll({
        where: {
          status: [ 'automatch', 'none' ],
          loc: {
            [Op.regexp]: `^0?(${bookIdsToDo})[0-9]{6}`,
          },
        },
      })

      console.log(`rerunCalcTagSetsForUntaggedVerses cron – versionId: ${versionId}, bookIds: ${bookIdsToDo}, ${tagSets.length} tag sets to do (${Math.ceil((Date.now() - now)/1000)}s – cron id:${cronId})`)

      let count = 0
      for(let currentTagSet of tagSets) {

        await global.connection.transaction(async t => {
          await calculateTagSets({
            currentTagSet,
            versionId,
            t,
          })
        })

        if(++count % 100 === 0) {
          const currentSeconds = Math.ceil((Date.now() - now)/1000)
          console.log(`rerunCalcTagSetsForUntaggedVerses cron – versionId: ${versionId}, bookIds: ${bookIdsToDo}, ${count}/${tagSets.length} tag sets done (${currentSeconds}s – cron id:${cronId})`)

          if(currentSeconds > 60 * 14) {
            await sendEmail({
              models,
              toAddrs: adminEmail,
              subject: `Cron rerunCalcTagSetsForUntaggedVerses ran out of time (day: ${day}, bookIds: ${bookIdsToDo})`,
              body: `
              ${idx} out of ${Math.ceil(versions.length/7)} versions done before running out of time.
                <br><br>
                If this happen repeatedly, reevaluate how to handle this cron.
              `,
            })
            throw `ran out of time at ${currentSeconds} seconds`
          }
        }

      }

      console.log(`rerunCalcTagSetsForUntaggedVerses cron – completed ${tagSets.length} tag sets – versionId: ${versionId}, bookIds: ${bookIdsToDo} (${Math.ceil((Date.now() - now)/1000)}s – cron id:${cronId})`)

    }

    console.log(`...completed cron run for rerunCalcTagSetsForUntaggedVerses in ${Math.ceil((Date.now() - now)/1000)} seconds (cron id:${cronId}).`)

  } catch(err) {
    console.error(`cron rerunCalcTagSetsForUntaggedVerses failed (cron id:${cronId}).`, err)
    delete global.connection  // to make sure it is reset next time
  }
}

module.exports = rerunCalcTagSetsForUntaggedVerses