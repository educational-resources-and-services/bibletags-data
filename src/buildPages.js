const fs = require('fs').promises
const { getLanguageInfo } = require('@bibletags/bibletags-ui-helper')

const pagesDir = `./pages`

const buildPages = async ({
  changedVersionIds,
}={}) => {

  const { models } = global.connection
  const now = Date.now()

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

  await fs.mkdir(`${pagesDir}/versions`, { recursive: true })
  await fs.mkdir(`${pagesDir}/languages`, { recursive: true })
  await fs.mkdir(`${pagesDir}/downloads/definitions`, { recursive: true })
  await fs.mkdir(`${pagesDir}/downloads/tagsets`, { recursive: true })
  await fs.mkdir(`${pagesDir}/downloads/translationbreakdowns`, { recursive: true })

  // CSS
  await fs.writeFile(`${pagesDir}/index.css`, cssIndex)

  // PAGE: /versions
  await fs.writeFile(`${pagesDir}/versions/index.html`,
    versionsTemplate

      // general
      .replace(/{{header}}/g, headerTemplate)
      .replace(/{{footer}}/g, footerTemplate)

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

  // PAGE: /versions/{{id}}.html
  await Promise.all(
    versions
      .filter(({ id }) => (!changedVersionIds || changedVersionIds.includes(id)))
      .map(async version => {

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

        await fs.writeFile(`${pagesDir}/versions/${id}.html`,
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

            // stats
            .replace(/{{percentageOfWordsTagged}}/g, numVerses === numVersesWithTagging ? `100%` : `${Math.round(percentageOfWordsTagged * 100)}%`)
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

      })
  )

  // PAGE: /languages/{{id}}.html
  await Promise.all(
    Object.keys(versionsByLanguageId)
      .filter(id => (!changedVersionIds || versionsByLanguageId[id].some(({ id }) => changedVersionIds.includes(id))))
      .map(async id => {

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

        await fs.writeFile(`${pagesDir}/languages/${id}.html`,
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

      })
  )

}

module.exports = buildPages