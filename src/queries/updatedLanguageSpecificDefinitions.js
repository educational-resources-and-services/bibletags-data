const { Op } = require('sequelize')

const {
  languageIdRegEx,
} = require('../constants')

const updatedLanguageSpecificDefinitions = async (args, req, queryInfo) => {

  const { languageId, updatedSince } = args

  if(!languageId.match(languageIdRegEx)) {
    throw `Invalid languageId (${languageId}).`
  }

  const { models } = global.connection

  const limit = 100

  let languageSpecificDefinitions = await models.languageSpecificDefinition.findAll({
    where: {
      updatedAt: {
        [Op.gt]: updatedSince,
      },
      languageId,
    },
    order: [ 'updatedAt' ],
    limit,
  })

  const lastUpdatedAt = ((languageSpecificDefinitions.slice(-1)[0] || {}).updatedAt || new Date()).getTime()

  if(languageSpecificDefinitions.length === limit) {
    // prevent situation where multiple sets with the same timestamp are split between results
    languageSpecificDefinitions = [
      ...languageSpecificDefinitions.filter(({ updatedAt }) => updatedAt.getTime() !== lastUpdatedAt),
      ...(await models.languageSpecificDefinition.findAll({
        where: {
          updatedAt: lastUpdatedAt,
          languageId,
        },
      })),
    ]
  }

  languageSpecificDefinitions = languageSpecificDefinitions.map(({ definitionId, gloss, syn, rel, lexEntry, editorId }) => ({
    id: `${definitionId}-${languageId}`,
    gloss,
    syn,
    rel,
    lexEntry,
    editorId,
  }))

  return {
    languageSpecificDefinitions,
    hasMore: languageSpecificDefinitions.length >= limit,
    newUpdatedFrom: lastUpdatedAt + 1,
  }

}

module.exports = updatedLanguageSpecificDefinitions