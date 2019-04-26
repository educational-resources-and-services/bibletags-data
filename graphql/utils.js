module.exports = {

  origLangAndLXXVersionIds: [
    'uhb',
    'ugnt',
    'lxx',
  ],

  wordIdRegEx: /^[0-9]{2}[0-9a-z]{3}$/i,
  locRegEx: /^[0-9]{8}$/,
  versionIdRegEx: /^[a-z0-9]{2,9}$/,
  definitionIdRegEx: /^[HAG][0-9]{1,4}(?:\.[0-9])?$/,  // strongs number
  languageIdRegEx: /^[a-z]{3}$/,
  scopeRegEx: /^[a-z]{1,2}|[0-9]{2}$/,
  wordsHashRegEx: /^[a-zA-Z0-9\+\/=]{2,}$/,  // base 64 digits only

  translationLength: 300,
  translationWordLength: 200,
  languageNameLength: 100,
  glossLength: 100,
  versionNameLength: 150,
  wordsHashLength: 255,

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

}