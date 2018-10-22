module.exports = ({ models }) => {

  return (
    queries,
    {
      version,
    },
    { req }
  ) => {

    return models.versionInfo.findById(version).then(versionInfo => versionInfo)

  }
}