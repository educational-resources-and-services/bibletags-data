const { getLocFromRef } = require('bibletags-versification')

const {
  versionIdRegEx,
} = require('../utils')

// This query is only used by preload, when the verse and/or wordsHash is unknown.
// Thus, even if the verse is known, it returns an array as there could be two 
// editions of this verse for this version.

module.exports = ({ models }) => {

  return (
    queries,
    {
      bookId,
      chapter,
      verse,  // optional; if not provided, the entire chapter will be retrieved
      versionId,
    },
    { req }
  ) => {

    if(!versionId.match(versionIdRegEx)) {
      throw(new Error(`Invalid versionId (${versionId}).`))
    }

    let verseId = getLocFromRef({
      bookId,
      chapter,
      verse: verse || 0,
    })

    if(verse === undefined) {
      verseId = `${verseId.substr(0,5)}%`
    }

    const where = {
      verseId: {
        [Sequelize.Op.like]: verseId,
      },
      versionId,
    }

    return models.tagSet.find({
      where,
    }).then(tagSets => tagSets.map(tagSet => {
      const { verseId, versionId, wordsHash, tags } = tagSet
      return {
        id: `${verseId}-${versionId}-${wordsHash}`,
        tags,
      }
    }))

  }
}