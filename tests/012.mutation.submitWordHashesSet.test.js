const { getWordHashes, getWordsHash } = require('@bibletags/bibletags-ui-helper')

const { doMutation } = require('./testUtils')

describe('Mutation: submitWordHashesSet', async () => {

  it('Genesis 21:14 esv', async () => {

    const params = {
      usfm: `\\v 1\nSo Abraham rose early in the morning and took bread and a skin of water and gave it to Hagar, putting it on her shoulder, along with the child, and sent her away. And she departed and wandered in the wilderness of Beersheba.`,
    }

    const wordsHash = getWordsHash(params)
    const wordHashes = JSON.stringify(getWordHashes(params)).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitWordHashesSet = await doMutation(`
      submitWordHashesSet(input: { loc: "01021014", versionId: "esv", wordsHash: "${wordsHash}", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", wordHashes: ${wordHashes}}) {
        id
        tags
        status
      }
    `)

    submitWordHashesSet.should.eql({
      id: `01021014-esv-${wordsHash}`,
      tags: [
        {o:["01NV5|1"],t:[5]},  // בְּ⁠מִדְבַּ֖ר
        {o:["01wMy|1"],t:[8]},  // וַ⁠יַּשְׁכֵּ֣ם
      ],
      status: "automatch",
    })

  })

})