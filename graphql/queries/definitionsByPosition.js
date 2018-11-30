const {
  origLangAndLXXVersionIds,
  versionIdRegEx,
  verseIdRegEx,
  languageIdRegEx,
} = require('../utils')

module.exports = ({ models }) => {
  
  const definition = require('./definition')({ models })

  return (
    queries,
    {
      versionId,
      verseId,
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

    if(!verseId.match(verseIdRegEx)) {
      throw(new Error(`Invalid verseId (${verseId}).`))
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
        chapter: parseInt(verseId.substr(2,3)),
        verse: parseInt(verseId.substr(5,3)),
        number: wordNum,
      })
    }
    
    const model = models[`${versionId}Word`]

    if(!model) {
      throw(new Error('Invalid languageId.'))
    }


    // use verseId and wordNum to get the strongs

    const attributes = [ 'strongs' ]

    const where = {
      $or: wordLocs.map(wordLoc => Object.assign({
        bookId: parseInt(verseId.substr(0,2)),
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