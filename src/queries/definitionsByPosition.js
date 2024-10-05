const definition = require('./definition')

const {
  origLangAndLXXVersionIds,
  versionIdRegEx,
  locRegEx,
  languageIdRegEx,
} = require('../constants')

const definitionsByPosition = async (args, req, queryInfo) => {
  
  const { versionId, loc, wordNum, languageId } = args

  // THIS FILE HAS NOT BEEN TESTED YET AND PROBABLY DOESN'T WORK
  return null

  // validate everything

  if(!versionId.match(versionIdRegEx)) {
    throw `Invalid versionId (${versionId}).`
  }

  if(!loc.match(locRegEx)) {
    throw `Invalid loc (${loc}).`
  }

  if(typeof wordNum !== 'number' && wordNum <= 0) {
    throw `Invalid wordNum (${wordNum}).`
  }

  if(!languageId.match(languageIdRegEx)) {
    throw `Invalid languageId (${languageId}).`
  }

  const { models } = global.connection

  const wordLocs = []


  // if not parsed Hebrew or Greek text, then go to tagSets table to get the orig language word position

  if(!origLangAndLXXVersionIds.includes(versionId)) {
    // TODO
    throw(new Error('Functionality not yet implemented.'))

  } else {
    wordLocs.push({
      chapter: parseInt(loc.slice(2,3)),
      verse: parseInt(loc.slice(5,3)),
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
      bookId: parseInt(loc.slice(0,2)),
      qere: 0,
    }, wordLoc)),
  }
  
  const words = await model.findAll({
    attributes,
    where,
  })

  // use strongs and language to get the definition
  return words.map(word => (
    definition(args, { id: `${word.strongs}-${languageId}` }, queryInfo)
  ))

}

module.exports = definitionsByPosition