const { doQuery } = require('./testUtils')

describe('Query: versionIdsWithIncompleteTagSets', async () => {

  it('Query kjv, esv', async () => {
    const versionIdsWithIncompleteTagSets = await doQuery(`
      versionIdsWithIncompleteTagSets(versionIds: ["kjv","esv"])
    `)

    versionIdsWithIncompleteTagSets.should.eql(["esv"])
  })

})