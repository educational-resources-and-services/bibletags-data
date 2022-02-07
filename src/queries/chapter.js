const { Op } = require('sequelize')

const {
  origLangAndLXXVersionIds,
} = require('../constants')

const chapter = async (args, req, queryInfo) => {

  const { bookId, chapter, versionId } = args

  if(!origLangAndLXXVersionIds.includes(versionId)) throw `Invalid versionId`
  if(bookId < 1 || bookId > 66) throw `Invalid bookId`
  if(chapter < 1 || chapter > 150) throw `Invalid chapter`

  const { models } = global.connection

  const model = models[`${versionId}Verse`]

  const verses = await model.findAll({
    where: {
      loc: {
        [Op.like]: `${`0${bookId}`.slice(-2)}${`00${chapter}`.slice(-3)}%`,
      },
    },
    order: [ 'loc' ],
  })

  verses.forEach(verse => {
    verse.id = `${verse.loc}-${versionId}`
  })

  return verses

}

module.exports = chapter