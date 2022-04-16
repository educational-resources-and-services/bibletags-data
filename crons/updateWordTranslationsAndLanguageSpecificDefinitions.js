const { Op } = require('sequelize')
const { wordPartDividerRegex, getMainWordPartIndex } = require('@bibletags/bibletags-ui-helper')

const { setUpConnection } = require('../src/db/connect')

const prefixToDefinitionIdMap = {
  "ב": 'b',
  "ל": 'l',
  "כ": 'k',
  "מ": 'm',
  "ו": 'c',
  "ש": 's',
}

const updateWordTranslationsAndLanguageSpecificDefinitions = async () => {
  const cronId = parseInt(Math.random() * 999999)
  console.log(`Beginning cron run for updateWordTranslationsAndLanguageSpecificDefinitions (cron id:${cronId})...`)

  const now = Date.now()

  try {

    // Connect to DB if not already connected
    if(!global.connection) {
      console.log(`Establishing DB connection (cron id:${cronId})...`)
      setUpConnection()
      await global.connection.authenticate()
      console.log(`...DB connection established (cron id:${cronId}).`)
    }

    const { models } = global.connection

    const languagesWithVersions = await models.language.findAll({
      include: [
        {
          model: models.version,
          require: true,
        },
      ],
    })

    const doTestament = async origLangVersionId => {

      console.log(`updateWordTranslationsAndLanguageSpecificDefinitions cron now handling ${origLangVersionId === 'uhb' ? 'ot' : 'nt'} (cron id:${cronId})`)

      const origWordMap = {}
      const words = await models[`${origLangVersionId}Word`].findAll({
        attributes: [
          'id',
          'form',
          'definitionId',
          'fullParsing',
        ],
        order: [ `bookId`, `wordNumber` ],
      })
      words.forEach(({ dataValues: { id, ...otherAttributes }}, idx) => {
        origWordMap[id] = otherAttributes
        if(origLangVersionId === 'ugnt' && otherAttributes.fullParsing[3] === 'P' && idx < words.length-1) {
          origWordMap[id].case = words[idx+1].fullParsing[9]
        }
      })

      for(let language of languagesWithVersions) {
        for(let version of language.versions) {

          console.log(`updateWordTranslationsAndLanguageSpecificDefinitions cron now handling versionId:${version.id} (cron id:${cronId})`)

          // find all tags with associated tagSetSubmissionItems
          const tagJsonConcat = `
            CONCAT(
              '{"o":[',
              (
                SELECT GROUP_CONCAT( CONCAT('"', ts.${origLangVersionId}WordId, ${origLangVersionId === `uhb` ? ` '|', ts.wordPartNumber, ` : ``} '"') )
                FROM ${origLangVersionId}TagSubmissions AS ts
                WHERE ts.tagSetSubmissionItemId = tssi.id
                ORDER BY ts.${origLangVersionId}WordId ${origLangVersionId === `uhb` ? `, ts.wordPartNumber` : ``}
              ),
              '],"t":[',
              (
                SELECT GROUP_CONCAT(tssitw.wordNumberInVerse)
                FROM tagSetSubmissionItemTranslationWords AS tssitw
                WHERE tssitw.tagSetSubmissionItemId = tssi.id
                ORDER BY tssitw.wordNumberInVerse
              ),
              ']}'
            )
          `
          const translationConcat = `
            (
              SELECT GROUP_CONCAT(tssitw.word SEPARATOR ' ') AS translation
              FROM tagSetSubmissionItemTranslationWords AS tssitw
              WHERE tssitw.tagSetSubmissionItemId = tssi.id
              ORDER BY tssitw.wordNumberInVerse
            )
          `
          const tagSetSubmissionItems = await global.connection.query(
            `
              SELECT DISTINCT
                ${translationConcat} AS translation,
                ${tagJsonConcat} AS tagJSON

              FROM tagSets AS ts
                LEFT JOIN tagSetSubmissions AS tss ON (ts.loc = tss.loc AND ts.wordsHash = tss.wordsHash AND ts.versionId = tss.versionId)
                LEFT JOIN tagSetSubmissionItems AS tssi ON (tssi.tagSetSubmissionId = tss.id)

              WHERE ts.versionId = :versionId
                AND ts.loc REGEXP "${origLangVersionId === 'uhb' ? '^[0-3]' : '^[4-6]'}"
                AND tss.versionId = :versionId
                AND tss.loc REGEXP "${origLangVersionId === 'uhb' ? '^[0-3]' : '^[4-6]'}"
                AND ts.tags LIKE CONCAT( '%', ${tagJsonConcat}, '%' )
            `,
            {
              nest: true,
              replacements: {
                versionId: version.id,
              },
            },
          )

          const updatedWordTranslationsByUniqueKey = {}

          tagSetSubmissionItems.forEach(({ translation, tagJSON }) => {
            const wordIdAndParts = JSON.parse(tagJSON).o
            const definitionIdAndFormSets = []
            wordIdAndParts.map(wordIdAndPart => {
              const [ wordId, wordPartNumber ] = wordIdAndPart.split('|')
              const morphParts = origWordMap[wordId].fullParsing.slice(3).split(':')
              const mainPartIdx = getMainWordPartIndex(morphParts)
              const isMainWordPart = (
                origLangVersionId === 'uhb'
                  ? mainPartIdx === wordPartNumber-1
                  : true
              )
              const form = origWordMap[wordId].form.split(wordPartDividerRegex)[wordPartNumber - 1]
              if(isMainWordPart) {
                definitionIdAndFormSets.push([ origWordMap[wordId].definitionId, form ])
              } else {
                const definitionId = (
                  prefixToDefinitionIdMap[form]
                  || (
                    origWordMap[wordId].fullParsing.substring(3)
                      .split(':')[wordPartNumber - 1]
                      .replace(/^T/, '')
                      .replace(/^(S.).*$/, '$1')
                  )
                )
                definitionIdAndFormSets.push([ definitionId, form ])
              }
              updatedWordTranslationsByUniqueKey
              origWordMap[wordId]
            })
            const uniqueKey = JSON.stringify([ translation, definitionIdAndFormSets ]) 
            updatedWordTranslationsByUniqueKey[uniqueKey] = updatedWordTranslationsByUniqueKey[uniqueKey] || 0
            updatedWordTranslationsByUniqueKey[uniqueKey]++
          })

          const oldWordTranslations = await models.wordTranslation.findAll({
            where: {
              versionId: version.id,
            },
            include: [
              {
                model: models.wordTranslationDefinition,
                require: true,
                where: {
                  definitionId: {
                    [origLangVersionId === 'uhb' ? Op.notLike : Op.like]: `G%`
                  },
                },
              },
            ],
          })

          // form and update languageSpecificDefinitions

            // gloss considerations
              // for each POS
                // verbs use defPrefsForVerbs
                  // for each Hebrew stem
                // prepositions
                  // for each Greek case
              // in combo with another word (one translation gloss for each combo, with orig combo in parens)
            // lexEntry segmentation
              // POS
                // Hebrew verb by stem
                // Greek prepositions by case of associated words
              // in combo with another word

          console.log(`updateWordTranslationsAndLanguageSpecificDefinitions cron – versionId:${version.id} — ${oldWordTranslations.length} old wordTranslations, ${Object.values(updatedWordTranslationsByUniqueKey).length} new wordTranslations (cron id:${cronId})`)

          await global.connection.transaction(async t => {

            const updates = []

            oldWordTranslations.forEach(wordTranslation => {

              const { translation, hits, wordTranslationDefinitions } = wordTranslation
              const definitionIdAndFormSets = wordTranslationDefinitions.map(({ definitionId, form }) => ([ definitionId, form ]))
              const uniqueKey = JSON.stringify([ translation, definitionIdAndFormSets ])

              if(updatedWordTranslationsByUniqueKey[uniqueKey]) {
                if(updatedWordTranslationsByUniqueKey[uniqueKey] !== hits) {
                  wordTranslation.hits = hits
                  updates.push(wordTranslation.save({transaction: t}))
                }
              } else {
                updates.push(wordTranslation.destroy({transaction: t}))
              }

              delete updatedWordTranslationsByUniqueKey[uniqueKey]

            })

            updates.push(
              ...Object.keys(updatedWordTranslationsByUniqueKey).map(async uniqueKey => {

                const hits = updatedWordTranslationsByUniqueKey[uniqueKey]
                const [ translation, definitionIdAndFormSets ] = JSON.parse(uniqueKey)

                const newWordTranslation = await models.wordTranslation.create(
                  {
                    translation,
                    hits,
                    versionId: version.id,
                  },
                  {transaction: t},
                )

                await models.wordTranslationDefinition.bulkCreate(
                  definitionIdAndFormSets.map(([ definitionId, form ]) => ({
                    wordTranslationId: newWordTranslation.id,
                    definitionId,
                    form,
                  })),
                  {transaction: t},
                )

              })
            )

            console.log(`updateWordTranslationsAndLanguageSpecificDefinitions cron – versionId:${version.id} — ${updates.length} updates or creates (cron id:${cronId})...`)

            // wait for updates to finish
            await Promise.all(updates)

            console.log(`...updateWordTranslationsAndLanguageSpecificDefinitions cron – versionId:${version.id} — updates and creates complete (cron id:${cronId})`)

          })

        }
      }

    }

    await doTestament(`uhb`)
    await doTestament(`ugnt`)

    console.log(`...completed cron run for updateWordTranslationsAndLanguageSpecificDefinitions in ${(Date.now() - now)/1000} seconds (cron id:${cronId}).`)

  } catch(err) {
    console.error(`cron updateWordTranslationsAndLanguageSpecificDefinitions failed (cron id:${cronId}).`, err)
    delete global.connection  // to make sure it is reset next time
  }
}

module.exports = updateWordTranslationsAndLanguageSpecificDefinitions