const {
  definitionIdRegEx,
  languageIdRegEx,
} = require('../utils')

module.exports = ({ models }) => {

  return (
    queries,
    {
      id,
    },
    { req }
  ) => {

    const [ definitionId, languageId, invalidExtra ] = id.split('-')

    if(invalidExtra !== undefined) {
      throw(new Error(`Invalid id (${id}).`))
    }

    if(!definitionId.match(definitionIdRegEx)) {
      throw(new Error(`Invalid definitionId (${definitionId}) indicated in id (${id}).`))
    }

    if(!languageId.match(languageIdRegEx)) {
      throw(new Error(`Invalid languageId (${languageId}) indicated in id (${id}).`))
    }

    const include = [
      {
        model: models.partOfSpeech,
        attributes: [ 'pos' ],
      },
    ]
  
    return models.definition.findById(definitionId, {
      include,
    }).then(definition => {
      if(!definition) return null

      const where = {
        definitionId,
        languageId,
      }

      return models.definitionByLangauge.findOne({
        where,
      }).then(definitionByLangauge => {

        return Object.assign(
          definition.dataValues,
          (definitionByLangauge ? definitionByLangauge.dataValues : {}),
          {
            id,
            pos: (definition.partOfSpeeches || []).map(partOfSpeech => partOfSpeech.pos)
          }
        )

      })

    })

  }
}