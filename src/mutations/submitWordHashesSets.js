const calculateTagSets = require('../calculateTagSets')

const submitWordHashesSets = async (args, req, queryInfo) => {

  const { input } = args
  
  const { models } = global.connection

  const embeddingAppIds = [ ...new Set(input.map(({ embeddingAppId }) => embeddingAppId)) ]

  if(embeddingAppIds.length > 1) {
    throw `All entries should have the same embeddingAppId`
  }

  const embeddingApp = await models.embeddingApp.findByPk(embeddingAppIds[0])

  if(!embeddingApp) {
    throw `Invalid embeddingAppId. Please register via bibletags.org.`
  }

  await connection.transaction(async t => {

    await Promise.all(input.map(async set => {
      const { loc, versionId, wordsHash, embeddingAppId, wordHashes } = set

      const existingWordHashesSetSubmission = await models.wordHashesSetSubmission.findOne({
        where: {
          versionId,
          wordsHash,
          loc,
        },
        transaction: t,
      })

      if(!existingWordHashesSetSubmission) {

        const wordHashesSetSubmission = await models.wordHashesSetSubmission.create({ loc, versionId, wordsHash, embeddingAppId }, {transaction: t})

        wordHashes.forEach(wordHashGroup => {
          wordHashGroup.wordHashesSetSubmissionId = wordHashesSetSubmission.id
        })

      }

    }))

    await models.wordHashesSubmission.bulkCreate(
      (
        input
          .map(({ wordHashes }) => wordHashes)
          .filter(({ wordHashesSetSubmissionId }) => wordHashesSetSubmissionId)
          .flat()
      ),
      {
        validate: true,
        transaction: t,
      },
    )

    // calculate tagSets
    await Promise.all(input.map(({ loc, versionId, wordsHash }) => (
      calculateTagSets({
        loc,
        wordsHash,
        versionId,
        t,
      })
    )))

  })

  return true

}

module.exports = submitWordHashesSets