const updateWordTranslationsAndLanguageSpecificDefinitions = require('./crons/updateWordTranslationsAndLanguageSpecificDefinitions')

const handler = async ({ forceRunAll }={}) => {

  const day = new Date().getDay()  // 0-6
  const hours = new Date().getHours()  // 0-23
  const minutes = new Date().getMinutes()  // 0-59

  if((minutes === 0) || forceRunAll) {  // once per hour
    await updateWordTranslationsAndLanguageSpecificDefinitions()
  }

  if((hours === 0 && minutes === 0) || forceRunAll) {  // once per day
    // await updateWordTranslationsAndLanguageSpecificDefinitions()
  }

}

module.exports = {
  handler,
}