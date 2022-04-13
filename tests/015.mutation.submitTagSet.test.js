const { cloneObj } = require('../src/utils')
const { doMutation } = require('./testUtils')

const rawTagSubmissions = [
  {
    origWordsInfo: [
      {
        uhbWordId: "01wMy",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "so",
        wordNumberInVerse: 1,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01wMy",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "rose",
        wordNumberInVerse: 3,
      },
      {
        word: "early",
        wordNumberInVerse: 4,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01WbZ",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "Abraham",
        wordNumberInVerse: 2,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01dPb",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "in",
        wordNumberInVerse: 5,
      },
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
        uhbWordId: "01dPb",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "morning",
        wordNumberInVerse: 7,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01biP",
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
        uhbWordId: "01biP",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "took",
        wordNumberInVerse: 9,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01BBX",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "bread",
        wordNumberInVerse: 10,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01rgf",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "and",
        wordNumberInVerse: 11,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [],
    translationWordsInfo: [
      {
        word: "a",
        wordNumberInVerse: 12,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01rgf",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "skin",
        wordNumberInVerse: 13,
      },
      {
        word: "of",
        wordNumberInVerse: 14,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01eWn",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "water",
        wordNumberInVerse: 15,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01tdm",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "and",
        wordNumberInVerse: 16,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01tdm",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "gave",
        wordNumberInVerse: 17,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [],
    translationWordsInfo: [
      {
        word: "it",
        wordNumberInVerse: 18,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01zrk",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "to",
        wordNumberInVerse: 19,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "018x9",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "Hagar",
        wordNumberInVerse: 20,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01PPq",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "putting",
        wordNumberInVerse: 21,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [],
    translationWordsInfo: [
      {
        word: "it",
        wordNumberInVerse: 22,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "015GA",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "on",
        wordNumberInVerse: 23,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01vRq",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "shoulder",
        wordNumberInVerse: 25,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01vRq",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "her",
        wordNumberInVerse: 24,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01f9y",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "along",
        wordNumberInVerse: 26,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01f9y",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "with",
        wordNumberInVerse: 27,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01L84",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "the",
        wordNumberInVerse: 28,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01L84",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "child",
        wordNumberInVerse: 29,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01c61",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "and",
        wordNumberInVerse: 30,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01c61",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "sent",
        wordNumberInVerse: 31,
      },
      {
        word: "away",
        wordNumberInVerse: 33,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01c61",
        wordPartNumber: 3,
      },
    ],
    translationWordsInfo: [
      {
        word: "her",
        wordNumberInVerse: 32,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01ley",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "and",
        wordNumberInVerse: 34,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01ley",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "she",
        wordNumberInVerse: 35,
      },
      {
        word: "departed",
        wordNumberInVerse: 36,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "016We",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "and",
        wordNumberInVerse: 37,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "016We",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "wandered",
        wordNumberInVerse: 38,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01NV5",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "in",
        wordNumberInVerse: 39,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [],
    translationWordsInfo: [
      {
        word: "the",
        wordNumberInVerse: 40,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01NV5",
        wordPartNumber: 2,
      },
    ],
    translationWordsInfo: [
      {
        word: "wilderness",
        wordNumberInVerse: 41,
      },
      {
        word: "of",
        wordNumberInVerse: 42,
      },
    ],
    alignmentType: "without-suggestion",
  },
  {
    origWordsInfo: [
      {
        uhbWordId: "01fFu",
        wordPartNumber: 1,
      },
    ],
    translationWordsInfo: [
      {
        word: "Beersheba",
        wordNumberInVerse: 43,
      },
    ],
    alignmentType: "without-suggestion",
  },
]

describe('Mutation: submitTagSet', async () => {

  it('Genesis 21:14 ESV', async () => {

    const tagSubmissions = JSON.stringify(rawTagSubmissions).replace(/([{,])"([^"]+)"/g, '$1$2')

    const submitTagSet = await doMutation(`
      submitTagSet(input: { loc: "01021014", versionId: "esv", wordsHash: "4uya/NKzE7j8x8vlpQ26vlDMN8i/lGvlD1DRAbaABtDR7SpDegZsI6j8G3vleJpD77wznruwvlk5E7j8BKi/Jb", deviceId: "111", embeddingAppId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", tagSubmissions: ${tagSubmissions}}) {
        id
        tags
        status
      }
    `)

    submitTagSet.should.eql({
      id: "01021014-esv-4uya/NKzE7j8x8vlpQ26vlDMN8i/lGvlD1DRAbaABtDR7SpDegZsI6j8G3vleJpD77wznruwvlk5E7j8BKi/Jb",
      tags: [
        {"o":["01wMy|1"],"t":[1]},
        {"o":["01WbZ|1"],"t":[2]},
        {"o":["01wMy|2"],"t":[3,4]},
        {"o":["01dPb|1"],"t":[5,6]},
        {"o":["01dPb|2"],"t":[7]},
        {"o":["01biP|1"],"t":[8]},
        {"o":["01biP|2"],"t":[9]},
        {"o":["01BBX|1"],"t":[10]},
        {"o":["01rgf|1"],"t":[11]},
        {"o":[],"t":[12]},
        {"o":["01rgf|2"],"t":[13,14]},
        {"o":["01eWn|1"],"t":[15]},
        {"o":["01tdm|1"],"t":[16]},
        {"o":["01tdm|2"],"t":[17]},
        {"o":[],"t":[18]},
        {"o":["01zrk|1"],"t":[19]},
        {"o":["018x9|1"],"t":[20]},
        {"o":["01PPq|1"],"t":[21]},
        {"o":[],"t":[22]},
        {"o":["015GA|1"],"t":[23]},
        {"o":["01vRq|2"],"t":[24]},
        {"o":["01vRq|1"],"t":[25]},
        {"o":["01f9y|1"],"t":[26]},
        {"o":["01f9y|2"],"t":[27]},
        {"o":["01L84|1"],"t":[28]},
        {"o":["01L84|2"],"t":[29]},
        {"o":["01c61|1"],"t":[30]},
        {"o":["01c61|2"],"t":[31,33]},
        {"o":["01c61|3"],"t":[32]},
        {"o":["01ley|1"],"t":[34]},
        {"o":["01ley|2"],"t":[35,36]},
        {"o":["016We|1"],"t":[37]},
        {"o":["016We|2"],"t":[38]},
        {"o":["01NV5|1"],"t":[39]},
        {"o":[],"t":[40]},
        {"o":["01NV5|2"],"t":[41,42]},
        {"o":["01fFu|1"],"t":[43]},
      ],
      status: "unconfirmed",
    })
  })

})