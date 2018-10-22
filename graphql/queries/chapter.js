module.exports = ({ models }) => {

  return (
    queries,
    {
      bookId,
      chapter,
      versionId,
    },
    { req }
  ) => {
    return [{
      id: 'test id',
      usfm: 'usfm stuff here',    
    }]
  }

}