const {
  versionIdRegEx,
  verseIdRegEx,
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
    const model = models[`${versionId}Verse`]

    if(invalidExtra !== undefined) {
      throw(new Error(`Invalid id (${id}).`))
    }

    if(!verseId.match(verseIdRegEx)) {
      throw(new Error(`Invalid verseId (${verseId}) indicated in id (${id}).`))
    }

    if(!versionId.match(versionIdRegEx)) {
      throw(new Error(`Invalid versionId (${versionId}) indicated in id (${id}).`))
    }

    if(!model) {
      throw(new Error('Invalid versionId indicated in id.'))
    }

    return model.findById(verseId).then(verse => !verse ? null : ({
      id: `${verse.id}-${versionId}`,
      usfm: verse.usfm,
    }))

  }
}