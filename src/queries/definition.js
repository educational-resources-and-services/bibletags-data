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
      required: false,
    },
    {
      model: models.languageSpecificDefinition,
      required: false,
      where: {
        languageId,
      },
    },
  ]

  const definition = await models.definition.findByPk(definitionId, {
    include,
  })

  if(!definition) return null

  return {
    ...definition.dataValues,
    ...(((definition.languageSpecificDefinitions || [])[0] || {}).dataValues || {}),
    id,
    pos: (definition.partOfSpeeches || []).map(partOfSpeech => partOfSpeech.pos),
  }

}

module.exports = definition