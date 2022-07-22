const versions = async (args, req, queryInfo) => {

  const { models } = global.connection

  const versions = await models.version.findAll()

  return versions

}

module.exports = versions