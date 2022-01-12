const { checkCaptcha } = require('../../auth/captcha')
const { createLoginToken, isValidEmail } = require('../utils')

module.exports = ({ connection, models }) => {

  return (
    queries,
    {
      input,
    },
    { req, sendEmail, dev }
  ) => {

    const { email, captchaValue } = input

    if(!isValidEmail(email)) {
      throw(new Error(`Invalid email.`))
    }

    const sendTheToken = () => {

      const where = {
        email,
      }

      return models.user.findOne({
        where,
      }).then(user => {

        return connection.transaction(t => {

          const createTokenAndSendEmail = user => {
            return createLoginToken({ user, t, models }).then(token => {
              // TODO: make email subject and body multi-lingual
              const expireTimeDesc = `1 hour`
              const expireMessage = `This code can only be used once and will expire in ${expireTimeDesc}.`
              const body =
                (
                  user
                    ? `Copy and paste the following code into the Bible Tags widget to log in.`
                    : `Copy and paste the following code into the Bible Tags widget to complete your account creation and log in.`
                )
                + ' ' + expireMessage
                + `<br><br>${token.match(/.{1,3}/g).join('-')}`

              return sendEmail({
                toAddrs: email,
                subject: "Login code",
                body,
              }).then(() => true)
            })
          }

          if(user) {
            return createTokenAndSendEmail(user)

          } else {
            return models.user.create({
              email,
              ratingHistory: '',
            }, {transaction: t}).then(createTokenAndSendEmail)

          }

        }).then(() => true)

      })
    }

    if(dev) {
      return sendTheToken()
    }

    // check captcha
    checkCaptcha({ req, captchaValue })
      .then(sendTheToken)
      .catch(err => {
        throw(err)
      })

  }
}