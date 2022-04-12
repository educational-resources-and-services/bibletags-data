const { cloneObj } = require('../src/utils')
const { doMutation } = require('./testUtils')

const rawTagSubmissions = [
  {
    origWordsInfo: [
      {
        uhbWordId: "01h7N",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "in",
        wordNumberInVerse: 1,
      },
      {
        word: "the",
        wordNumberInVerse: 2,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01h7N",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "beginning",
        wordNumberInVerse: 3,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01RAp",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "created",
        wordNumberInVerse: 5,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01cuO",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "god",
        wordNumberInVerse: 4,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01vvO",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "the",
        wordNumberInVerse: 6,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01vvO",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "heavens",
        wordNumberInVerse: 7,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01Q4j",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "and",
        wordNumberInVerse: 8,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01VFX",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "the",
        wordNumberInVerse: 9,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01Q4j",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01VFX",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "earth",
        wordNumberInVerse: 10,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01XDl",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [],
    alignmentType: "without-suggestion",
  },
]

describe('Mutation: submitTagSet', async () => {

  it('Genesis 1:1 ESV (resubmit)', async () => {

    const tagSubmissions = JSON.stringify(rawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "7+j841rr4vj8eOvlj8hS", deviceId: "123", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}) {
        id
        tags
        status
      }
    `)

    submitTagSet.should.eql({
      id: "01001001-esv-7+j841rr4vj8eOvlj8hS",
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
    })
  })

  it('Genesis 1:3 ESV (prior to word hashes submit)', async () => {

    global.skipConsoleLogError = true

    const tagSubmissions = JSON.stringify(rawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001003", versionId: "esv", wordsHash: "7+j841rr4vj8eOvlj8hS", deviceId: "123", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}) {
        id
        tags
        status
      }
    `)

    ;(submitTagSet === null).should.eql(true)
    global.skipConsoleLogError = false
    
  })

})