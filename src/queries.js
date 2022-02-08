const queries = `

  version(id: ID!): Version
  chapter(bookId: Int!, chapter: Int!, versionId: String!): [Verse]
  verse(id: ID!): Verse
  hits(id: ID!): Hits

  embeddingApp(uri: String!): EmbeddingApp
  uiWords(languageId: String!): [UIWord]

  tagSets(bookId: Int!, chapter: Int!, verse: Int, versionId: String!): [TagSet]
  tagSet(id: ID!): TagSet
  translations(id: ID!): Translations
  translationsByPosition(versionId: String!, loc: String!, wordNum: Int!, languageId: String!): [Translations]
  definition(id: ID!): Definition
  definitionsByPosition(versionId: String!, loc: String!, wordNum: Int!, languageId: String!): [Definition]

  ${/*
  autoCompleteSuggestions(incompleteQuery: String!, languageIds: [ID]!, projectId: ID): [AutoCompleteSuggestion]  ${/* note: isn't as exhaustive in offline version * / ""}
  */ ""}
  bibleSearchResults(query: String!, hebrewOrdering: Boolean!, offset: Int!, limit: Int!): BibleSearchResultSet

`

module.exports = queries