const {
  origLangAndLXXVersionIds,
  versionIdRegEx,
  locRegEx,
  languageIdRegEx,
} = require('../utils')

module.exports = ({ models }) => {
  
  const definition = require('./definition')({ models })

  return (
    queries,
    {
      versionId,
      loc,
      wordNum,
      languageId,
    },
    { req }
  ) => {

    // THIS FILE HAS NOT BEEN TESTED YET AND PROBABLY DOESN'T WORK

    // validate everything

    if(!versionId.match(versionIdRegEx)) {
      throw(new Error(`Invalid versionId (${versionId}).`))
    }

    if(!loc.match(locRegEx)) {
      throw(new Error(`Invalid loc (${loc}).`))
    }

    if(typeof wordNum !== 'number' && wordNum <= 0) {
      throw(new Error(`Invalid wordNum (${wordNum}).`))
    }

    if(!languageId.match(languageIdRegEx)) {
      throw(new Error(`Invalid languageId (${languageId}).`))
    }

    const wordLocs = []


    // if not parsed Hebrew or Greek text, then go to tagSets table to get the orig language word position

    if(!origLangAndLXXVersionIds.includes(versionId)) {
      // TODO
      throw(new Error('Functionality not yet implemented.'))

    } else {
      wordLocs.push({
        chapter: parseInt(loc.substr(2,3)),
        verse: parseInt(loc.substr(5,3)),
        number: wordNum,
      })
    }
    
    const model = models[`${versionId}Word`]

    if(!model) {
      throw(new Error('Invalid languageId.'))
    }


    // use loc and wordNum to get the strongs

    const attributes = [ 'strongs' ]

    const where = {
      $or: wordLocs.map(wordLoc => Object.assign({
        bookId: parseInt(loc.substr(0,2)),
        qere: 0,
      }, wordLoc)),
    }
    
    return model.findAll({
      attributes,
      where,
    }).then(words => {

      // use strongs and language to get the definition
      return words.map(word => (
        definition(queries, { id: `${word.strongs}-${languageId}` }, { req })
      ))

    })
  }
}