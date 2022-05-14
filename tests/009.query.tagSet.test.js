const { doQuery } = require('./testUtils')

describe('Query: tagSet', async () => {

  it('Genesis 1:1', async () => {
    const tagSet = await doQuery(`
      tagSet(id: "01001001-esv-Sfgh") {
        id
        tags
        status
      }
    `)
    tagSet.should.eql({
      id: "01001001-esv-Sfgh",
      tags: [],
      status: "none",
    })
  })

})