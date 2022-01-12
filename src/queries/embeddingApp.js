const embeddingApp = async (args, req, queryInfo) => {

  const { uri } = args

  const { models } = global.connection

  const where = {
    uri,
  }

  let embeddingApp = await models.embeddingApp.findOne({
    where,
  })

  if(!embeddingApp) {
    embeddingApp = await models.embeddingApp.create({
      uri,
    })
  }

  return embeddingApp

}

module.exports = embeddingApp