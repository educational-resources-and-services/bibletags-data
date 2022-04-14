const { getWordHashes, getWordsHash } = require('@bibletags/bibletags-ui-helper')

const { doMutation } = require('./testUtils')

const submitInitialESVVerse = async ({ verseText, loc }) => {
  
  const params = {
    usfm: `\\v 1\n${verseText}`,
  }

  const wordsHash = getWordsHash(params)
  const wordHashes = JSON.stringify(getWordHashes(params)).replace(/([{,])"([^"]+)"/g, '$1$2')

  const submitWordHashesSet = await doMutation(`
    submitWordHashesSet(input: { loc: "${loc}", versionId: "esv", wordsHash: "${wordsHash}", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", wordHashes: ${wordHashes}}) {
      id
      tags
      status
    }
  `)

  submitWordHashesSet.should.eql({
    id: `${loc}-esv-${wordsHash}`,
    tags: [],
    status: "automatch",
  })

}

describe('Mutation: submitWordHashesSet', async () => {

  it('Genesis 1:1 esv', async () => {

    await submitInitialESVVerse({
      verseText: `In the beginning, God created the heavens and the earth.`,
      loc: `01001001`,
    })

  })

  it('Genesis 1:1 esv (second, unnecessary time)', async () => {

    await submitInitialESVVerse({
      verseText: `In the beginning, God created the heavens and the earth.`,
      loc: `01001001`,
    })

  })

  it('Genesis 1:2 esv', async () => {

    await submitInitialESVVerse({
      verseText: `The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.`,
      loc: `01001002`,
    })

  })

})