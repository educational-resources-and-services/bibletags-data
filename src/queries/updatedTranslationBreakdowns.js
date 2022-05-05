const { Op } = require('sequelize')

const {
  versionIdRegEx,
} = require('../constants')

const updatedTranslationBreakdowns = async (args, req, queryInfo) => {

  const { versionId, updatedFrom } = args

  if(!versionId.match(versionIdRegEx)) {
    throw `Invalid versionId (${versionId}).`
  }

  const { models } = global.connection

  const limit = 100

  let translationBreakdowns = await models.translationBreakdown.findAll({
    where: {
      createdAt: {
        [Op.gte]: updatedFrom,
      },
      versionId,  
    },
    order: [ 'createdAt' ],
    limit,
  })

  const lastCreatedAt = ((translationBreakdowns.slice(-1)[0] || {}).createdAt || new Date()).getTime()

  if(translationBreakdowns.length === limit) {
    // prevent situation where multiple sets with the same timestamp are split between results
    translationBreakdowns = [
      ...translationBreakdowns.filter(({ createdAt }) => createdAt.getTime() !== lastCreatedAt),
      ...(await models.translationBreakdown.findAll({
        where: {
          createdAt: lastCreatedAt,
          versionId,
        },
      })),
    ]
  }

  translationBreakdowns = translationBreakdowns.map(({ definitionId, breakdown }) => ({
    id: `${definitionId}-${versionId}`,
    breakdown,
  }))

  return {
    translationBreakdowns,
    hasMore: translationBreakdowns.length >= limit,
    newUpdatedFrom: lastCreatedAt + 1,
  }

}

module.exports = updatedTranslationBreakdowns