const {
  versionIdRegEx,
} = require('../utils')

module.exports = ({ models }) => {

  return (
    queries,
    {
      id,
    },
    { req }
  ) => {

    if(!id.match(versionIdRegEx)) {
      throw(new Error(`Invalid id (${id}).`))
    }

    return models.version.findById(id)

  }
}