const { studyVersions } = require('../constants')

module.exports = ({ models }) => {
  
  const definition = require('./definition')({ models })

  return (
    queries,
    {
      version,
      verseLoc,
      wordNum,
      language,
    },
    { req }
  ) => {

    // validate everything

    if(!version.match(/^[a-z0-9]{2,9}$/)) {
      throw(new Error('Invalid version.'))
    }

    if(!verseLoc.match(/^[0-9]{8}$/)) {
      throw(new Error('Invalid verseLoc.'))
    }

    if(wordNum <= 0) {
      throw(new Error('Invalid wordNum.'))
    }

    if(!language.match(/^[a-z]{3}$/)) {
      throw(new Error('Invalid language.'))
    }

    const wordLocs = []


    // if not parsed Hebrew or Greek text, then go to tagSets table to get the orig language word position

    if(!studyVersions.includes(version)) {
      // TODO
      throw(new Error('Functionality not yet implemented.'))

    } else {
      wordLocs.push({
        chapter: parseInt(verseLoc.substr(2,3)),
        verse: parseInt(verseLoc.substr(5,3)),
        number: wordNum,
      })
    }
    
    const model = models[`${version}Word`]

    if(!model) {
      throw(new Error('Invalid language.'))
    }


    // use verseLoc and wordNum to get the strongs

    const attributes = [ 'strongs' ]

    const where = {
      $or: wordLocs.map(wordLoc => Object.assign({
        bookId: parseInt(verseLoc.substr(0,2)),
        qere: 0,
      }, wordLoc)),
    }
    
    return model.findAll({
      attributes,
      where,
    }).then(words => {

      // use strongs and language to get the definition
      return words.map(word => (
        definition(queries, { id: `${word.strongs}-${language}` }, { req })
      ))

    })
  }
}