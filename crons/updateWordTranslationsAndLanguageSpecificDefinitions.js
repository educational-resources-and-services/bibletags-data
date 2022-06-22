const { Op } = require('sequelize')
const { wordPartDividerRegex, getMainWordPartIndex } = require('@bibletags/bibletags-ui-helper')

const { setUpConnection } = require('../src/db/connect')
const updateTranslationBreakdowns = require('./updateTranslationBreakdowns')

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
          required: true,
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

          const translationsByLocWordsHashAndWordNumbers = {}
          const updatedHitsByUniqueKey = {}

          {  // blocked off to facilitate memory garbage collection
            const tagSetSubmissionItems = await models.tagSetSubmissionItem.findAll({
              attributes: [ 'id' ],
              include: [
                {
                  model: models.tagSetSubmission,
                  required: true,
                  attributes: [ 'loc', 'wordsHash' ],
                  where: {
                    loc: {
                      [Op.regexp]: origLangVersionId === 'uhb' ? '^[0-3]' : '^[4-6]',
                    },
                    versionId: version.id,
                  },
                },
                {
                  model: models.tagSetSubmissionItemTranslationWord,
                  required: false,
                  attributes: [ 'wordNumberInVerse', 'word' ],
                },
              ],
              order: [
                [
                  models.tagSetSubmissionItemTranslationWord,
                  'wordNumberInVerse',
                ]
              ],
            })

            tagSetSubmissionItems.forEach(({ tagSetSubmission: { loc, wordsHash }, tagSetSubmissionItemTranslationWords }) => {
              const translation = tagSetSubmissionItemTranslationWords.map(({ word }) => word).join(language.standardWordDivider)
              const wordNumbers = tagSetSubmissionItemTranslationWords.map(({ wordNumberInVerse }) => wordNumberInVerse).join(',')
              translationsByLocWordsHashAndWordNumbers[`${loc} ${wordsHash}`] = translationsByLocWordsHashAndWordNumbers[`${loc} ${wordsHash}`] || {}
              translationsByLocWordsHashAndWordNumbers[`${loc} ${wordsHash}`][wordNumbers] = translation
            })
          }

          {  // blocked off to facilitate memory garbage collection
            const wordHashesSubmissions = await models.wordHashesSubmission.findAll({
              attributes: [ 'wordNumberInVerse', 'hash' ],
              include: [
                {
                  model: models.wordHashesSetSubmission,
                  required: true,
                  attributes: [ 'loc', 'wordsHash' ],
                  where: {
                    loc: {
                      [Op.regexp]: origLangVersionId === 'uhb' ? '^[0-3]' : '^[4-6]',
                    },
                    versionId: version.id,
                  },
                },
              ],
            })

            const translationsByHash = {}
            const hashesWithoutTagSubmission = []
            wordHashesSubmissions.forEach(({ wordNumberInVerse, hash, wordHashesSetSubmission: { loc, wordsHash } }) => {
              const translationsByWordNumbers = translationsByLocWordsHashAndWordNumbers[`${loc} ${wordsHash}`]
              if(translationsByWordNumbers) {
                if(translationsByWordNumbers[wordNumberInVerse]) {
                  translationsByHash[hash] = translationsByWordNumbers[wordNumberInVerse]
                }
              } else {
                hashesWithoutTagSubmission.push({ loc, wordsHash, hash, wordNumberInVerse })
              }
            })
            hashesWithoutTagSubmission.forEach(({ loc, wordsHash, hash, wordNumberInVerse }) => {
              if(translationsByHash[hash]) {
                translationsByLocWordsHashAndWordNumbers[`${loc} ${wordsHash}`] = translationsByLocWordsHashAndWordNumbers[`${loc} ${wordsHash}`] || {}
                translationsByLocWordsHashAndWordNumbers[`${loc} ${wordsHash}`][wordNumberInVerse] = translationsByHash[hash]
              }
            })
          }

          {  // blocked off to facilitate memory garbage collection
            const tagSets = await models.tagSet.findAll({
              attributes: [ 'loc', 'tags', 'wordsHash' ],
              where: {
                loc: {
                  [Op.regexp]: origLangVersionId === 'uhb' ? '^[0-3]' : '^[4-6]',
                },
                versionId: version.id,
              },
            })


            tagSets.forEach(({ tags, loc, wordsHash }) => {
              tags.forEach(tag => {

                // get translation, definitionId, and form
                const translation = (translationsByLocWordsHashAndWordNumbers[`${loc} ${wordsHash}`] || {})[tag.t.join(',')]
                if(translation === undefined) return
                
                // get definitionId and form
                if(tag.o.length === 0) return
                const definitionIdAndFormSets = []
                tag.o.forEach(wordIdAndPart => {
                  const [ wordId, wordPartNumber ] = wordIdAndPart.split('|')
                  if(!origWordMap[wordId]) {
                    console.log(`Missing wordId: ${wordId} (likely due to change to USFM or original)`)
                    return
                  }
                  const morphParts = origWordMap[wordId].fullParsing.slice(3).split(':')
                  const mainPartIdx = getMainWordPartIndex(morphParts)
                  const isMainWordPart = (
                    origLangVersionId === 'uhb'
                      ? mainPartIdx === wordPartNumber-1
                      : true
                  )
                  const form = origWordMap[wordId].form.split(wordPartDividerRegex)[wordPartNumber - 1]
                  if(isMainWordPart) {
                    definitionIdAndFormSets.push([
                      origWordMap[wordId].definitionId || prefixToDefinitionIdMap[form],
                      form,
                    ])
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
                  updatedHitsByUniqueKey
                  origWordMap[wordId]
                })

                // add on hit
                const uniqueKey = JSON.stringify([ translation, definitionIdAndFormSets ]) 
                updatedHitsByUniqueKey[uniqueKey] = updatedHitsByUniqueKey[uniqueKey] || 0
                updatedHitsByUniqueKey[uniqueKey]++

              })
            })
          }

          const oldWordTranslations = await models.wordTranslation.findAll({
            where: {
              versionId: version.id,
            },
            include: [
              {
                model: models.wordTranslationDefinition,
                required: true,
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

          console.log(`updateWordTranslationsAndLanguageSpecificDefinitions cron – versionId:${version.id} — ${oldWordTranslations.length} old wordTranslations, ${Object.values(updatedHitsByUniqueKey).length} new wordTranslations (cron id:${cronId})`)


          const updates = []

          oldWordTranslations.forEach(wordTranslation => {

            const { translation, hits, wordTranslationDefinitions } = wordTranslation
            const definitionIdAndFormSets = wordTranslationDefinitions.map(({ definitionId, form }) => ([ definitionId, form ]))
            const uniqueKey = JSON.stringify([ translation, definitionIdAndFormSets ])

            if(updatedHitsByUniqueKey[uniqueKey]) {
              if(updatedHitsByUniqueKey[uniqueKey] !== hits) {
                wordTranslation.hits = hits
                updates.push(wordTranslation.save())
              }
            } else {
              updates.push(wordTranslation.destroy())
            }

            delete updatedHitsByUniqueKey[uniqueKey]

          })

          updates.push(
            ...Object.keys(updatedHitsByUniqueKey).map(async uniqueKey => {

              const hits = updatedHitsByUniqueKey[uniqueKey]
              const [ translation, definitionIdAndFormSets ] = JSON.parse(uniqueKey)

              await global.connection.transaction(async t => {

// if(definitionIdAndFormSets.some(([ definitionId ]) => !definitionId)) {
//   console.log('>>>>', definitionIdAndFormSets, translation)
//   return
// }

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
                  {
                    validate: true,
                    transaction: t,
                  },
                )

              })

            })
          )

          console.log(`updateWordTranslationsAndLanguageSpecificDefinitions cron – versionId:${version.id} — ${updates.length} updates or creates (cron id:${cronId})...`)

          // wait for updates to finish
          await Promise.all(updates)

          console.log(`...updateWordTranslationsAndLanguageSpecificDefinitions cron – versionId:${version.id} — updates and creates complete (cron id:${cronId})`)


        }
      }

    }

    await doTestament(`uhb`)
    await doTestament(`ugnt`)

    console.log(`...completed cron run for updateWordTranslationsAndLanguageSpecificDefinitions in ${(Date.now() - now)/1000} seconds (cron id:${cronId}).`)

    await updateTranslationBreakdowns()

  } catch(err) {
    console.error(`cron updateWordTranslationsAndLanguageSpecificDefinitions failed (cron id:${cronId}).`, err)
    delete global.connection  // to make sure it is reset next time
  }
}

module.exports = updateWordTranslationsAndLanguageSpecificDefinitions