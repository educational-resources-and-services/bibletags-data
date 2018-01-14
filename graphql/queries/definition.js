module.exports = ({ models }) => {

  return (
    queries,
    {
      id,
    },
    { req }
  ) => {

    const [ strongs, lang, invalidExtra ] = id.split('-')
    const langModel = models[`${lang}Definition`]

    if(invalidExtra !== undefined) {
      throw(new Error('Invalid id.'))
    }

    if(!strongs.match(/^H[0-9]{5}[a-z]?$/)) {
      throw(new Error('Invalid strongs number indicated in id.'))
    }

    if(!lang.match(/^[a-z]{3}$/) || !langModel) {
      throw(new Error('Invalid language code indicated in id.'))
    }

    const include = [
      {
        model: models.partOfSpeech,
        attributes: [ 'pos' ],
      },
    ]

    return models.definition.findById(strongs, {
      include,
    }).then(definition => {
      if(!definition) return null

      definition.dataValues.pos = (definition.partOfSpeeches || []).map(partOfSpeech => partOfSpeech.pos)

      return langModel.findById(strongs).then(langDefinition => {

        return Object.assign(
          definition.dataValues,
          (langDefinition ? langDefinition.dataValues : {}),
          { id }
        )

      })

    })

  }
}