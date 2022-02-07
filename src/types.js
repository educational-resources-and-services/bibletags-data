// Verse:id = [2-digit book][3-digit chapter][3-digit verse]-[original language or lxx versionId] (eg. 01001001-uhb for Gen 1:1)
// Verse:usfm - every word MUST be in a /w enclosure
// TagSet:id = [2-digit book][3-digit chapter][3-digit verse]-[versionId]-[wordsHash] (eg. 01001001-esv-PiUuem78i3msdf)
// TagSet:tags = an array of the original language word ids (followed by |[word part number], if multi-part) and translation word numbers
  // eg. Gen 1:1's for the esv would be [{o:["01xeN|1"],t:[1]},{o:["01xeN|2"],t:[3]},{o:["01Nvk"],t:[5]},...]
  //     wherein "בראשית" is tagged to "In" and "beginning", and "ברא" is tagged to "created"
// TagSet:status = none/incomplete/unconfirmed/confirmed
// Definition:id = [extended strongs number]-[languageId] (eg. H234a-eng, G8289-esp; languageId is needed for the gloss)
// Definition:pos = an array of parts of speech abbreviations (N, V, etc) that this lexeme is found in
// Definition:syn and Definition:rel = arrays of synonym/related word objects (eg. [{"lex":"τέκνον","strongs":"G5043","hits":99,"gloss":"child"},...])
// Definition:lxx = an object with info on the lxx translation of this word (eg. [{"w":"ἀρχῇ","lex":"ἀρχή","strongs":"G746","hits":236,"ugntHits":55}]); only relevant for Hebrew
// Hits:id = [extended strongs number]-[context abbreviation] (eg. H323-t for this word in the Torah, G822-40 for this word in Matthew as the 40th book, G873-lxx for this word in the LXX, G3025-ληνῶν for this word inflected in this way, etc)
// Translations:id = [extended strongs number]-[versionId] (eg. H8873-esv for the different translations of the word in the esv)
// Translations:tr = an object mapping word translations to hits (eg. {"son":299,"sons":56,...})
// LexEntry:id = [extended strongs number]-[languageId] (eg. H234a-eng, G8289-esp)
// SearchResult:hitsPerBook (eg. {"43":22,"44":3} would indicate 22 hits in John and 3 in Acts)

const types = `

  type Verse {
    id: ID
    usfm: String
  }

  type TagSet {
    id: ID
    tags: JSON
    status: String
  }

  type Definition {
    id: ID
    lex: String
    lexUnique: Boolean
    vocal: String
    hits: Int
    gloss: String
    pos: [String]
    syn: JSON
    rel: JSON
    lxx: JSON
    lxxHits: Hits
  }

  type Hits {
    id: ID
    hits: Int
  }

  type Translations {
    id: ID
    tr: JSON
  }

  type LexEntry {
    id: ID
    usfm: String
  }

  type SearchResult {
    hitsPerBook: JSON
    results: [Verse]
    tagSets: [TagSet]
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
    languageId: String
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