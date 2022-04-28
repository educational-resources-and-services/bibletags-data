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

  const newUpdatedFrom = tagSets.slice(-1)[0].createdAt

  if(tagSets.length === limit) {
    // prevent situation where multiple sets with the same timestamp are split between results
    tagSets = [
      ...tagSets.filter(({ createdAt }) => createdAt !== newUpdatedFrom),
      ...(await models.tagSet.findAll({
        where: {
          createdAt: newUpdatedFrom,
          versionId,
        },
      })),
    ]
  }

  tagSets = tagSets.map(({ loc, versionId, wordsHash, tags }) => ({
    id: `${loc}-${versionId}-${wordsHash}`,
    tags,
  }))

  return {
    tagSets,
    hasMore: tagSets.length >= limit,
    newUpdatedFrom,
  }

}

module.exports = updatedTagSets