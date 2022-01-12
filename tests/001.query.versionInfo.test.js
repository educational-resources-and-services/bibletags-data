const { doQuery } = require('./testUtils')

describe('Query: versionInfo', async () => {

  it('Fetch the ESV', async () => {
    const versionInfo = await doQuery(`
      versionInfo(id: "esv") {
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
    versionInfo.should.eql({
      id: "esv",
      name: "English Standard Version",
      languageId: "eng",
      wordDividerRegex: null,
      partialScope: null,
      versificationModel: "kjv",
      skipsUnlikelyOriginals: true,
      extraVerseMappings: null,
    })
  })

})