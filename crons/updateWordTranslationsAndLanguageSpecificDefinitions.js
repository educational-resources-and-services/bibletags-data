const { Op, fn } = require('sequelize')

const { setUpConnection } = require('../src/db/connect')

const updateWordTranslationsAndLanguageSpecificDefinitions = async () => {
  const cronId = parseInt(Math.random() * 999999)
  console.log(`Beginning cron run (cron id:${cronId})...`)

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

        // run on definitionId (as an async cron?)

          // get a tag for each versionId (in the current language), for each loc with the definitionId (or Hebrew prefix preposition)
          // for each
            // find the tagItem(s) which contain the definitionId
            // for each
              // find identical tagSetSubmissionItem+
              // add to build of wordTranslations+ with the word(s) and definitionId(s)

          // if languageSpecificDefinition (for this definitionId/languageId combo) not edited by editor
            // recalculate languageSpecificDefinitions
              // search items in definitionPreferencesForVerbs, one at a time, until something is found
                // go through all locs that turn up, searching for the word they are translated to via an object created in the above block
                // if 1+ found, comma-separate these into a list. this is the new languageSpecificDefinition
            // update languageSpecificDefinitions if changed
            // find every languageSpecificDefinition with this definition in its syn or rel (two new tables needed for this)
              // update them

          // after: delete all definitionUpdateItems with this definitionId

    await global.connection.transaction(async t => {



    })

    console.log(`...completed cron run (cron id:${cronId}).`)

  } catch(err) {
    console.error(`cron failed (cron id:${cronId}).`, err)
    delete global.connection  // to make sure it is reset next time
  }
}

module.exports = updateWordTranslationsAndLanguageSpecificDefinitions