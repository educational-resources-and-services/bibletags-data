module.exports = ({ connection, models }) => {

  return (
    queries,
    {
      input,
    },
    { req }
  ) => {

    const { wordHashes } = input
    delete input.wordHashes

    return connection.transaction(t => {
      return models.wordHashesSetSubmission.create(input, {transaction: t}).then(wordHashesSetSubmission => {
        wordHashes.forEach(wordHashGroup => {
          wordHashGroup.wordHashesSetSubmissionId = wordHashesSetSubmission.id
        })
        return models.wordHashesSubmission.bulkCreate(wordHashes, {transaction: t})
      })
    }).then(() => true)
  }
}
