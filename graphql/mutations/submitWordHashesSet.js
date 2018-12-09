module.exports = ({ connection, models }) => {

  return (
    queries,
    {
      input,
    },
    { req }
  ) => {

    const { verseId, versionId, wordsHash, wordHashes } = input
    delete input.wordHashes

    return connection.transaction(t => {
      return models.wordHashesSetSubmission.create(input, {transaction: t}).then(wordHashesSetSubmission => {
        wordHashes.forEach(wordHashGroup => {
          wordHashGroup.wordHashesSetSubmissionId = wordHashesSetSubmission.id
        })
        return models.wordHashesSubmission.bulkCreate(wordHashes, {transaction: t})
          // .then()  Recalculate tagSets here
      })
    }).then(() => {

      const where = {
        verseId,
        versionId,
        wordsHash,
      }

      return models.tagSet.findOne({
        where,
      })
    })
  }
}
