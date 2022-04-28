const embeddingApp = async (args, req, queryInfo) => {

  return null

  // TODO: This should be changed to embeddingApps, and only be retrievable by an admin; it will also need pagation.

  // const { uri } = args

  // const { models } = global.connection

  // const where = {
  //   uri,
  // }

  // let embeddingApp = await models.embeddingApp.findOne({
  //   where,
  // })

  // if(!embeddingApp) {
  //   embeddingApp = await models.embeddingApp.create({
  //     uri,
  //   })
  // }

  // return embeddingApp

}

module.exports = embeddingApp