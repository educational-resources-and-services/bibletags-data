const fs = require('fs').promises
const { getLanguageInfo } = require('@bibletags/bibletags-ui-helper')
const { Parser } = require('json2csv')
const AWS = require('aws-sdk')

const { getVersionTables } = require('./utils')

let s3
const writeToS3 = (key, body) => new Promise((resolve, reject) => {
  s3 = s3 || new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_OVERRIDE || process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_OVERRIDE || process.env.AWS_SECRET_ACCESS_KEY,
  })
  s3.putObject(
    {
      Bucket: process.env.AWS_DOWNLOADS_BUCKET,
      Key: key,
      Body: body,
      ContentType: {
        html: `text/html`,
        csv: `text/csv`,
        json: `application/json`,
        css: `text/css`,
      }[key.split('.').pop()]
    },
    err => {
      if(err) return reject(err)
      resolve()
    }
  )
})

const buildPages = async () => {

  if([ undefined, null, false, 'none' ].includes(process.env.AWS_DOWNLOADS_BUCKET) && !process.env.LOCAL) return

  const mkdir = process.env.LOCAL ? fs.mkdir : ()=>{}
  const write = process.env.LOCAL ? fs.writeFile : writeToS3
  const pagesDir = process.env.LOCAL ? `./pages/` : ``

  const { models } = global.connection
  const now = Date.now()
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const aDay = 1000*60*60*24
  const graphEndDateTimeStamp = new Date(new Date().toISOString().split('T')[0]).getTime() - aDay
  const graphStartDate = new Date(graphEndDateTimeStamp - aDay * 89)

  const getTagSubmissionsOverTimeQuery = versionId => (`
    (SELECT CONCAT(
      '[',
      (
        SELECT
          GROUP_CONCAT(CONCAT( '["', createdAtDate, '",', cnt, ']' )) FROM (
            SELECT
              SUBSTR(createdAt, 1, 10) AS createdAtDate,
              COUNT(*) AS cnt
            FROM tagSetSubmissions
            WHERE createdAt >= "${graphStartDate.toISOString().split('T')[0]}"
            ${versionId ? `AND versionId="${versionId}"` : ``}
            GROUP BY createdAtDate
            ORDER BY createdAtDate
          ) AS t1
      ),
      ']'
    ))
  `)

  const getFilledOutTagSubmissionsOverTime = tagSubmissionsOverTimeJson => {
    let lastTimestamp = graphStartDate.getTime()
    return (
      JSON.parse(tagSubmissionsOverTimeJson || `[[${graphStartDate.getTime()},0]]`)
        .map(([ date, count ], idx, ary) => {
          let toReturn = []

          const thisTimeStamp = new Date(date).getTime()
          while(lastTimestamp + aDay < thisTimeStamp) {
            lastTimestamp += aDay
            toReturn.push([ lastTimestamp, 0 ])
          }
          lastTimestamp = thisTimeStamp

          toReturn = [ ...toReturn, [ date, count ] ]

          if(idx === ary.length - 1) {
            while(lastTimestamp < graphEndDateTimeStamp) {
              lastTimestamp += aDay
              toReturn.push([ lastTimestamp, 0 ])
            }
          }

          return toReturn
        })
        .flat()
        .map(([ date, count ]) => [ new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), count ])
    )
  }

  await global.connection.query(`SET SESSION group_concat_max_len = 10000`)  // needed for the GROUP_CONCAT calls

  const versions = await models.version.findAll({
    attributes: {
      exclude: [
        'extraVerseMappings',
      ]
    },
    order: [[ 'name' ]],
  })

  const versionsByLanguageId = {}

  versions.forEach(version => {
    versionsByLanguageId[version.languageId] = versionsByLanguageId[version.languageId] || []
    versionsByLanguageId[version.languageId].push(version)
  })

  const versionsTemplate = (await fs.readFile(`./src/templates/versions.html`)).toString()
  const versionsLanguageTemplate = (await fs.readFile(`./src/templates/versions-language.html`)).toString()
  const versionsVersionTemplate = (await fs.readFile(`./src/templates/versions-version.html`)).toString()
  const versionTemplate = (await fs.readFile(`./src/templates/version.html`)).toString()
  const languageTemplate = (await fs.readFile(`./src/templates/language.html`)).toString()
  const languageVersionTemplate = (await fs.readFile(`./src/templates/language-version.html`)).toString()
  const headerTemplate = (await fs.readFile(`./src/templates/header.html`)).toString()
  const footerTemplate = (await fs.readFile(`./src/templates/footer.html`)).toString()
  const tagSubmissionsOverTimeTemplate = (await fs.readFile(`./src/templates/tag-submissions-over-time.html`)).toString()
  const cssIndex = (await fs.readFile(`./src/templates/index.css`)).toString()

  await mkdir(`${pagesDir}versions`, { recursive: true })
  await mkdir(`${pagesDir}languages`, { recursive: true })
  await mkdir(`${pagesDir}downloads`, { recursive: true })

  // CSS
  await write(`${pagesDir}index.css`, cssIndex)

  // Go through relevant versions
  for(let version of versions) {

    const [
      numVerses,
      numVersesWithTagging,
      numVersesWithConfirmedTagging,
      numTagSubmissions,
      taggerUserIds,
      percentageOfWordsTagged,
      tagSubmissionsOverTimeJson,
    ] = (
      await Promise.all([
        global.connection.query(`SELECT COUNT(*) FROM ${version.id}TagSets`),
        global.connection.query(`SELECT COUNT(*) FROM ${version.id}TagSets WHERE status IN ("unconfirmed", "confirmed")`),
        global.connection.query(`SELECT COUNT(*) FROM ${version.id}TagSets WHERE status IN ("confirmed")`),
        global.connection.query(`SELECT COUNT(*) FROM tagSetSubmissions WHERE versionId="${version.id}"`),
        global.connection.query(`SELECT DISTINCT userId FROM tagSetSubmissions WHERE versionId="${version.id}"`),
        global.connection.query(`SELECT IFNULL((SELECT AVG(LENGTH(tags)) FROM ${version.id}TagSets) / (SELECT AVG(LENGTH(tags)) FROM ${version.id}TagSets WHERE status="unconfirmed"), 0)`),
        global.connection.query(getTagSubmissionsOverTimeQuery(version.id)),
      ])
    ).map(([ rows ], idx) => (
      [ 4 ].includes(idx)
        ? rows
        : Object.values(rows[0])[0]
    ))

    version.dataValues = {
      ...version.dataValues,
      numVerses,
      numVersesWithTagging,
      numVersesWithConfirmedTagging,
      numTagSubmissions,
      taggerUserIds,
      percentageOfWordsTagged,
      tagSubmissionsOverTimeJson,
    }

    const {
      id,
      name,
      languageId,
      partialScope,
      wordDivisionRegex,
      versificationModel,
      skipsUnlikelyOriginals,
      extraVerseMappings,
    } = version.dataValues

    const { englishName, nativeName } = getLanguageInfo(languageId)
    const languageName = englishName === nativeName ? englishName : `${englishName} (${nativeName})`

    // BUILD DOWNLOAD: /downloads/tagsets-{{id}}.json + /downloads/tagsets-{{id}}.csv
    const { tagSetTable } = await getVersionTables(id)
    const tagSets = await tagSetTable.findAll({
      attributes: {
        exclude: [
          'id',
          'autoMatchScores',
        ],
      },
    })

    const tagSetsData = tagSets.map(({ dataValues }) => dataValues)
    await write(`${pagesDir}downloads/tagsets-${id}.json`, JSON.stringify(tagSetsData))
    await write(`${pagesDir}downloads/tagsets-${id}.csv`, (new Parser({ fields: [ 'loc', 'tags', 'status', 'wordsHash', 'createdAt' ] })).parse(tagSetsData))

    // BUILD DOWNLOAD: /downloads/translationbreakdowns/{{id}}.json + /downloads/translationbreakdowns/{{id}}.csv
    const translationBreakdowns = await models.translationBreakdown.findAll({
      attributes: {
        exclude: [
          'id',
        ],
      },
      where: {
        versionId: id,
      },
    })

    const translationBreakdownsData = translationBreakdowns.map(({ dataValues }) => dataValues)
    await write(`${pagesDir}downloads/translationbreakdowns-${id}.json`, JSON.stringify(translationBreakdownsData))
    await write(`${pagesDir}downloads/translationbreakdowns-${id}.csv`, (new Parser({ fields: [ 'breakdown', 'createdAt', 'definitionId' ] })).parse(translationBreakdownsData))

    // BUILD PAGE: /versions/{{id}}.html
    await write(`${pagesDir}versions/${id}.html`,
      versionTemplate

        // general
        .replace(/{{header}}/g, headerTemplate)
        .replace(/{{footer}}/g, footerTemplate)
        .replace(/{{tag-submissions-over-time}}/g, tagSubmissionsOverTimeTemplate)
        .replace(/{{id}}/g, id)
        .replace(/{{name}}/g, name)
        .replace(/{{language}}/g, languageName)
        .replace(/{{languageId}}/g, languageId)
        .replace(/{{partialScope}}/g, partialScope === `ot` ? `Old Testament only.` : (partialScope === `nt` ? `New Testament only.` : ``))
        .replace(/{{now}}/g, now)
        .replace(/{{date}}/g, date)

        // stats
        .replace(/{{percentageOfWordsTagged}}/g, numVerses === numVersesWithTagging ? `100%` : (percentageOfWordsTagged < 0.005 ? `(requires at least one verse be tagged to calculate)` : `${Math.round(percentageOfWordsTagged * 100)}%`))
        .replace(/{{numVersesWithTagging}}/g, numVersesWithTagging)
        .replace(/{{percentageOfVersesWithTagging}}/g, `${Math.round((numVersesWithTagging * 100) / numVerses)}%`)
        .replace(/{{numVersesWithConfirmedTagging}}/g, numVersesWithConfirmedTagging)
        .replace(/{{percentageOfVersesWithConfirmedTagging}}/g, `${Math.round((numVersesWithConfirmedTagging * 100) / numVerses)}%`)
        .replace(/{{numVersesWithConfirmedTagging}}/g, numVersesWithConfirmedTagging)
        .replace(/{{numTaggers}}/g, taggerUserIds.length)
        .replace(/{{numTagSubmissions}}/g, numTagSubmissions)
        .replace(/{{tagSubmissionsOverTime}}/g, JSON.stringify(getFilledOutTagSubmissionsOverTime(tagSubmissionsOverTimeJson)))

        // technical
        .replace(/{{wordDivisionRegex}}/g, !wordDivisionRegex ? '<span class="special_value">[default]</span>' : wordDivisionRegex)
        .replace(/{{versificationModel}}/g, versificationModel)
        .replace(/{{skipsUnlikelyOriginals}}/g, skipsUnlikelyOriginals)
        .replace(/{{extraVerseMappings}}/g, JSON.stringify(extraVerseMappings))

    )

  }

  // Go through relevant languages
  for(let id of Object.keys(versionsByLanguageId)) {

    const {
      englishName,
      iso6392b,
      iso6392t,
      iso6391,
      nativeName,
      definitionPreferencesForVerbs,
      standardWordDivider,
      phraseDividerRegex,
      sentenceDividerRegex,
    } = getLanguageInfo(id)

    const name = englishName === nativeName ? englishName : `${englishName} (${nativeName})`

    const numVersesWithTagging = versionsByLanguageId[id].reduce((total, version) => total + version.dataValues.numVersesWithTagging, 0)
    const numVersesWithConfirmedTagging = versionsByLanguageId[id].reduce((total, version) => total + version.dataValues.numVersesWithConfirmedTagging, 0)
    const taggerUserIds = [ ...new Set(versionsByLanguageId[id].map(version => version.dataValues.taggerUserIds).flat()) ]
    const numTagSubmissions = versionsByLanguageId[id].reduce((total, version) => total + version.dataValues.numTagSubmissions, 0)
    const tagSubmissionsOverTime = versionsByLanguageId[id].reduce(
      (compiledTagSubmissionsOverTime, version) => {
        const tagSubmissionsOverTime = getFilledOutTagSubmissionsOverTime(version.dataValues.tagSubmissionsOverTimeJson)
        tagSubmissionsOverTime.forEach(([ date, count ], idx) => {
          compiledTagSubmissionsOverTime[idx] = [ date, ((compiledTagSubmissionsOverTime[idx] || [])[1] || 0) + count ]
        })
        return compiledTagSubmissionsOverTime
      },
      [],
    )

    // BUILD DOWNLOAD: /downloads/definitions-{{id}}.json + /downloads/definitions-{{id}}.csv
    const definitions = await models.definition.findAll({
      include: [
        {
          model: models.languageSpecificDefinition,
          required: false,
          attributes: {
            exclude: [
              'id',
              'editorId',
              'definitionId',
            ],
          },
          where: {
            languageId: id,
          },
        },
      ],
    })

    const definitionsData = definitions.map(({ dataValues: { languageSpecificDefinitions, ...otherDataValues } }) => ({
      ...otherDataValues,
      ...((languageSpecificDefinitions[0] || {}).dataValues || {}),
    }))
    await write(`${pagesDir}downloads/definitions-${id}.json`, JSON.stringify(definitionsData))
    await write(`${pagesDir}downloads/definitions-${id}.csv`, (new Parser()).parse(definitionsData))

    // BUILD PAGE: /languages/{{id}}.html
    await write(`${pagesDir}languages/${id}.html`,
      languageTemplate

        // general
        .replace(/{{header}}/g, headerTemplate)
        .replace(/{{footer}}/g, footerTemplate)
        .replace(/{{tag-submissions-over-time}}/g, tagSubmissionsOverTimeTemplate)
        .replace(/{{id}}/g, id)
        .replace(/{{name}}/g, name)
        .replace(/{{iso6391}}/g, iso6391 || '<span class="special_value">[none]</span>')
        .replace(/{{iso6392b}}/g, iso6392b || '<span class="special_value">[none]</span>')
        .replace(/{{iso6392t}}/g, iso6392t || '<span class="special_value">[none]</span>')
        .replace(/{{now}}/g, now)
        .replace(/{{date}}/g, date)

        // stats
        .replace(/{{numVersions}}/g, versionsByLanguageId[id].length)
        .replace(/{{numVersesWithTagging}}/g, numVersesWithTagging)
        .replace(/{{numVersesWithConfirmedTagging}}/g, numVersesWithConfirmedTagging)
        .replace(/{{numTaggers}}/g, taggerUserIds.length)
        .replace(/{{numTagSubmissions}}/g, numTagSubmissions)
        .replace(/{{tagSubmissionsOverTime}}/g, JSON.stringify(tagSubmissionsOverTime))

        // versions list
        .replace(
          /{{versionsList}}/g,
          versionsByLanguageId[id]
            .map(version => (
              languageVersionTemplate
                .replace(/{{id}}/g, version.id)
                .replace(/{{name}}/g, version.name)
            ))
            .join('\n')
        )

        // technical
        .replace(/{{definitionPreferencesForVerbs}}/g, definitionPreferencesForVerbs.join('<br>'))
        .replace(/{{standardWordDivider}}/g, standardWordDivider === ' ' ? '<span class="special_value">[space]</span>' : standardWordDivider)
        .replace(/{{phraseDividerRegex}}/g, phraseDividerRegex)
        .replace(/{{sentenceDividerRegex}}/g, sentenceDividerRegex)

    )

  }

  const numVersesWithTagging = versions.reduce((total, version) => total + version.dataValues.numVersesWithTagging, 0)
  const numVersesWithConfirmedTagging = versions.reduce((total, version) => total + version.dataValues.numVersesWithConfirmedTagging, 0)
  const taggerUserIds = [ ...new Set(versions.map(version => version.dataValues.taggerUserIds).flat()) ]
  const numTagSubmissions = versions.reduce((total, version) => total + version.dataValues.numTagSubmissions, 0)
  const tagSubmissionsOverTime = versions.reduce(
    (compiledTagSubmissionsOverTime, version) => {
      const tagSubmissionsOverTime = getFilledOutTagSubmissionsOverTime(version.dataValues.tagSubmissionsOverTimeJson)
      tagSubmissionsOverTime.forEach(([ date, count ], idx) => {
        compiledTagSubmissionsOverTime[idx] = [ date, ((compiledTagSubmissionsOverTime[idx] || [])[1] || 0) + count ]
      })
      return compiledTagSubmissionsOverTime
    },
    [],
  )

  // BUILD PAGE: /versions
  await write(`${pagesDir}index.html`,
    versionsTemplate

      // general
      .replace(/{{header}}/g, headerTemplate)
      .replace(/{{footer}}/g, footerTemplate)
      .replace(/{{tag-submissions-over-time}}/g, tagSubmissionsOverTimeTemplate)
      .replace(/{{date}}/g, date)

      // global stats
      .replace(/{{numLanguages}}/g, Object.values(versionsByLanguageId).length)
      .replace(/{{numVersions}}/g, versions.length)
      .replace(/{{numVersesWithTagging}}/g, numVersesWithTagging)
      .replace(/{{numVersesWithConfirmedTagging}}/g, numVersesWithConfirmedTagging)
      .replace(/{{numTaggers}}/g, taggerUserIds.length)
      .replace(/{{numTagSubmissions}}/g, numTagSubmissions)
      .replace(/{{tagSubmissionsOverTime}}/g, JSON.stringify(tagSubmissionsOverTime))

      // list
      .replace(
        /{{languagesWithVersionsList}}/g,
        Object.keys(versionsByLanguageId)
          .sort((lId1, lId2) => getLanguageInfo(lId1).englishName < getLanguageInfo(lId2).englishName ? -1 : 1)
          .map(languageId => {
            const { englishName, nativeName } = getLanguageInfo(languageId)
            const name = englishName === nativeName ? englishName : `${englishName} (${nativeName})`
            return (
              versionsLanguageTemplate
                .replace(/{{id}}/g, languageId)
                .replace(/{{name}}/g, name)
                .replace(
                  /{{versionsList}}/g,
                  versionsByLanguageId[languageId]
                    .map(version => {
                      const grayScaleNum = parseInt(Math.min(1, (version.dataValues.numTagSubmissions / 6000) * .9 + .1) * -255 + 255, 10)
                      const numTagSubmissionsBGColor = `rgb(${grayScaleNum} ${grayScaleNum} ${grayScaleNum})`
                      const numTagSubmissionsColor = grayScaleNum < 160 ? `white` : `black`
                      return (
                        versionsVersionTemplate
                          .replace(/{{id}}/g, version.id)
                          .replace(/{{name}}/g, version.name)
                          .replace(/{{numTagSubmissions}}/g, version.dataValues.numTagSubmissions)
                          .replace(/{{numTagSubmissionsBGColor}}/g, numTagSubmissionsBGColor)
                          .replace(/{{numTagSubmissionsColor}}/g, numTagSubmissionsColor)
                      )
                    })
                    .join('\n')
                )
            )
          })
          .join('\n')
      )

  )

}

module.exports = buildPages