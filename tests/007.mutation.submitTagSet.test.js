const { doMutation } = require('./testUtils')

describe('Mutation: submitTagSet', async () => {

  it('Basic call', async () => {

    const tagSubmissions = JSON.stringify([
      {
        origWordsInfo: [
          {
            uhbWordId: "01h7N",
            wordPartNumber: 1,
          },
        ],
        translationWordsInfo: [
          {
            word: "In",
            wordNumberInVerse: 1,
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
            word: "the",
            wordNumberInVerse: 2,
          },
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
    ]).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01001001", versionId: "esv", wordsHash: "aA1", deviceId: "123", embeddingAppId: 1, tagSubmissions: ${tagSubmissions}}) {
        id
        tags
        status
      }
    `)

    if(submitTagSet !== null) throw `wrong return value: ${submitTagSet}`
    // submitTagSet.should.eql({
    //   id: "01001001-esv-???",
    //   tags: [
    //     {o:["01h7N|1"],t:[1]},
    //     {o:["01h7N|2"],t:[3]},
    //     {o:["01RAp"],t:[5]},
    //   ],
    //   status: "unconfirmed",
    // })
  })

})