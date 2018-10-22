module.exports = ({ models }) => {

  return (
    queries,
    {
      id,
    },
    { req }
  ) => {

    return models.versionInfo.findById(id).then(versionInfo => versionInfo)

  }
}