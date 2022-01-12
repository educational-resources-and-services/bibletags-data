const {
  versionIdRegEx,
} = require('../constants')

const versionInfo = async (args, req, queryInfo) => {

  const { id } = args

  if(!id.match(versionIdRegEx)) {
    throw `Invalid id (${id}).`
  }

  const { models } = global.connection

  const version = await models.version.findByPk(id)

  return version

}

module.exports = versionInfo