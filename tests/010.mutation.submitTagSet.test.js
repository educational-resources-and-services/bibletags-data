const { cloneObj, equalObjs } = require('../src/utils')
const { doMutation } = require('./testUtils')
const rawTagSubmissions = require('./gen.1.1.rawTagSubmissions')

describe('Mutation: submitTagSet', async () => {

  it('Genesis 1:1 ESV (missing orig word)', async () => {

    global.skipConsoleLogError = true

    const badRawTagSubmissions = cloneObj(rawTagSubmissions)
    badRawTagSubmissions[0].origWordsInfo = []
    const tagSubmissions = JSON.stringify(badRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "111", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
        tagSets {
          id
          tags
          status
        }
        hasMore
        newUpdatedFrom
      }
    `)

    ;(submitTagSet === null).should.eql(true)
    global.skipConsoleLogError = false

  })

  it('Genesis 1:1 ESV (extra orig word)', async () => {

    global.skipConsoleLogError = true

    const badRawTagSubmissions = cloneObj(rawTagSubmissions)
    badRawTagSubmissions[0].origWordsInfo.push({
      uhbWordId: "01SU2",
      wordPartNumber: 1,
    })
    const tagSubmissions = JSON.stringify(badRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "111", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
        tagSets {
          id
          tags
          status
        }
        hasMore
        newUpdatedFrom
      }
    `)

    ;(submitTagSet === null).should.eql(true)
    global.skipConsoleLogError = false

  })

  it('Genesis 1:1 ESV (duplicate orig word)', async () => {

    global.skipConsoleLogError = true

    const badRawTagSubmissions = cloneObj(rawTagSubmissions)
    badRawTagSubmissions[0].origWordsInfo.push({
      uhbWordId: "01VFX",
      wordPartNumber: 2,
    })
    const tagSubmissions = JSON.stringify(badRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "111", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
        tagSets {
          id
          tags
          status
        }
        hasMore
        newUpdatedFrom
      }
    `)

    ;(submitTagSet === null).should.eql(true)
    global.skipConsoleLogError = false

  })

  it('Genesis 1:1 ESV (missing translation word)', async () => {

    global.skipConsoleLogError = true

    const badRawTagSubmissions = cloneObj(rawTagSubmissions)
    badRawTagSubmissions[0].translationWordsInfo = []
    const tagSubmissions = JSON.stringify(badRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "111", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
        tagSets {
          id
          tags
          status
        }
        hasMore
        newUpdatedFrom
      }
    `)

    ;(submitTagSet === null).should.eql(true)
    global.skipConsoleLogError = false

  })

  it('Genesis 1:1 ESV (extra translation word)', async () => {

    global.skipConsoleLogError = true

    const badRawTagSubmissions = cloneObj(rawTagSubmissions)
    badRawTagSubmissions[0].translationWordsInfo.push({
      word: "yeah",
      wordNumberInVerse: 11,
    })
    const tagSubmissions = JSON.stringify(badRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "111", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
        tagSets {
          id
          tags
          status
        }
        hasMore
        newUpdatedFrom
      }
    `)

    ;(submitTagSet === null).should.eql(true)
    global.skipConsoleLogError = false

  })

  it('Genesis 1:1 ESV (duplicate translation word)', async () => {

    global.skipConsoleLogError = true

    const badRawTagSubmissions = cloneObj(rawTagSubmissions)
    badRawTagSubmissions[0].translationWordsInfo.push({
      word: "the",
      wordNumberInVerse: 9,
    })
    const tagSubmissions = JSON.stringify(badRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "111", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
        tagSets {
          id
          tags
          status
        }
        hasMore
        newUpdatedFrom
      }
    `)

    ;(submitTagSet === null).should.eql(true)
    global.skipConsoleLogError = false

  })

  it('Genesis 1:1 ESV', async () => {

    const tagSubmissions = JSON.stringify(rawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "111", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
        tagSets {
          id
          tags
          status
        }
        hasMore
        newUpdatedFrom
      }
    `)

    const oneNewTagSet = {
      id: "01001001-esv-Sfgh",
      tags: [
        {o:["01h7N|1"],t:[1]},
        {o:[],t:[2]},
        {o:["01h7N|2"],t:[3]},
        {o:["01cuO|1"],t:[4]},
        {o:["01RAp|1"],t:[5]},
        {o:["01vvO|1"],t:[6]},
        {o:["01vvO|2"],t:[7]},
        {o:["01Q4j|1"],t:[8]},
        {o:["01VFX|1"],t:[9]},
        {o:["01VFX|2"],t:[10]},
        {o:["01Q4j|2"],t:[]},
        {o:["01XDl|1"],t:[]},
      ],
      status: "unconfirmed",
    }

    ;(submitTagSet.tagSets.some(tagSet => equalObjs(tagSet, oneNewTagSet))).should.eql(true)

  })

})