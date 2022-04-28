const { Op } = require('sequelize')

const {
  languageIdRegEx,
} = require('../constants')

const languages = async (args, req, queryInfo) => {

  const { languageIds } = args

  if(languageIds.some(languageId => !languageId.match(languageIdRegEx))) {
    throw `One or more invalid languageIds.`
  }

  const { models } = global.connection

  const languages = await models.language.findAll({
    where: {
      id: languageIds,
    },
  })

  return languages

}

module.exports = languages