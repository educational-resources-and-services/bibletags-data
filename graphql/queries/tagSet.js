const {
  verseIdRegEx,
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

    const [ verseId, versionId, wordsHash, invalidExtra ] = id.split('-')

    if(invalidExtra !== undefined) {
      throw(new Error(`Invalid id (${id}).`))
    }

    if(!verseId.match(verseIdRegEx)) {
      throw(new Error(`Invalid verseId (${verseId}) indicated in id (${id}).`))
    }

    if(!versionId.match(versionIdRegEx)) {
      throw(new Error(`Invalid versionId (${versionId}) indicated in id (${id}).`))
    }

    if(!wordsHash.match(wordsHashRegEx)) {
      throw(new Error(`Invalid wordsHash (${wordsHash}) indicated in id (${id}).`))
    }


    const where = {
      verseId,
      versionId,
      wordsHash,
    }

    return models.tagSet.findOne({
      where,
    }).then(tagSet => ({ id, tags: tagSet.tags }))

  }
}