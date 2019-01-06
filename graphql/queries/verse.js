const {
  versionIdRegEx,
  locRegEx,
} = require('../utils')

module.exports = ({ models }) => {

  return (
    queries,
    {
      id,
    },
    { req }
  ) => {

    const [ loc, versionId, invalidExtra ] = id.split('-')

    if(versionId === undefined || invalidExtra !== undefined) {
      throw(new Error(`Invalid id (${id}).`))
    }

    if(!loc.match(locRegEx)) {
      throw(new Error(`Invalid loc (${loc}) indicated in id (${id}).`))
    }

    if(!versionId.match(versionIdRegEx)) {
      throw(new Error(`Invalid versionId (${versionId}) indicated in id (${id}).`))
    }

    const model = models[`${versionId}Verse`]

    if(!model) {
      throw(new Error('Invalid versionId indicated in id.'))
    }

    const where = {
      loc,
    }

    return model.findOne({
      where
    }).then(verse => !verse ? null : ({
      id: `${verse.loc}-${versionId}`,
      usfm: verse.usfm,
    }))

  }
}