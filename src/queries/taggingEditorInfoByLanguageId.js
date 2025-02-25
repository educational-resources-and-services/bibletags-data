const { parse } = require('json2csv')

const MIN_RATING_TO_BE_TAGGING_EDITOR = 50
const MIN_NUM_SUBMISSIONS_TO_BE_TAGGING_EDITOR = 25
const MIN_NUM_SUBMISSIONS_TO_CONSIDER_LANGUAGE = 5
const MAX_USERS_FOR_TAGGERS_REPORT = 300

const taggingEditorInfoByLanguageId = async (args, req, queryInfo) => {

  if(!req.user) throw `no login`

  const locsNeedingConfirmLanguageIds = []
  const languageIds = []
  const taggingEditorInfo = {}

  if(req.user.rating >= MIN_RATING_TO_BE_TAGGING_EDITOR) {
    const [ languageIdRows ] = await global.connection.query(
      `
      	SELECT languageId FROM (
          SELECT v.languageId, COUNT(*) AS submissions
          FROM tagSetSubmissions AS tss
            LEFT JOIN versions AS v ON (tss.versionId = v.id)
          WHERE tss.userId = :userId
          GROUP BY v.languageId
        ) AS t1
        WHERE submissions >= :minNumSubmissionsToBeTaggingEditor
      `,
      {
        replacements: {
          userId: req.user.id,
          minNumSubmissionsToBeTaggingEditor: MIN_NUM_SUBMISSIONS_TO_BE_TAGGING_EDITOR,
        },
      },
    )
    locsNeedingConfirmLanguageIds.push(...languageIdRows.map(({ languageId }) => languageId))
    languageIds.push(...locsNeedingConfirmLanguageIds)
  }

  if([ `ADMIN`, `EDITOR` ].includes(req.user.adminLevel)) {
    const [ languageIdRows ] = await global.connection.query(
      `
        SELECT DISTINCT v.languageId
        FROM versions AS v
        WHERE (SELECT COUNT(*) FROM tagSetSubmissions AS tss WHERE tss.versionId = v.id) >= :minNumSubmissionsToConsiderLanguage
      `,
      {
        replacements: {
          userId: req.user.id,
          minNumSubmissionsToConsiderLanguage: MIN_NUM_SUBMISSIONS_TO_CONSIDER_LANGUAGE,
        },
      },
    )
    languageIds.push(...languageIdRows.map(({ languageId }) => languageId))
  }

  await Promise.all(languageIds.map(async languageId => {

    const queries = []

    // get taggersReport
    const tssBaseQuery = `
      SELECT COUNT(*)
      FROM tagSetSubmissions AS tss
        LEFT JOIN versions AS v ON (tss.versionId = v.id)
      WHERE tss.userId = u.id
        AND v.languageId = :languageId
    `
    const getBetweenDates = (startDate, endDate) => `AND tss.createdAt BETWEEN "${startDate}" AND "${endDate}"`
    const twoSundaysAgoStr = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 14).toISOString().slice(0, 10)
    const lastSundayStr = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay()).toISOString().slice(0, 10)
    const firstOfTheMonthStr = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)
    const firstOfLastMonthStr = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 10)
    const tomorrowStr = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toISOString().slice(0, 10)
    queries.push(`
      SELECT
        :languageId AS "Language",
        u.name AS "Name",
        u.email AS "Email",
        u.rating AS "Rating",
        (${tssBaseQuery}) AS "Submissions",
        (${tssBaseQuery} ${getBetweenDates(lastSundayStr, tomorrowStr)}) AS "This Week",
        (${tssBaseQuery} ${getBetweenDates(twoSundaysAgoStr, lastSundayStr)}) AS "Last Week",
        (${tssBaseQuery} ${getBetweenDates(firstOfTheMonthStr, tomorrowStr)}) AS "This Month",
        (${tssBaseQuery} ${getBetweenDates(firstOfLastMonthStr, firstOfTheMonthStr)}) AS "Last Month"
      FROM users AS u
      WHERE (${tssBaseQuery}) > 0
      LIMIT :maxUsersForTaggersReport  ${/* prevent an overly slow query */ ``}
    `)

    if(locsNeedingConfirmLanguageIds.includes(languageId)) {
      // get locsNeedingConfirm

      const getQuery = locRegEx => `
        SELECT tss.loc, tss.versionId
        FROM tagSetSubmissions AS tss
          LEFT JOIN versions AS v ON (tss.versionId = v.id)
          LEFT JOIN users AS u ON (tss.userId = u.id)
        WHERE v.languageId = :languageId
          AND tss.loc REGEXP "${locRegEx}"
          AND tss.userId != :userId
          AND (SELECT COUNT(*) FROM tagSetSubmissions AS tss2 WHERE tss.loc = tss2.loc AND tss.wordsHash = tss2.wordsHash AND tss.versionId = tss2.versionId) = 1  ${/* only one submission */ ``}
        ORDER BY u.rating, tss.loc
        LIMIT 100
      `

      queries.push(getQuery(`^[0-3]`))
      queries.push(getQuery(`^[4-6]`))

    }

    const [ taggersReportData, otLocsNeedingConfirm, ntLocsNeedingConfirm ] = (await global.connection.query(
      queries.join(';'),
      {
        replacements: {
          languageId,
          userId: req.user.id,
          maxUsersForTaggersReport: MAX_USERS_FOR_TAGGERS_REPORT,
        },
      },
    ))[0]

    const taggersReport = parse(taggersReportData, {})

    taggingEditorInfo[languageId] = {
      taggersReport,
      otLocsNeedingConfirm,
      ntLocsNeedingConfirm,
    }

  }))

  return taggingEditorInfo

}

module.exports = taggingEditorInfoByLanguageId

// Problem: for locsNeedingConfirm, no longer valid wordsHash rows are going to be included in the result and will not be clearable by the editor