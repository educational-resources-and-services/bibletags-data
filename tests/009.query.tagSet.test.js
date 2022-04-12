const { doQuery } = require('./testUtils')

describe('Query: tagSet', async () => {

  it('Genesis 1:1', async () => {
    const tagSet = await doQuery(`
      tagSet(id: "01001001-esv-7+j841rr4vj8eOvlj8hS") {
        id
        tags
        status
      }
    `)
    tagSet.should.eql({
      id: "01001001-esv-7+j841rr4vj8eOvlj8hS",
      tags: [],
      status: "automatch",
    })
  })

})