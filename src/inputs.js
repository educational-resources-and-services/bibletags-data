const inputs = `

  input RequestLoginTokenInput {
    email: String!
    captchaValue: String!
  }

  input LogInInput {
    token: String!
  }

  input WordHashesSetInput {
    loc: String!
    versionId: String!
    wordsHash: String!
    embeddingAppId: String!
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
    loc: String!
    versionId: String!
    wordsHash: String!
    deviceId: String!
    embeddingAppId: String!
    tagSubmissions: [TagInput]!
  }

  input TagInput {
    origWordsInfo: [OrigWordsInfo]!
    translationWordsInfo: [TranslationWordsInfo]!
    alignmentType: String!  ${/* ENUM: affirmation, correction, without-suggestion */ ""}
  }

  input OrigWordsInfo {
    uhbWordId: ID
    ugntWordId: ID
    wordPartNumber: Int
  }

  input TranslationWordsInfo {
    word: String!
    wordNumberInVerse: Int!
  }

  input UIWordsInput {
    languageId: String!
    deviceId: String!
    embeddingAppId: String!
    words: [UIWordInput]!
  }

  input UIWordInput {
    uiEnglishWordId: Int!
    translation: String!
  }

`

module.exports = inputs