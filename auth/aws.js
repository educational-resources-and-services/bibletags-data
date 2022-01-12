const aws = require('aws-sdk')
const MessageValidator = require('sns-validator')

const defaultFromEmail = 'no-reply@bibletags.org'

// email setup
const sesConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
}
if(process.env.AWS_KEY && process.env.AWS_SECRET) {
  sesConfig.accessKeyId = process.env.AWS_KEY
  sesConfig.secretAccessKey = process.env.AWS_SECRET
}
const ses = new aws.SES(sesConfig)

const sendEmail = getModels => (input => {

  const models = getModels()
  let { toAddrs, fromAddr=process.env.AWS_FROM_ADDRESS, replyToAddrs, subject, body, res } = input

  if(input instanceof Array) {
    return new Promise((resolve, reject) => {
      const sendEmails = () => {
        if(input.length > 0) {
          const nextEmailInput = input.pop()
          sendEmail(getModels)(nextEmailInput).then(() => sendEmails())
        } else {
          resolve(true)
        }
      }
      sendEmails()
    })
  }

  return new Promise((resolve, reject) => {

    toAddrs = toAddrs instanceof Array ? toAddrs : [toAddrs]
    fromAddr = fromAddr || process.env.DEFAULT_FROM_ADDRESS || defaultFromEmail
    replyToAddrs = replyToAddrs || fromAddr
    replyToAddrs = replyToAddrs instanceof Array ? replyToAddrs : [replyToAddrs]

    // if there is a WHITELISTED_EMAILS list, do a fake send to any email not on it
    if(process.env.WHITELISTED_EMAILS) {
      const whitelistedEmails = process.env.WHITELISTED_EMAILS.split(' ')
      toAddrs = toAddrs.filter(toAddr => whitelistedEmails.includes(
        toAddr
          .replace(/^.*?<([^>]+)>.*$/, '$1')
          .replace(/\+[0-9]+@/, '@')
      ))
      if(toAddrs.length == 0) return resolve(true)
    }

    models.blackListedEmail.findOne({
      where: {
        email: {
          $in: toAddrs,
        },
      },
    }).then(blackListedEmail => {
      if(blackListedEmail) {
        throw(new Error('black-listed email'))
        return
      }
  
      ses.sendEmail({
        Destination: {
          ToAddresses: toAddrs,
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8", 
              Data: body,
            }, 
          }, 
          Subject: {
            Charset: "UTF-8", 
            Data: subject,
          }
        }, 
        Source: fromAddr, 
        ReplyToAddresses: replyToAddrs,
      }, (err, data) => {
        if(err) {
          console.log('Email error: ', err, toAddrs, fromAddr, replyToAddrs, subject, body)
          if(res) {
            res.status(500).send(err.message || 'email send failed')
          } else {
            reject(err.message || 'email send failed')
          }
        } else {
          return resolve(true)
        }
      })
    })
  })
})

const handleBounces = ({ getConnection }) => ((req, res, next) => {

  const connection = getConnection()

  // req = {
  //   body: {
  //     mail: {
  //       source: 'no-reply@bibletags.org'
  //     },
  //     // bounce: {
  //     //   bounceType: 'Perm',
  //     //   bouncedRecipients: [
  //     //     {
  //     //       emailAddress: 'test1@example.com',
  //     //     },
  //     //     {
  //     //       emailAddress: 'test2@example.com',
  //     //     },
  //     //   ],
  //     // },
  //     complaint: {
  //       complainedRecipients: [
  //         {
  //           emailAddress: 'test3@example.com',
  //         },
  //       ],
  //     },
  //   },
  //   headers: {
  //     host: 'bounces-and-complaints.bibletags.org',
  //     "x-amz-sns-message-type": 'Notification',
  //   },
  // }
  if(req.headers.host === 'bounces-and-complaints.bibletags.org') {
    console.log('bounces-and-complaints req.headers', req.headers)
  }

  if(req.headers.host !== 'bounces-and-complaints.bibletags.org' || req.headers['x-amz-sns-message-type'] !== 'Notification') {
    return next()
  }

  // console.log('bounces-and-complaints req.body', req.body)

  const validator = new MessageValidator()
  validator.validate(req.body, (err, message) => {
    if(err) {
        // Your message could not be validated. 
        console.log('Rejected SNS message.', err, req.body)
        return res.send('rejected')
    }

    // message has been validated and its signature checked. 

    if(req.body.mail && (req.body.bounce || req.body.complaint)) {
      if(req.body.bounce) {
        if(req.body.bounce.bounceType !== 'Transient') {
          req.body.bounce.bouncedRecipients.forEach(bouncedRecipient => {
            connection.models.blackListedEmail.create({
              email: bouncedRecipient.emailAddress,
              cause: 'BOUNCE',
            })
          })
        }
      } else if(req.body.complaint) {
        req.body.complaint.complainedRecipients.forEach(complainedRecipient => {
          connection.models.blackListedEmail.create({
            email: complainedRecipient.emailAddress,
            cause: 'COMPLAINT',
          })
        })
      }
    }
    return res.send('received')
  })
})

module.exports = {
  sendEmail,
  handleBounces,
}