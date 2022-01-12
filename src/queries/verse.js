const {
  versionIdRegEx,
  locRegEx,
} = require('../constants')

const verse = async (args, req, queryInfo) => {

  const { id } = args
  const [ loc, versionId, invalidExtra ] = id.split('-')

  if(versionId === undefined || invalidExtra !== undefined) {
    throw `Invalid id (${id}).`
  }

  if(!loc.match(locRegEx)) {
    throw `Invalid loc (${loc}) indicated in id (${id}).`
  }

  if(!versionId.match(versionIdRegEx)) {
    throw `Invalid versionId (${versionId}) indicated in id (${id}).`
  }

  const { models } = global.connection

  const model = models[`${versionId}Verse`]

  if(!model) {
    throw(new Error('Invalid versionId indicated in id.'))
  }

  const where = {
    loc,
  }

  const verse = await model.findOne({
    where,
  })

  if(!verse) return null

  return {
    id: `${verse.loc}-${versionId}`,
    usfm: verse.usfm,
  }

}

module.exports = verse