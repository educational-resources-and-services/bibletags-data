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

      return models.wordHashesSetSubmission.create(input, {transaction: t})
        .then(wordHashesSetSubmission => {
          wordHashes.forEach(wordHashGroup => {
            wordHashGroup.wordHashesSetSubmissionId = wordHashesSetSubmission.id
          })
          return models.wordHashesSubmission.bulkCreate(wordHashes, {transaction: t})
            .then(() => {

              const newTagSet = {
                verseId,
                tags: [],
                status: 'incomplete',
                wordsHash,
                versionId,
              }

              // TODO: calculate tagSet here

              if(false) {  // if we were able to guess at them all
                newTagSet.status = "unconfirmed"
              }

              return models.tagSet.create(newTagSet, {transaction: t})

            })
        })
        .catch(err => {
          if(err.name === 'SequelizeUniqueConstraintError') {

            // Generally should not get here, but it could with a race condition
            // involving two users.

            const where = {
              verseId,
              versionId,
              wordsHash,
            }

            return models.tagSet.findOne({
              where,
            })
          }
          
          throw err
        })

    }).then(tagSet => ({
      id: `${verseId}-${versionId}-${wordsHash}`,
      tags: tagSet ? tagSet.tags : [],
      status: tagSet ? tagSet.status : 'none',
    }))
  }
}
