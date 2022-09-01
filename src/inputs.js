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
    versionId: ID!
    wordsHash: String!
    embeddingAppId: ID!
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
    versionId: ID!
    wordsHash: String!
    deviceId: ID!
    embeddingAppId: ID!
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
    languageId: ID!
    deviceId: ID!
    embeddingAppId: ID!
    words: [UIWordInput]!
  }

  input UIWordInput {
    uiEnglishWordId: Int!
    translation: String!
  }

  input VersionInput {
    id: ID!
    name: String!
    languageId: ID!
    wordDividerRegex: String
    partialScope: String
    versificationModel: String!
    skipsUnlikelyOriginals: Boolean!
    extraVerseMappingsStr: String!
  }

  input EmbeddingAppInput {
    uri: String!
    appSlug: String!
    appName: String!
    orgName: String!
    contactEmail: String!
  }

`

module.exports = inputs