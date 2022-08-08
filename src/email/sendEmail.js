const { i18n, isRTL } = require('inline-i18n')

const executeSendEmail = require('./executeSendEmail')
const { determineLocaleFromOptions } = require('../utils')

const {
  noReplyEmail,
} = require('../constants')

const sendEmail = async input => {

  if(input instanceof Array) {
    return Promise.all(input.map(sendEmail))
  }

  let {
    toAddrs,
    ccAddrs=[],
    bccAddrs=[],
    fromAddr,
    priority='NORMAL',
    referenceCode=null,
    replyToAddrs,
    subject,
    body,
    attachments,
    locale,
    req,
    includeLinkWillLoginMessage,
    noWrapper,
    models,
  } = input

  const i18nOptions = { textToHtml: true, locale, req }

  toAddrs = toAddrs instanceof Array ? toAddrs : [toAddrs]
  fromAddr = fromAddr || noReplyEmail
  replyToAddrs = replyToAddrs || fromAddr
  replyToAddrs = replyToAddrs instanceof Array ? replyToAddrs : [replyToAddrs]

  if(includeLinkWillLoginMessage) {
    body += `
      <p style="color: rgba(0,0,0,.5); font-size: 13px;">${i18n("Links and buttons will automatically log you in the first time they are used.", {}, i18nOptions)}</p>
    `  
  }

  if(!noWrapper) {
    const userName = toAddrs[0] && (!toAddrs[0].match(/^.+<[^>]+>$/) ? '' : toAddrs[0].replace(/ *<[^>]+>$/, ''))

    body = `
      <div ${isRTL(locale || determineLocaleFromOptions({ req })) ? `dir=rtl` : ``} style="background-color: #F7F7F7; padding: 0 20px;">
        <div style="max-width: 650px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px 0 10px;">
            <a href="https://bibletags.org">
              <img src="https://s3.amazonaws.com/cdn.gospelpaths.com/tenants/144/1659717297878-logo.png" style="width: 181px; min-height: 87px;" />
            </a>
          </div>  
          <div style="border: 1px solid rgba(0,0,0,.1); border-radius: 5px; padding: 20px; background: white; font-size: 15px;">
            <div style="font-size: 18px; margin-bottom: 20px;">${!userName ? i18n("Hi,", {}, i18nOptions) : i18n("Hi {{name}},", { name: userName }, i18nOptions)}</div>
            <div>${body}</div>
          </div>  
          <div style="padding: 10px 20px 20px 20px; font-size: 12px; text-align: center;">
            <div>
              ${i18n("A ministry of Gospel Paths Corporation", {}, i18nOptions)}
            </div>
          </div> 
        </div>  
      </div>  
    `
  }

  body = body.replace(
    /BUTTON\[([^\]]*)\]\(([^\)]*)\)/g,
    `
      <a href="$2">
        <span style="display: inline-block; padding: 8px 16px; background-color: #444; border-radius: 4px; text-transform: uppercase; font-size: 13px; color: white;">
          $1
        </span>
      </a>
    `
  )

  // if there is a WHITELISTED_EMAILS list, do a fake send to any email not on it
  if(process.env.WHITELISTED_EMAILS) {
    const whitelistedEmails = process.env.WHITELISTED_EMAILS.split(' ')
    const filterToWhitelisted = addrs => (
      addrs.filter(addr => whitelistedEmails.includes(
        addr
          .replace(/^.*?<([^>]+)>.*$/, '$1')
          .replace(/\+[0-9]+@/, '@')
      ))
    )
    toAddrs = filterToWhitelisted(toAddrs)
    ccAddrs = filterToWhitelisted(ccAddrs)
    bccAddrs = filterToWhitelisted(bccAddrs)
    if(toAddrs.length + ccAddrs.length + bccAddrs.length == 0) return true
  }

  const queuedEmail = await models.queuedEmail.create({
    priority,
    toAddrs,
    ccAddrs,
    bccAddrs,
    fromAddr,
    replyToAddrs,
    subject,
    body,
    attachments,
    referenceCode,
  })

  if(priority === 'NOW') {
    await executeSendEmail({ queuedEmail })
  }

}

module.exports = sendEmail