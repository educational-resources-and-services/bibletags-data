require('dotenv').config()

const updateWordTranslationsAndLanguageSpecificDefinitions = require('./crons/updateWordTranslationsAndLanguageSpecificDefinitions')
const rerunCalcTagSetsForUntaggedVerses = require('./crons/rerunCalcTagSetsForUntaggedVerses')
const rebuildAllPages = require('./crons/rebuildAllPages')

const handler = async ({ forceRunAll }={}) => {

  const day = new Date().getDay()  // 0-6
  const hours = new Date().getHours()  // 0-23
  const minutes = new Date().getMinutes()  // 0-59

  if((minutes === 0) || forceRunAll) {  // once per hour
    // await updateWordTranslationsAndLanguageSpecificDefinitions()
    // A couple things here need fixing:
      // 1) currently there is a unique index on wordTranslationDefinitions for definitionId and wordTranslationId.
      //    BUT, multi orig-word tags break this
      // 2) For some unknown reason, it is trying to insert a wordTranslationDefinition with definitionId === NULL
  }

  if((minutes === 10) || forceRunAll) {  // once per hour
    await rerunCalcTagSetsForUntaggedVerses({ day, halfHourIdx: hours })
  }

  if((minutes === 40) || forceRunAll) {  // once per hour
    await rerunCalcTagSetsForUntaggedVerses({ day, halfHourIdx: hours + 24 })
  }

  if((hours === 0 && minutes === 0) || forceRunAll) {  // once per day
    await rebuildAllPages()
  }

}

module.exports = {
  handler,
}