const { getLocFromRef } = require('@bibletags/bibletags-versification')
const { Op } = require('sequelize')

const { getVersionTables } = require('../utils')

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

  const { tagSetTable } = await getVersionTables(versionId)

  let loc = getLocFromRef({
    bookId,
    chapter,
    verse: verse || 0,
  })

  if(verse === undefined) {
    loc = `${loc.slice(0,5)}%`
  }

  const where = {
    loc: {
      [Op.like]: loc,
    },
  }

  const tagSets = await tagSetTable.findAll({
    where,
  })

  return tagSets.map(({ loc, wordsHash, tags, status }) => ({
    id: `${loc}-${versionId}-${wordsHash}`,
    tags,
    status,
  }))

}

module.exports = tagSets