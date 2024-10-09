const { getRefFromLoc } = require('@bibletags/bibletags-versification')

const { getVersionTables, equalObjs, getOrigLangVersionIdFromLoc, deepSortTagSetTags } = require('../utils')
const { getTagsJson } = require('../calculateTagSets')

const myTagSetSubmissionStatsByVersionIdAndBookId = async (args, req, queryInfo) => {

  if(!req.user) throw `no login`

  const { models } = global.connection

  // 1. Get all my submissions

  const tagSetSubmissions = await models.tagSetSubmission.findAll({
    where: {
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
            model: models[`uhbTagSubmission`],
            required: false,
          },
          {
            model: models[`ugntTagSubmission`],
            required: false,
          },
        ],
      },
    ],
  })

  const myTagsByVersionIdAndBookId = {}
  tagSetSubmissions.forEach(({ loc, versionId, tagSetSubmissionItems }) => {
    const { bookId } = getRefFromLoc(loc)
    const origLangVersionId = getOrigLangVersionIdFromLoc(loc)
    const tags = getTagsJson({ tagSetSubmissionItems, origLangVersionId })
    deepSortTagSetTags(tags)
    myTagsByVersionIdAndBookId[versionId] = myTagsByVersionIdAndBookId[versionId] || [ null, ...Array(66).fill().map(() => []) ]
    myTagsByVersionIdAndBookId[versionId][bookId].push({
      loc,
      tags,
    })
  })

  // 2. Get all tagSets corresponding to those submissions

  const getTagSetsByVersionId = async versionId => {

    const { tagSetTable } = await getVersionTables(versionId)

    return await tagSetTable.findAll({
      where: {
        loc: myTagsByVersionIdAndBookId[versionId].map(book => (book || []).map(({ loc }) => loc)).flat(),
      },
    })

  }

  const tagsByVersionIdAndLoc = {}
  await Promise.all(
    Object.keys(myTagsByVersionIdAndBookId).map(async versionId => {
      const tagSets = await getTagSetsByVersionId(versionId)
      tagSets.forEach(({ loc, tags }) => {
        deepSortTagSetTags(tags)
        tagsByVersionIdAndLoc[`${versionId} ${loc}`] = tags
      })
    })
  )

  // 3. Compare the two to get the stats

  const statsByVersionIdAndBookId = {}
  for(let versionId in myTagsByVersionIdAndBookId) {
    statsByVersionIdAndBookId[versionId] = myTagsByVersionIdAndBookId[versionId].map(book => (
      book
      && {
        submissions: book.length,
        used: book.filter(({ loc, tags }) => equalObjs(tags, tagsByVersionIdAndLoc[`${versionId} ${loc}`])).length,
      }
    ))
  }

  return statsByVersionIdAndBookId

}

module.exports = myTagSetSubmissionStatsByVersionIdAndBookId