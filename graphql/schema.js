// chapterId: [2-digit book][3-digit chapter]-[versionCode] (eg. 00101-esv for ESV of Gen 1; versification accords with version)
// verseId: [2-digit book][3-digit chapter][3-digit verse]-[versionCode] (eg. 0010101-esv for ESV of Gen 1:1; versification accords with version)

// For the chapter, version lxxChapter and lxxVerse queries, a verseId (or chapterId) is sent corresponding to a translation version,
// whereas the Verse object(s) which are returned will have ids that correspond to the wlc, lxx or bhp versification. This is because
// I do not expect the widget to know how the original language (and lxx) versifications work.

const schemaTypes = require('./schemaTypes')
const schemaInputs = require('./schemaInputs')

`

scalar JSON
scalar Date

${schemaTypes}

${schemaInputs}

type Query {
  chapter(chapterId: String!): [Verse]
  verse(verseId: String!): [Verse]
  lxxChapter(chapterId: String!): [Verse]
  lxxVerse(verseId: String!): [Verse]
  tagSets(chapterId: String!): [TagSet]
  tagSet(id: ID!): TagSet
  word(id: ID!): Word
  wordByPosition(verseId: String!, wordNum: Int!): Word
  hits(id: ID!): Hits
  translations(id: ID!): Translations
  translationsByPosition(verseId: String!, wordNum: Int!): Translations
  search(query: String!, offset: Int, limit: Int, tagVersions: [String]): SearchResult
}

type Mutation {
  updateUser(id: ID, input: UserInput!): User
}

schema {
  query: Query
  mutation: Mutation
}


`