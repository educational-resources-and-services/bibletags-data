const { getLocFromRef } = require('@bibletags/bibletags-versification')
const { Op } = require('sequelize')

const { getVersionTables } = require('../utils')

const {
  versionIdRegEx,
} = require('../constants')

const nextAndPreviousLocsWithoutTagging = async (args, req, queryInfo) => {

  const { bookId, chapter, verse, versionId } = args

  if(!versionId.match(versionIdRegEx)) {
    throw `Invalid versionId (${versionId}).`
  }

  const { tagSetTable } = await getVersionTables(versionId)

  let loc = getLocFromRef({
    bookId,
    chapter,
    verse,
  })

  const [ previousTagSet, nextTagSet ] = await Promise.all([
    tagSetTable.findOne({
      where: {
        loc: {
          [Op.lt]: loc,
        },
        status: [ `none`, `automatch` ],
      },
      order: [[ `loc`, `DESC` ]],
    }),
    tagSetTable.findOne({
      where: {
        loc: {
          [Op.gt]: loc,
        },
        status: [ `none`, `automatch` ],
      },
      order: [[ `loc`, `ASC` ]],
    }),
  ])

  return {
    previousLoc: previousTagSet ? previousTagSet.loc : null,
    nextLoc: nextTagSet ? nextTagSet.loc : null,
  }

}

module.exports = nextAndPreviousLocsWithoutTagging