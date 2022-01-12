const { getLocFromRef } = require('@bibletags/bibletags-versification')

const {
  versionIdRegEx,
} = require('../constants')

// This query is only used by preload, when the verse and/or wordsHash is unknown.
// Thus, even if the verse is known, it returns an array as there could be two 
// editions of this verse for this version.

const tagSets = async (args, req, queryInfo) => {

  const { bookId, chapter, verse, versionId } = args
  // verse is optional; if not provided, the entire chapter will be retrieved

  if(!versionId.match(versionIdRegEx)) {
    throw `Invalid versionId (${versionId}).`
  }

  const { models } = global.connection

  let loc = getLocFromRef({
    bookId,
    chapter,
    verse: verse || 0,
  })

  if(verse === undefined) {
    loc = `${loc.substr(0,5)}%`
  }

  const where = {
    loc: {
      [Sequelize.Op.like]: loc,
    },
    versionId,
  }

  const tagSets = await models.tagSet.find({
    where,
  })
  
  return tagSets.map(({ loc, versionId, wordsHash, tags }) => ({
    id: `${loc}-${versionId}-${wordsHash}`,
    tags,
  }))

}

module.exports = tagSets