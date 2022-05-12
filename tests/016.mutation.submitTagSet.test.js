const { cloneObj, equalObjs } = require('../src/utils')
const { doMutation } = require('./testUtils')
const rawTagSubmissions = require('./gen.1.1.rawTagSubmissions')

const correctTags = [
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
]

describe('Mutation: submitTagSet', async () => {

  it('Genesis 1:1 ESV (second person, bad criss-crossed tagging)', async () => {

    const badRawTagSubmissions = cloneObj(rawTagSubmissions)
    badRawTagSubmissions[2].translationWordsInfo.push(badRawTagSubmissions[1].translationWordsInfo[0])
    badRawTagSubmissions.splice(1,1)
    badRawTagSubmissions.forEach((tag, idx) => {
      tag.alignmentType = [1].includes(idx) ? `correction` : `affirmation`
    })
    const tagSubmissions = JSON.stringify(badRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "222", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
        tagSets {
          id
          tags
          status
        }
        hasMore
        newUpdatedFrom
      }
    `)

    ;(submitTagSet.tagSets.length === 0).should.eql(true)

  })

  it('Genesis 1:1 ESV (resubmit good tagging)', async () => {

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
      tags: correctTags,
      status: "unconfirmed",
    }

    ;(submitTagSet.tagSets.some(tagSet => equalObjs(tagSet, oneNewTagSet))).should.eql(true)

  })

  it('Genesis 1:1 ESV (second person, good tagging)', async () => {

    const adjustedRawTagSubmissions = cloneObj(rawTagSubmissions)
    adjustedRawTagSubmissions.forEach(tag => {
      tag.alignmentType = `affirmation`
    })
    const tagSubmissions = JSON.stringify(adjustedRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "222", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
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
      tags: correctTags,
      status: "confirmed",
    }

    ;(submitTagSet.tagSets.some(tagSet => equalObjs(tagSet, oneNewTagSet))).should.eql(true)

  })

  it('Genesis 1:1 ESV (third person, bad tagging in two spots)', async () => {

    const badRawTagSubmissions = cloneObj(rawTagSubmissions)
    badRawTagSubmissions[0].translationWordsInfo.push(badRawTagSubmissions[1].translationWordsInfo[0])
    badRawTagSubmissions.splice(1,1)
    badRawTagSubmissions[7].origWordsInfo.push(badRawTagSubmissions[8].origWordsInfo[0])
    badRawTagSubmissions.splice(8,1)
    badRawTagSubmissions.forEach((tag, idx) => {
      tag.alignmentType = [0,7].includes(idx) ? `correction` : `affirmation`
    })
    const tagSubmissions = JSON.stringify(badRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "333", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
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
      tags: correctTags,
      status: "unconfirmed",
    }

    ;(submitTagSet.tagSets.some(tagSet => equalObjs(tagSet, oneNewTagSet))).should.eql(true)

  })

  it('Genesis 1:1 ESV (fourth person, bad tagging in spot 1)', async () => {

    const badRawTagSubmissions = cloneObj(rawTagSubmissions)
    badRawTagSubmissions[0].translationWordsInfo.push(badRawTagSubmissions[1].translationWordsInfo[0])
    badRawTagSubmissions.splice(1,1)
    badRawTagSubmissions.forEach((tag, idx) => {
      tag.alignmentType = [0].includes(idx) ? `correction` : `affirmation`
    })
    const tagSubmissions = JSON.stringify(badRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "444", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
        tagSets {
          id
          tags
          status
        }
        hasMore
        newUpdatedFrom
      }
    `)

    ;(submitTagSet.tagSets.length === 0).should.eql(true)

  })

  it('Genesis 1:1 ESV (fifth person, bad tagging in spot 1)', async () => {

    const badRawTagSubmissions = cloneObj(rawTagSubmissions)
    badRawTagSubmissions[0].translationWordsInfo.push(badRawTagSubmissions[1].translationWordsInfo[0])
    badRawTagSubmissions.splice(1,1)
    badRawTagSubmissions.forEach((tag, idx) => {
      tag.alignmentType = [0].includes(idx) ? `correction` : `affirmation`
    })
    const tagSubmissions = JSON.stringify(badRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "555", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
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

  it('Genesis 1:1 ESV (fifth person, resubmit good tagging)', async () => {

    const adjustedRawTagSubmissions = cloneObj(rawTagSubmissions)
    adjustedRawTagSubmissions.forEach((tag, idx) => {
      tag.alignmentType = [0,1].includes(idx) ? `correction` : `affirmation`
    })
    const tagSubmissions = JSON.stringify(adjustedRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "555", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
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
      tags: correctTags,
      status: "unconfirmed",
    }

    ;(submitTagSet.tagSets.some(tagSet => equalObjs(tagSet, oneNewTagSet))).should.eql(true)

  })

  it('Genesis 1:1 ESV (sixth person, bad tagging in spot 2)', async () => {

    const badRawTagSubmissions = cloneObj(rawTagSubmissions)
    badRawTagSubmissions[8].origWordsInfo.push(badRawTagSubmissions[9].origWordsInfo[0])
    badRawTagSubmissions.splice(9,1)
    badRawTagSubmissions.forEach((tag, idx) => {
      tag.alignmentType = [0,1,7].includes(idx) ? `correction` : `affirmation`
    })
    const tagSubmissions = JSON.stringify(badRawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "Sfgh", deviceId: "666", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}, updatedFrom: ${Date.now()}) {
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
      tags: correctTags,
      status: "confirmed",
    }

    ;(submitTagSet.tagSets.some(tagSet => equalObjs(tagSet, oneNewTagSet))).should.eql(true)

  })

})