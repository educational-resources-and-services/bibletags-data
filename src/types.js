// Verse:id = [2-digit book][3-digit chapter][3-digit verse]-[original language or lxx versionId] (eg. 01001001-uhb for Gen 1:1)
// Verse:usfm - every word MUST be in a /w enclosure
// TagSet:id = [2-digit book][3-digit chapter][3-digit verse]-[versionId]-[wordsHash] (eg. 01001001-esv-PiUuem78i3msdf)
// TagSet:tags = an array of the original language word ids (followed by |[word part number], if multi-part) and translation word numbers
  // eg. Gen 1:1's for the esv would be [{o:["01xeN|1"],t:[1]},{o:["01xeN|2"],t:[3]},{o:["01Nvk"],t:[5]},...]
  //     wherein "בראשית" is tagged to "In" and "beginning", and "ברא" is tagged to "created"
// TagSet:status = none/automatch/unconfirmed/confirmed
// Definition:id = [extended strongs number]-[languageId] (eg. H234a-eng, G8289-esp; languageId is needed for the gloss)
// Definition:pos = an array of parts of speech abbreviations (N, V, etc) that this lexeme is found in
// Definition:syn and Definition:rel = arrays of synonym/related word objects (eg. [{"lex":"τέκνον","strongs":"G5043","hits":99,"gloss":"child"},...])
// Definition:lxx = an object with info on the lxx translation of this word (eg. [{"w":"ἀρχῇ","lex":"ἀρχή","strongs":"G746","hits":236,"ugntHits":55}]); only relevant for Hebrew
// DO NOT DO hits query - instead, just do a search without any results
// TranslationBreakdown:id = [extended strongs number]-[versionId] (eg. H8873-esv for the different translations of the word in the esv)
// TranslationBreakdown:breakdown = an array with info on translation hits (eg. [ [``, [ { tr: "well", hits: 12, forms: [ "באר" ] } ]], [`באר שבע`, [ ... ]] ])
// LexEntry:id = [extended strongs number]-[languageId] (eg. H234a-eng, G8289-esp)
// SearchResult:hitsPerBook (eg. {"43":22,"44":3} would indicate 22 hits in John and 3 in Acts)

const languageSpecificDefinition = `
  gloss: String
  syn: JSON
  rel: JSON
  lexEntry: String
  editorId: ID
`

const types = `

  type Verse {
    id: ID
    usfm: String
  }

  type Language {
    id: ID
    name: String
    englishName: String
    definitionPreferencesForVerbs: JSON
    standardWordDivider: String
  }

  type TagSet {
    id: ID
    tags: JSON
    status: String
  }

  type TranslationBreakdown {
    id: ID
    breakdown: JSON
  }

  type Definition {
    id: ID
    lex: String
    nakedLex: String
    lexUnique: Boolean
    vocal: String
    simplifiedVocal: String
    hits: Int
    lxx: JSON
    lemmas: JSON
    forms: JSON
    pos: [String]
    ${languageSpecificDefinition}
  }

  type LanguageSpecificDefinition {
    id: ID
    ${languageSpecificDefinition}
  }

  type TagSetUpdate {
    tagSets: [TagSet]
    hasMore: Boolean
    newUpdatedFrom: Milliseconds!
  }

  type TranslationBreakdownUpdate {
    translationBreakdowns: [TranslationBreakdown]
    hasMore: Boolean
    newUpdatedFrom: Milliseconds!
  }

  type LanguageSpecificDefinitionUpdate {
    languageSpecificDefinitions: [LanguageSpecificDefinition]
    hasMore: Boolean
    newUpdatedFrom: Milliseconds!
  }

  type LexEntry {
    id: ID
    usfm: String
  }

  type VersionResult {
    versionId: ID
    usfm: String
    tagSets: [TagSet]
  }

  type BibleSearchResult {
    originalLoc: String
    versionResults: [VersionResult]
  }

  type SuggestedQuery {
    suggestedQuery: String!
    resultCount: Int
  }

  type BibleSearchResultSet {
    results: [BibleSearchResult]
    countByBookId: JSON
    totalHits: Int
    otherSuggestedQueries: [SuggestedQuery]
  }

  type AutoCompleteSuggestion {
    from: String!
    suggestedQuery: String!
    originalWords: JSON
    resultCount: Int
  }

  type UIWord {
    id: ID
    str: String
    desc: String
    translation: String
  }

  type Version {
    id: ID
    name: String
    languageId: ID
    wordDividerRegex: String
    partialScope: String
    versificationModel: String
    skipsUnlikelyOriginals: Boolean
    extraVerseMappings: JSON
  }

  type EmbeddingApp {
    id: ID
  }

`

module.exports = types