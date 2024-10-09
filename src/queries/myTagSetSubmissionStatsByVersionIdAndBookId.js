// const { getRefFromLoc } = require('@bibletags/bibletags-versification')

// const { getVersionTables, equalObjs, getOrigLangVersionIdFromLoc, deepSortTagSetTags } = require('../utils')
// const { getTagsJson } = require('../calculateTagSets')

const myTagSetSubmissionStatsByVersionIdAndBookId = async (args, req, queryInfo) => {

  if(!req.user) throw `no login`

  const [ tagSetSubmissions ] = await global.connection.query(
    `
      SELECT SUBSTRING(loc, 1, 2) AS bookId, versionId, COUNT(*) AS submissions
      FROM tagSetSubmissions
      WHERE userId = :userId
      GROUP BY bookId, versionId
    `,
    {
      replacements: {
        userId: req.user.id,
      },
    },    
  )

  const statsByVersionIdAndBookId = {}
  tagSetSubmissions.forEach(({ bookId, versionId, submissions }) => {
    statsByVersionIdAndBookId[versionId] = statsByVersionIdAndBookId[versionId] || [ null, ...Array(66).fill().map(() => ({ submissions: 0 })) ]
    statsByVersionIdAndBookId[versionId][parseInt(bookId, 10)].submissions = submissions
  })

  return statsByVersionIdAndBookId

  // The below is slow, so just count submissions for now

  /*

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

  */

}

module.exports = myTagSetSubmissionStatsByVersionIdAndBookId