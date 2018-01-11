module.exports = ({ models }) => {

  return (
    queries,
    {
      bookId,
      chapter,
      version,
    },
    { req }
  ) => {
    return [{
      id: 'test id',
      usfm: 'usfm stuff here',    
    }]
  }

}