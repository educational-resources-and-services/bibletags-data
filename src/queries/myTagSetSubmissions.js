const { getLocFromRef } = require('@bibletags/bibletags-versification')
const { Op } = require('sequelize')

const { deepSortTagSetTags, getOrigLangVersionIdFromLoc } = require('../utils')
const { getTagsJson } = require('../calculateTagSets')

const {
  versionIdRegEx,
} = require('../constants')

const myTagSetSubmissions = async (args, req, queryInfo) => {

  if(!req.user) throw `no login`

  const { bookId, chapter, versionId } = args
  const { models } = global.connection

  if(!versionId.match(versionIdRegEx)) {
    throw `Invalid versionId (${versionId}).`
  }

  const chapterLoc = getLocFromRef({
    bookId,
    chapter,
  }).slice(0,5)

  const origLangVersionId = getOrigLangVersionIdFromLoc(chapterLoc)

  const tagSetSubmissions = await models.tagSetSubmission.findAll({
    where: {
      loc: {
        [Op.like]: `${chapterLoc}%`,
      },
      versionId,
      userId: req.user.id,
    },
    include: [
      {
        model: models.tagSetSubmissionItem,
        required: true,
        include: [
          {
            model: models.tagSetSubmissionItemTranslationWord,
            required: false,
          },
          {
            model: models[`${origLangVersionId}TagSubmission`],
            required: false,
          },
        ],
      },
    ],
    order: [[ `createdAt`, `ASC` ]],
  })

  return tagSetSubmissions.map(({ loc, wordsHash, tagSetSubmissionItems }) => ({
    id: `${loc}-${versionId}-${wordsHash}`,
    tags: (
      deepSortTagSetTags(
        getTagsJson({
          tagSetSubmissionItems,
          origLangVersionId,
        })
      )
    ),
  }))

}

module.exports = myTagSetSubmissions