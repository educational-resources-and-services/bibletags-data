const versions = async (args, req, queryInfo) => {

  const { models } = global.connection

  const versions = await models.version.findAll({
    order: [ `name` ],
  })

  return versions

}

module.exports = versions