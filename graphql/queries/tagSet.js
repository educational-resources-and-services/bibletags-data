module.exports = ({ models }) => {

  return (
    queries,
    {
      id,
    },
    { req }
  ) => {

    return models.tagSet.findById(id).then(tagSet => tagSet)

  }
}