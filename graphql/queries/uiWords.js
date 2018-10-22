module.exports = ({ models }) => {

  return (
    queries,
    {
      language,
    },
    { req }
  ) => {

    const where = {
      language,
    }

    return models.uiWord.find({
      where,
    }).then(uiWords => uiWords)

  }
}