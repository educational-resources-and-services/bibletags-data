const submitWordHashesSet = async (args, req, queryInfo) => {

  const { input } = args
  const { loc, versionId, wordsHash, wordHashes } = input
  delete input.wordHashes

  const { models } = global.connection

  await connection.transaction(t => {

    const wordHashesSetSubmission = await models.wordHashesSetSubmission.create(input, {transaction: t})

    wordHashes.forEach(wordHashGroup => {
      wordHashGroup.wordHashesSetSubmissionId = wordHashesSetSubmission.id
    })

    await models.wordHashesSubmission.bulkCreate(wordHashes, {transaction: t})

    const newTagSet = {
      loc,
      tags: [],
      status: 'incomplete',
      wordsHash,
      versionId,
    }

    // TODO: calculate tagSet here

    if(false) {  // if we were able to guess at them all
      newTagSet.status = "unconfirmed"
    }

    await models.tagSet.create(newTagSet, {transaction: t})

  })

  const where = {
    loc,
    versionId,
    wordsHash,
  }

  const tagSet = await models.tagSet.findOne({
    where,
  })

  return {
    id: `${loc}-${versionId}-${wordsHash}`,
    tags: tagSet ? tagSet.tags : [],
    status: tagSet ? tagSet.status : 'none',
  }
}

module.exports = submitWordHashesSet