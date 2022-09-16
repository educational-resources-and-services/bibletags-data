const { Op } = require('sequelize')

const { getVersionTables } = require('../utils')

const {
  versionIdRegEx,
} = require('../constants')

const updatedTagSets = async (args, req, queryInfo) => {

  const { versionId, updatedFrom, forceAll } = args

  if(!versionId.match(versionIdRegEx)) {
    throw `Invalid versionId (${versionId}).`
  }

  const { tagSetTable } = await getVersionTables(versionId)

  const limit = forceAll ? 10000 : 100

  let tagSets = await tagSetTable.findAll({
    where: {
      createdAt: {
        [Op.gte]: updatedFrom,
      },
      status: {
        [Op.ne]: `none`,
      },
    },
    order: [ 'createdAt' ],
    limit,
  })

  const lastCreatedAt = ((tagSets.slice(-1)[0] || {}).createdAt || new Date()).getTime()

  if(tagSets.length === limit) {
    // prevent situation where multiple sets with the same timestamp are split between results
    tagSets = [
      ...tagSets.filter(({ createdAt }) => createdAt.getTime() !== lastCreatedAt),
      ...(await tagSetTable.findAll({
        where: {
          createdAt: lastCreatedAt,
          status: {
            [Op.ne]: `none`,
          },
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