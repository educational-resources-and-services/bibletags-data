const {
  verseIdRegEx,
  versionIdRegEx,
} = require('../utils')

module.exports = ({ models }) => {

  return (
    queries,
    {
      id,
    },
    { req }
  ) => {

    const [ verseId, versionId, invalidExtra ] = id.split('-')

    if(invalidExtra !== undefined) {
      throw(new Error(`Invalid id (${id}).`))
    }

    if(!verseId.match(verseIdRegEx)) {
      throw(new Error(`Invalid verseId (${verseId}) indicated in id (${id}).`))
    }

    if(!versionId.match(versionIdRegEx)) {
      throw(new Error(`Invalid versionId (${versionId}) indicated in id (${id}).`))
    }


    const where = {
      verseId,
      versionId,
    }

    return models.tagSet.findOne({
      where,
    }).then(tagSet => ({ id, tagSet }))

  }
}