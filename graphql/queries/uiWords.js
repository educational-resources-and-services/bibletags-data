const {
  languageIdRegEx,
} = require('../utils')

module.exports = ({ models }) => {

  return (
    queries,
    {
      languageId,
    },
    { req }
  ) => {

    if(!languageId.match(languageIdRegEx)) {
      throw(new Error(`Invalid languageId (${languageId}).`))
    }

    const where = {
      languageId,
    }

    return models.uiWord.find({
      where,
    })

  }
}