const calculateTagSets = require('../calculateTagSets')
const tagSet = require('../queries/tagSet')
const { getVersionTables } = require('../utils')

const submitWordHashesSet = async (args, req, queryInfo) => {

  const { input, skipGetTagSet } = args
  const { loc, versionId, wordsHash, wordHashes, embeddingAppId } = input
  delete input.wordHashes
  delete input.versionId

  const { models } = global.connection
  const { wordHashesSetSubmissionTable, wordHashesSubmissionTable } = await getVersionTables(versionId)

  const embeddingApp = await models.embeddingApp.findByPk(embeddingAppId)

  if(!embeddingApp) {
    throw `Invalid embeddingAppId. Please register via bibletags.org.`
  }

  const existingWordHashesSetSubmission = await wordHashesSetSubmissionTable.findOne({
    where: {
      wordsHash,
      loc,
    },
  })

  if(!existingWordHashesSetSubmission) {

    await connection.transaction(async t => {

      const wordHashesSetSubmission = await wordHashesSetSubmissionTable.create(input, {transaction: t})

      wordHashes.forEach(wordHashGroup => {
        wordHashGroup[`${versionId}WordHashesSetSubmissionId`] = wordHashesSetSubmission.id
      })

      await wordHashesSubmissionTable.bulkCreate(
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

  if(skipGetTagSet) return

  return tagSet({ id: `${loc}-${versionId}-${wordsHash}` }, req, queryInfo)

}

module.exports = submitWordHashesSet