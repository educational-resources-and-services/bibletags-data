const aws = require('aws-sdk')
const nodemailer = require("nodemailer")

// SES setup
const sesConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
}
if(process.env.AWS_ACCESS_KEY_ID_OVERRIDE && process.env.AWS_SECRET_ACCESS_KEY_OVERRIDE) {
  sesConfig.accessKeyId = process.env.AWS_ACCESS_KEY_ID_OVERRIDE
  sesConfig.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY_OVERRIDE
}
const ses = new aws.SES(sesConfig)

const executeSendEmail = async ({ queuedEmail }) => {

  const { toAddrs, ccAddrs, bccAddrs, fromAddr, replyToAddrs, subject, body, attachments } = queuedEmail

  try {

    // create Nodemailer SES transporter
    const transporter = nodemailer.createTransport({
      SES: { ses, aws },
    })

    // send some mail
    await transporter.sendMail({
      from: fromAddr,
      replyTo: replyToAddrs[0],
      to: toAddrs.join(', '),
      cc: ccAddrs.join(', '),
      bcc: bccAddrs.join(', '),
      subject,
      html: body,
      attachments,
    })

    queuedEmail.sentAt = Date.now()
    await queuedEmail.save()
    await queuedEmail.destroy()

  } catch(err) {

    console.log('Email error: ', err, JSON.stringify(queuedEmail))

    queuedEmail.error = err.message
    await queuedEmail.save()
    await queuedEmail.destroy()

    throw err

  }

}

module.exports = executeSendEmail