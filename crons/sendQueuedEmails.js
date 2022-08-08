const { Op } = require('sequelize')

const { setUpConnection } = require('../src/db/connect')
const executeSendEmail = require('../src/email/executeSendEmail')

const sendQueuedEmails = async () => {
  const cronId = parseInt(Math.random() * 999999)
  console.log(`Beginning cron run (cron id:${cronId})...`)

  try {

    // Connect to DB if not already connected
    if(!global.connection) {
      console.log(`Establishing DB connection (cron id:${cronId})...`)
      setUpConnection()
      await global.connection.authenticate()
      console.log(`...DB connection established (cron id:${cronId}).`)
    }

    const { models } = global.connection

    const order = [
      [
        'priority',
      ],
      [
        'createdAt',
        'DESC',
      ],
    ]

    const limit = 25

    const queuedEmails = await models.queuedEmail.findAll({
      order,
      limit,
    })

    if(queuedEmails.length > 0) {
      console.log(`send-queued-emails cron will now attempt to send ${queuedEmails.length} emails (cron id:${cronId})...`)
    }

    await Promise.all(
      queuedEmails.map(queuedEmail => (
        executeSendEmail({ queuedEmail })
      ))
    )

    console.log(`Delete old queued emails (cron id:${cronId})...`)
    await models.queuedEmail.destroy({
      where: {
        deletedAt: {
          [Op.lt]: Date.now() - (1000 * 60 * 60 * 24 * 60),  // sent more than two months ago
        },
      },
      force: true,
      paranoid: false,
    })

    console.log(`...completed cron run (cron id:${cronId}).`)

  } catch(err) {
    console.error(`cron failed (cron id:${cronId}).`, err)
    delete global.connection  // to make sure it is reset next time
  }
}

module.exports = sendQueuedEmails