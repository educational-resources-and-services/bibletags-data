const fs = require('fs').promises
const { getLanguageInfo } = require('@bibletags/bibletags-ui-helper')
const { Parser } = require('json2csv')
const AWS = require('aws-sdk')

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

const buildPages = async ({
  changedVersionIds,
}={}) => {

  if([ undefined, null, false, 'none' ].includes(process.env.AWS_DOWNLOADS_BUCKET) && !process.env.LOCAL) return

  const mkdir = process.env.LOCAL ? fs.mkdir : ()=>{}
  const write = process.env.LOCAL ? fs.writeFile : writeToS3
  const pagesDir = process.env.LOCAL ? `./pages/` : ``

  const { models } = global.connection
  const now = Date.now()
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const versions = await models.version.findAll({
    attributes: {
      include: [
        [connection.literal(`(SELECT IFNULL((SELECT AVG(LENGTH(tags)) FROM tagSets WHERE versionId=version.id) / (SELECT AVG(LENGTH(tags)) FROM tagSets WHERE status="unconfirmed" AND versionId=version.id), 0))`), `percentageOfWordsTagged`],
        [connection.literal(`(SELECT COUNT(*) FROM tagSets WHERE versionId=version.id)`), `numVerses`],
        [connection.literal(`(SELECT COUNT(*) FROM tagSets WHERE status IN ("unconfirmed", "confirmed") AND versionId=version.id)`), `numVersesWithTagging`],
        [connection.literal(`(SELECT COUNT(*) FROM tagSets WHERE status IN ("confirmed") AND versionId=version.id)`), `numVersesWithConfirmedTagging`],
        [connection.literal(`(SELECT COUNT(DISTINCT userId) FROM tagSetSubmissions WHERE versionId=version.id)`), `numTaggers`],
        [connection.literal(`(SELECT COUNT(*) FROM tagSetSubmissions WHERE versionId=version.id)`), `numTagSubmissions`],
      ],
    },
    order: [[ 'name' ]],
  })

  const [[{
    numVersesWithTagging,
    numVersesWithConfirmedTagging,
    numTaggers,
    numTagSubmissions,
  }]] = await global.connection.query(`
    SELECT
      (SELECT COUNT(*) FROM tagSets WHERE status IN ("unconfirmed", "confirmed")) AS numVersesWithTagging,
      (SELECT COUNT(*) FROM tagSets WHERE status IN ("confirmed")) AS numVersesWithConfirmedTagging,
      (SELECT COUNT(DISTINCT userId) FROM tagSetSubmissions) AS numTaggers,
      (SELECT COUNT(*) FROM tagSetSubmissions) AS numTagSubmissions
  `)

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
  const cssIndex = (await fs.readFile(`./src/templates/index.css`)).toString()

  await mkdir(`${pagesDir}versions`, { recursive: true })
  await mkdir(`${pagesDir}languages`, { recursive: true })
  await mkdir(`${pagesDir}downloads`, { recursive: true })

  // CSS
  await write(`${pagesDir}index.css`, cssIndex)

  // BUILD PAGE: /versions
  await write(`${pagesDir}index.html`,
    versionsTemplate

      // general
      .replace(/{{header}}/g, headerTemplate)
      .replace(/{{footer}}/g, footerTemplate)
      .replace(/{{date}}/g, date)

      // global stats
      .replace(/{{numLanguages}}/g, Object.values(versionsByLanguageId).length)
      .replace(/{{numVersions}}/g, versions.length)
      .replace(/{{numVersesWithTagging}}/g, numVersesWithTagging)
      .replace(/{{numVersesWithConfirmedTagging}}/g, numVersesWithConfirmedTagging)
      .replace(/{{numTaggers}}/g, numTaggers)
      .replace(/{{numTagSubmissions}}/g, numTagSubmissions)

      // list
      .replace(
        /{{languagesWithVersionsList}}/g,
        Object.keys(versionsByLanguageId)
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
                    .map(version => (
                      versionsVersionTemplate
                        .replace(/{{id}}/g, version.id)
                        .replace(/{{name}}/g, version.name)
                    ))
                    .join('\n')
                )
            )
          })
          .join('\n')
      )

  )

  // Go through relevant versions
  const relevantVersions = versions.filter(({ id }) => (!changedVersionIds || changedVersionIds.includes(id)))
  for(let version of relevantVersions) {

    const {
      id,
      name,
      languageId,
      partialScope,
      percentageOfWordsTagged,
      numVerses,
      numVersesWithTagging,
      numVersesWithConfirmedTagging,
      numTaggers,
      numTagSubmissions,
      wordDivisionRegex,
      versificationModel,
      skipsUnlikelyOriginals,
      extraVerseMappings,
    } = version.dataValues

    const { englishName, nativeName } = getLanguageInfo(languageId)
    const languageName = englishName === nativeName ? englishName : `${englishName} (${nativeName})`

    // BUILD DOWNLOAD: /downloads/tagsets-{{id}}.json + /downloads/tagsets-{{id}}.csv
    const tagSets = await models.tagSet.findAll({
      attributes: {
        exclude: [
          'id',
          'autoMatchScores',
        ],
      },
      where: {
        versionId: id,
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
        .replace(/{{id}}/g, id)
        .replace(/{{name}}/g, name)
        .replace(/{{language}}/g, languageName)
        .replace(/{{languageId}}/g, languageId)
        .replace(/{{partialScope}}/g, partialScope === `ot` ? `Old Testament only.` : (partialScope === `nt` ? `New Testament only.` : ``))
        .replace(/{{now}}/g, now)
        .replace(/{{date}}/g, date)

        // stats
        .replace(/{{percentageOfWordsTagged}}/g, numVerses === numVersesWithTagging ? `100%` : (!percentageOfWordsTagged ? `(requires at least one verse be tagged to calculate)` : `${Math.round(percentageOfWordsTagged * 100)}%`))
        .replace(/{{numVersesWithTagging}}/g, numVersesWithTagging)
        .replace(/{{percentageOfVersesWithTagging}}/g, `${Math.round((numVersesWithTagging * 100) / numVerses)}%`)
        .replace(/{{numVersesWithConfirmedTagging}}/g, numVersesWithConfirmedTagging)
        .replace(/{{percentageOfVersesWithConfirmedTagging}}/g, `${Math.round((numVersesWithConfirmedTagging * 100) / numVerses)}%`)
        .replace(/{{numVersesWithConfirmedTagging}}/g, numVersesWithConfirmedTagging)
        .replace(/{{numTaggers}}/g, numTaggers)
        .replace(/{{numTagSubmissions}}/g, numTagSubmissions)

        // technical
        .replace(/{{wordDivisionRegex}}/g, !wordDivisionRegex ? '<span class="special_value">[default]</span>' : wordDivisionRegex)
        .replace(/{{versificationModel}}/g, versificationModel)
        .replace(/{{skipsUnlikelyOriginals}}/g, skipsUnlikelyOriginals)
        .replace(/{{extraVerseMappings}}/g, JSON.stringify(extraVerseMappings))

    )

  }

  // Go through relevant languages
  const relevantLanguageIds = Object.keys(versionsByLanguageId).filter(id => (!changedVersionIds || versionsByLanguageId[id].some(({ id }) => changedVersionIds.includes(id))))
  for(let id of relevantLanguageIds) {

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
    const numTaggers = versionsByLanguageId[id].reduce((total, version) => total + version.dataValues.numTaggers, 0)
    const numTagSubmissions = versionsByLanguageId[id].reduce((total, version) => total + version.dataValues.numTagSubmissions, 0)

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
        .replace(/{{numTaggers}}/g, numTaggers)
        .replace(/{{numTagSubmissions}}/g, numTagSubmissions)

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

}

module.exports = buildPages