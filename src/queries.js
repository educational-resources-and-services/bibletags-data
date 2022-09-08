const queries = `

  version(id: ID!): Version
  versions: [Version]
  versionIdsWithIncompleteTagSets(versionIds: [ID]!): [ID]
  chapter(bookId: Int!, chapter: Int!, versionId: ID!): [Verse]
  verse(id: ID!): Verse

  embeddingApps: [EmbeddingApp]
  uiWords(languageId: ID!): [UIWord]

  tagSets(bookId: Int!, chapter: Int!, verse: Int, versionId: ID!): [TagSet]
  tagSetsByIds(ids: [ID]!): [TagSet]
  tagSet(id: ID!): TagSet
  translationBreakdown(id: ID!): TranslationBreakdown
  definition(id: ID!): Definition

  ${/*
    THESE TWO WERE DESIGNED SO THAT THE WIDGET WOULD ONLY REQUIRE A SINGLE REQUEST ROUNDTRIP. NOT YET SURE IF THEY ARE REALLY HELPFUL OR NOT.
    translationBreakdownByPosition(versionId: String!, loc: String!, wordNum: Int!, languageId: String!): Translationsreakdown
    definitionsByPosition(versionId: ID!, loc: String!, wordNum: Int!, languageId: ID!): [Definition]
  */ ""}

  updatedTagSets(versionId: ID!, updatedFrom: Milliseconds!): TagSetUpdate
  updatedTranslationBreakdowns(versionId: ID!, updatedFrom: Milliseconds!): TranslationBreakdownUpdate
  updatedLanguageSpecificDefinitions(languageId: ID!, updatedFrom: Milliseconds!): LanguageSpecificDefinitionUpdate

  ${/* The following have offline equivelants in the apps. */ ""}
  autoCompleteSuggestions(incompleteQuery: String!, languageId: ID!): [AutoCompleteSuggestion]  ${/* note: isn't as exhaustive in offline version */ ""}
  bibleSearchResults(query: String!, hebrewOrdering: Boolean!, offset: Int!, limit: Int!): BibleSearchResultSet

`

module.exports = queries