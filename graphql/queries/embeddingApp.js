const {
  versionIdRegEx,
} = require('../utils')

module.exports = ({ models }) => {

  return (
    queries,
    {
      uri,
    },
    { req }
  ) => {

    const where = {
      uri,
    }

    return models.embeddingApp.findOne({
      where
    }).then(embeddingApp => {
      if(embeddingApp) return embeddingApp

      return models.embeddingApp.create({
        uri
      })

    })

  }
}