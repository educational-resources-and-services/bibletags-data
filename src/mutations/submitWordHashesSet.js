const calculateTagSets = require('../calculateTagSets')
const tagSet = require('../queries/tagSet')

const submitWordHashesSet = async (args, req, queryInfo) => {

  const { input } = args
  const { loc, versionId, wordsHash, wordHashes, embeddingAppId } = input
  delete input.wordHashes

  const { models } = global.connection

  const embeddingApp = await models.embeddingApp.findByPk(embeddingAppId)

  if(!embeddingApp) {
    throw `Invalid embeddingAppId. Please register via bibletags.org.`
  }

  const existingWordHashesSetSubmission = await models.wordHashesSetSubmission.findOne({
    where: {
      versionId,
      wordsHash,
      loc,
    },
  })

  if(!existingWordHashesSetSubmission) {

    await connection.transaction(async t => {

      const wordHashesSetSubmission = await models.wordHashesSetSubmission.create(input, {transaction: t})

      wordHashes.forEach(wordHashGroup => {
        wordHashGroup.wordHashesSetSubmissionId = wordHashesSetSubmission.id
      })

      await models.wordHashesSubmission.bulkCreate(
        wordHashes,
        {
          validate: true,
          transaction: t,
        },
      )

      // calculate tagSet
      await calculateTagSets({
        loc,
        wordsHash,
        versionId,
        t,
      })

    })

  }

  return tagSet({ id: `${loc}-${versionId}-${wordsHash}` }, req, queryInfo)

}

module.exports = submitWordHashesSet