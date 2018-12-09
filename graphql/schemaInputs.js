/*
  eg.
  
  input UserInput {
    email: String
    firstname: String
    lastname: String
    gender: String
    languageId: String
    onVacationUntil: Date
    adminLevel: String
  }
  
*/

module.exports = `

  input WordHashesSetInput {
    verseId: String!
    versionId: String!
    wordsHash: String!
    embeddingAppId: Int!
    wordHashes: [WordHashesInput]!
  }

  input WordHashesInput {
    wordNumberInVerse: Int!
    hash: String!
    withBeforeHash: String!
    withAfterHash: String!
    withBeforeAndAfterHash: String!
  }

  input TagSetInput {
    verseId: String!
    versionId: String!
    wordsHash: String!
    userId: Int!
    embeddingAppId: Int!
    tagSubmissions: [TagInput]!
  }

  input TagInput {
    translationWordNumberInVerse: Int!
    translationWord: String!
    ugntWordId: String!
  }

  input UIWordsInput {
    languageId: String!
    userId: Int!
    embeddingAppId: Int!
    words: [UIWordInput]!
  }

  input UIWordInput {
    uiEnglishWordId: Int!
    translation: String!
  }

`