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

`