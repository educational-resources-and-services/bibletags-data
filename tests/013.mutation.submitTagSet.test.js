const { doMutation } = require('./testUtils')
const { cloneObj, equalObjs } = require('../src/utils')
const rawTagSubmissions = require('./gen.1.1.rawTagSubmissions')

describe('Mutation: submitTagSet', async () => {

  it('Genesis 1:1 ESV (resubmit bad tagging)', async () => {

    const badRawTagSubmissions = cloneObj(rawTagSubmissions)
    badRawTagSubmissions[0].translationWordsInfo.push(badRawTagSubmissions[1].translationWordsInfo[0])
    badRawTagSubmissions.splice(1,1)
    const tagSubmissions = JSON.stringify(badRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "111", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedSince: ${Date.now()}) {
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
        {o:["01h7N|1"],t:[1,2]},
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

  it('Genesis 1:3 ESV (prior to word hashes submit)', async () => {

    global.skipConsoleLogError = true

    const tagSubmissions = JSON.stringify(rawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001003", versionId: "esv", wordsHash: "Sfgh", deviceId: "111", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedSince: ${Date.now()}) {
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

})