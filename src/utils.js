module.exports = {

  getOrigLangVersionIdFromLoc: loc => (
    parseInt(loc.substr(0,2), 10) <= 39 ? 'uhb' : 'ugnt'
  ),

  createLoginToken: ({ user, t, models }) => {
    const charOptions = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
    const getRandomChar = () => charOptions[ parseInt(Math.random() * charOptions.length) ]
    const token = Array(6).fill().map(getRandomChar).join('')
  
    return models.loginToken.create({
      userId: user.id,
      token,
    }, t ? {transaction: t} : undefined).then(() => token)
  },

  isValidEmail: email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  },

  doFakeAuthIfTesting: () => async (req, res, next) => {
    if(global.fakeAuthForTesting) {
      const { models } = global.connection
      const user = await models.user.findByPk(1)
      req.user = user.dataValues
    }
    next()
  },

}