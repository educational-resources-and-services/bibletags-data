const { doQuery } = require('./testUtils')

describe('Query: tagSet', async () => {

  it('Attempt fetch of non-existent tagSet', async () => {
    const tagSet = await doQuery(`
      tagSet(id: "01001001-esv-PiUuem78i3msdf") {
        id
        tags
        status
      }
    `)
    tagSet.should.eql({
      id: "01001001-esv-PiUuem78i3msdf",
      tags: [],
      status: "none",
    })
  })

})