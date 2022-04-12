const {
  languageIdRegEx,
} = require('../constants')

const submitUIWords = async (args, req, queryInfo) => {

  const { input } = args
  const { words, languageId } = input
  delete input.words

  if(!languageId.match(languageIdRegEx)) {
    throw `Invalid languageId (${languageId}).`
  }

  await connection.transaction(t => {

    await models.uiWordSubmissions.bulkCreate(
      words.map(word => ({
        ...input,
        ...word,
      })),
      {
        validate: true,
        transaction: t,
      },
    )
    // Recalculate uiWords here

  })

  const where = {
    languageId,
  }

  const uiWord = await models.uiWord.find({
    where,
  })

  return uiWord

}

module.exports = submitUIWords