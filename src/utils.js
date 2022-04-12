const cloneObj = obj => JSON.parse(JSON.stringify(obj))
const equalObjs = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

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

  cloneObj,
  equalObjs,

  getObjFromArrayOfObjs: (array, key='id', valueKey) => {
    if(!array) return null
    const itemsByKey = {}
    array.forEach(item => {
      itemsByKey[item[key]] = valueKey ? item[valueKey] : item
    })
    return itemsByKey
  },

  // tag order doesn’t really matter except that it must be consistent
  deepSortTagSetTags: tags => {
    // first sort o and t keys
    tags.forEach(tag => {
      tag.o.sort()
      tag.t.sort()
    })
    // then sort tags
    tags.sort((a,b) => {
      const aT1 = a.t[0] || Infinity
      const bT1 = b.t[0] || Infinity
      if(aT1 === bT1) {
        return a.o[0] > b.o[0] ? 1 : -1
      } else if(aT1 > bT1) {
        return 1
      } else {
        return -1
      }
    })
  },

}