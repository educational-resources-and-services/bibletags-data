const {
  versionIdRegEx,
  definitionIdRegEx,
} = require('../constants')

const translationBreakdown = async (args, req, queryInfo) => {

  const { id } = args
  const [ definitionId, versionId, invalidExtra ] = id.split('-')

  if(invalidExtra !== undefined) {
    throw `Invalid id (${id}).`
  }

  if(!definitionId.match(definitionIdRegEx)) {
    throw `Invalid definitionId (${definitionId}) indicated in id (${id}).`
  }

  if(!versionId.match(versionIdRegEx)) {
    throw `Invalid versionId (${versionId}) indicated in id (${id}).`
  }

  const { models } = global.connection

  const translationBreakdown = await models.translationBreakdown.findOne({
    where: {
      definitionId,
      versionId,
    },
  })

  return {
    id,
    breakdown: translationBreakdown.breakdown,
  }

}

module.exports = translationBreakdown