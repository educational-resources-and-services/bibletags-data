const queries = `

  chapter(bookId: Int!, chapter: Int!, versionId: String!): [Verse]
  verse(id: ID!): Verse
  tagSets(bookId: Int!, chapter: Int!, verse: Int, versionId: String!): [TagSet]
  tagSet(id: ID!): TagSet
  definition(id: ID!): Definition
  definitionsByPosition(versionId: String!, loc: String!, wordNum: Int!, languageId: String!): [Definition]
  hits(id: ID!): Hits
  translations(id: ID!): Translations
  translationsByPosition(versionId: String!, loc: String!, wordNum: Int!, languageId: String!): [Translations]
  search(query: String!, offset: Int, limit: Int, tagVersionIds: [String]): SearchResult
  versionInfo(id: ID!): VersionInfo
  embeddingApp(uri: String!): EmbeddingApp
  uiWords(languageId: String!): [UIWord]

`

module.exports = queries