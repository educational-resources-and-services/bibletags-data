const {
  languageIdRegEx,
} = require('../utils')

module.exports = ({ connection, models }) => {

  return (
    queries,
    {
      input,
    },
    { req }
  ) => {

    const { words, languageId } = input
    delete input.words

    if(!languageId.match(languageIdRegEx)) {
      throw(new Error(`Invalid languageId (${languageId}).`))
    }

    return connection.transaction(t => {
      return models.uiWordSubmissions.bulkCreate(words.map(word => ({
        ...input,
        ...word,
      })), {transaction: t})
        // .then()  Recalculate uiWords here
    }).then(() => {

      const where = {
        languageId,
      }

      return models.uiWord.find({
        where,
      })
    })
  }
}
