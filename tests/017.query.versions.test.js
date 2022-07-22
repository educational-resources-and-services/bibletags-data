const { doQuery } = require('./testUtils')

describe('Query: versions', async () => {

  it('Fetch all versions', async () => {
    const versions = await doQuery(`
      versions {
        id
        name
        languageId
        wordDividerRegex
        partialScope
        versificationModel
        skipsUnlikelyOriginals
        extraVerseMappings
      }
    `)

    versions.should.eql([{
      id: "esv",
      name: "English Standard Version",
      languageId: "eng",
      wordDividerRegex: null,
      partialScope: null,
      versificationModel: "kjv",
      skipsUnlikelyOriginals: true,
      extraVerseMappings: {
        "64001014": "64001014",
        "64001015": "64001015",
      },
    }])
  })

})