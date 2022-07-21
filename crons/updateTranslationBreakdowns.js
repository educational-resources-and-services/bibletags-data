const { Op } = require('sequelize')

const { setUpConnection } = require('../src/db/connect')
const { equalObjs } = require('../src/utils')

const updateTranslationBreakdowns = async () => {
  const cronId = parseInt(Math.random() * 999999)
  console.log(`Beginning cron run for updateTranslationBreakdowns (cron id:${cronId})...`)

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

    const versionsByLanguageId = {}
    const versions = await models.version.findAll()
    versions.forEach(version => {
      versionsByLanguageId[version.languageId] = versionsByLanguageId[version.languageId] || []
      versionsByLanguageId[version.languageId].push(version)
    })

    const doTestament = async origLangVersionId => {

      console.log(`updateTranslationBreakdowns cron now handling ${origLangVersionId === 'uhb' ? 'ot' : 'nt'} (cron id:${cronId})`)

      for(let languageId in versionsByLanguageId) {
        for(let version of versionsByLanguageId[languageId]) {

          console.log(`updateTranslationBreakdowns cron now handling versionId:${version.id} (cron id:${cronId})`)

          const updatedBreakdownsByDefinitionId = {}

          {  // blocked off for the sake of memory garbage collection
            const wordTranslations = await models.wordTranslation.findAll({
              where: {
                versionId: version.id,
              },
              include: [
                {
                  model: models.wordTranslationDefinition,
                  required: true,
                  where: {
                    definitionId: {
                      [Op.like]: `${origLangVersionId === 'uhb' ? 'H' : 'G'}%`,
                    },
                  },
                },
              ],
            })

            const wordTranslationsByDefinitionId = {}

            wordTranslations.forEach(wordTranslation => {
              wordTranslation.wordTranslationDefinitions.forEach(({ definitionId }) => {
                wordTranslationsByDefinitionId[definitionId] = wordTranslationsByDefinitionId[definitionId] || []
                wordTranslationsByDefinitionId[definitionId].push(wordTranslation)
              })
            })

            Object.keys(wordTranslationsByDefinitionId).forEach(definitionId => {
              
              const trObj = {}

              wordTranslationsByDefinitionId[definitionId].forEach(wordTranslation => {
                const { translation, hits, wordTranslationDefinitions } = wordTranslation
                const key = (
                  wordTranslationDefinitions > 1
                    ? wordTranslationDefinitions.map(({ form }) => form).join(` `)
                    : ``
                )
                trObj[key] = trObj[key] || {}
                trObj[key][translation] = trObj[key][translation] || { hits: 0, tr: translation }
                trObj[key][translation].hits += hits
                if(wordTranslationDefinitions === 1) {
                  trObj[key][translation].forms = trObj[key][translation].forms || []
                  trObj[key][translation].forms.push(wordTranslationDefinitions[0].form)
                }
              })

              const addHits = (total, { hits }) => total + hits

              updatedBreakdownsByDefinitionId[definitionId] = (
                Object.keys(trObj)
                  .map(formsCombo => ([
                    formsCombo,
                    Object.values(trObj[formsCombo]).sort((a,b) => a.hits < b.hits ? 1 : -1)
                  ]))
                  .sort((a,b) => (
                    (
                      b[0] === ``
                      || a[1].reduce(addHits, 0) < b[1].reduce(addHits, 0)
                    )
                      ? 1
                      : -1
                  ))
              )

            })
          }

          const oldTranslationBreakdowns = await models.translationBreakdown.findAll({
            where: {
              versionId: version.id,
              definitionId: {
                [Op.like]: `${origLangVersionId === 'uhb' ? 'H' : 'G'}%`,
              },
            },
          })

          await global.connection.transaction(async t => {

            const updates = []

            oldTranslationBreakdowns.forEach(translationBreakdown => {

              const { definitionId, breakdown } = translationBreakdown

              if(updatedBreakdownsByDefinitionId[definitionId]) {
                if(!equalObjs(updatedBreakdownsByDefinitionId[definitionId], breakdown)) {
                  translationBreakdown.breakdown = breakdown
                  updates.push(translationBreakdown.save({transaction: t}))
                }
              } else {
                updates.push(translationBreakdown.destroy({transaction: t}))
              }

              delete updatedBreakdownsByDefinitionId[definitionId]

            })

            updates.push(
              models.translationBreakdown.bulkCreate(
                Object.keys(updatedBreakdownsByDefinitionId).map(definitionId => ({
                  breakdown: updatedBreakdownsByDefinitionId[definitionId],
                  definitionId,
                  versionId: version.id,
                })),
                {
                  validate: true,
                  transaction: t,
                },
              )
            )

            // wait for updates to finish
            await Promise.all(updates)

          })

        }
      }

    }

    await doTestament(`uhb`)
    await doTestament(`ugnt`)

    console.log(`...completed cron run for updateTranslationBreakdowns in ${(Date.now() - now)/1000} seconds (cron id:${cronId}).`)

  } catch(err) {
    console.error(`cron updateTranslationBreakdowns failed (cron id:${cronId}).`, err)
    delete global.connection  // to make sure it is reset next time
  }
}

module.exports = updateTranslationBreakdowns