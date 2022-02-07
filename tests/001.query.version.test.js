const { doQuery } = require('./testUtils')

describe('Query: version', async () => {

  it('Fetch the ESV', async () => {
    const version = await doQuery(`
      version(id: "esv") {
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
    version.should.eql({
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
    })
  })

})