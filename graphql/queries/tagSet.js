const {
  locRegEx,
  versionIdRegEx,
  wordsHashRegEx,
} = require('../utils')

module.exports = ({ models }) => {

  return (
    queries,
    {
      id,
    },
    { req }
  ) => {

    const [ loc, versionId, wordsHash, invalidExtra ] = id.split('-')

    if(wordsHash === undefined || invalidExtra !== undefined) {
      throw(new Error(`Invalid id (${id}).`))
    }

    if(!loc.match(locRegEx)) {
      throw(new Error(`Invalid loc (${loc}) indicated in id (${id}).`))
    }

    if(!versionId.match(versionIdRegEx)) {
      throw(new Error(`Invalid versionId (${versionId}) indicated in id (${id}).`))
    }

    if(!wordsHash.match(wordsHashRegEx)) {
      throw(new Error(`Invalid wordsHash (${wordsHash}) indicated in id (${id}).`))
    }

    const where = {
      loc,
      versionId,
      wordsHash,
    }

    return models.tagSet.findOne({
      where,
    }).then(tagSet => ({
      id,
      tags: tagSet ? tagSet.tags : [],
      status: tagSet ? tagSet.status : 'none',
    }))

  }
}