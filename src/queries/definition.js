const {
  definitionIdRegEx,
  languageIdRegEx,
} = require('../constants')

const definition = async (args, req, queryInfo) => {

  const { id } = args

  const [ definitionId, languageId, invalidExtra ] = id.split('-')

  if(languageId === undefined || invalidExtra !== undefined) {
    throw `Invalid id (${id}).`
  }

  if(!definitionId.match(definitionIdRegEx)) {
    throw `Invalid definitionId (${definitionId}) indicated in id (${id}).`
  }

  if(!languageId.match(languageIdRegEx)) {
    throw `Invalid languageId (${languageId}) indicated in id (${id}).`
  }

  const { models } = global.connection

  const include = [
    {
      model: models.partOfSpeech,
      attributes: [ 'pos' ],
    },
  ]

  const definition = await models.definition.findByPk(definitionId, {
    include,
  })

  if(!definition) return null

  const where = {
    definitionId,
    languageId,
  }

  const definitionByLanguage = await models.definitionByLanguage.findOne({
    where,
  })

  return {
    ...definition.dataValues,
    ...(definitionByLanguage ? definitionByLanguage.dataValues : {}),
    id,
    pos: (definition.partOfSpeeches || []).map(partOfSpeech => partOfSpeech.pos),
  }

}

module.exports = definition