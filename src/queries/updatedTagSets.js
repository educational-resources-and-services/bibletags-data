const { Op } = require('sequelize')

const {
  versionIdRegEx,
} = require('../constants')

const updatedTagSets = async (args, req, queryInfo) => {

  const { versionId, updatedFrom } = args

  if(!versionId.match(versionIdRegEx)) {
    throw `Invalid versionId (${versionId}).`
  }

  const { models } = global.connection

  const limit = 100

  let tagSets = await models.tagSet.findAll({
    where: {
      createdAt: {
        [Op.gte]: updatedFrom,
      },
      versionId,  
    },
    order: [ 'createdAt' ],
    limit,
  })

  const lastCreatedAt = ((tagSets.slice(-1)[0] || {}).createdAt || new Date()).getTime()

  if(tagSets.length === limit) {
    // prevent situation where multiple sets with the same timestamp are split between results
    tagSets = [
      ...tagSets.filter(({ createdAt }) => createdAt.getTime() !== lastCreatedAt),
      ...(await models.tagSet.findAll({
        where: {
          createdAt: lastCreatedAt,
          versionId,
        },
      })),
    ]
  }

  tagSets = tagSets.map(({ loc, wordsHash, tags, status }) => ({
    id: `${loc}-${versionId}-${wordsHash}`,
    tags,
    status,
  }))

  return {
    tagSets,
    hasMore: tagSets.length >= limit,
    newUpdatedFrom: lastCreatedAt + 1,
  }

}

module.exports = updatedTagSets