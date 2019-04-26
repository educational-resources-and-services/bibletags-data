module.exports = ({ connection, models }) => {

  return (
    queries,
    {
      input,
    },
    { req }
  ) => {

    const { token } = input

    const numberOfMinutesALoginTokenIsValid = process.env.NUMBER_OF_MINUTES_A_LOGIN_TOKEN_IS_VALID || 60
    const expireDate = new Date()
    expireDate.setDate(expireDate.getDate() - numberOfMinutesALoginTokenIsValid)

    const include = [
      {
        model: models.loginToken,
        attributes: [ 'id' ],
        where: {
          token,
          createdAt: {
            $gt: expireDate,
          },
        },
        required: true,
      },
    ]

    // Look up user by token
    return models.user.findOne({
      include,
    }).then(user => {
      if(user) {
        // Destroy token and mark as verified
        return connection.transaction(t => {

          return user.loginTokens[0].destroy({transaction: t}).then(() => {
            user.verified = true
            return user.save({transaction: t}).then(() => {
              // Having validated to the token, we log the user with Passport
              return req.fullLogIn(user, (err) => {
                if(err) {
                  throw(new Error(`Unknown error. Could not log you in.`))
                }
                return req.session.save(() => true)
              })
            })
          })

        })
      } else {
        throw(new Error(`Invalid token.`))
      }
    })
  }

}