const {
  languageIdRegEx,
} = require('../constants')

const uiWords = async (args, req, queryInfo) => {

  const { languageId } = args

  if(!languageId.match(languageIdRegEx)) {
    throw `Invalid languageId (${languageId}).`
  }

  const { models } = global.connection

  const where = {
    languageId,
  }

  const uiWords = await models.uiWord.find({
    where,
  })

  return uiWords

}

module.exports = uiWords