// Verse:id = [2-digit book][3-digit chapter][3-digit verse]-[original language or lxx versionId] (eg. 01001001-wlc for Gen 1:1)
// Verse:usfm - every word MUST be in a /w enclosure
// TagSet:id = [2-digit book][3-digit chapter][3-digit verse]-[versionId] (eg. 01001001-esv)
// TagSet:tags = an array of the original language word numbers (including chapter and verse, if different; including word part number, if multi-part) and translation word numbers
  // (eg. Gen 1:1's for the esv would be [{o:["|1|1"],t:[1]},{o:["|1|2"],t:[3]},...] wherein "בראשית" is tagged to "In" and "beginning")
  // (eg. In an instance where the chapter and verse is different: [{o:["4:1|3|1"],t:[4]},{o:["4:1|3|2"],t:[5,6]},...] wherein 4:1, 3rd word, 1st part tags to 4th word in the translation, and 4:1, 3rd word, 2nd part tags to 5th word and 6th words in the translation)
// Definition:id = [extended strongs number]-[language] (eg. H234a-eng, G8289-esp; language is needed for the gloss)
// Definition:pos = an array of parts of speech abbreviations (N, V, etc) that this lemma is found in
// Definition:syn and Definition:rel = arrays of synonym/related word objects (eg. [{"lemma":"τέκνον","strongs":"G5043","hits":99,"gloss":"child"},...])
// Definition:lxx = an object with info on the lxx translation of this word (eg. [{"w":"ἀρχῇ","lemma":"ἀρχή","strongs":"G746","hits":236,"bhpHits":55}]); only relevant for Hebrew
// Hits:id = [extended strongs number]-[context abbreviation] (eg. H323-T for this word in the Torah, G822-40 for this word in Matthew as the 40th book, G873-LXX for this word in the LXX, G3025-ληνῶν for this word inflected in this way, etc)
// Translations:id = [extended strongs number]-[versionId] (eg. H8873-esv for the different translations of the word in the esv)
// Translations:tr = an object mapping word translations to hits (eg. {"son":299,"sons":56,...})
// LexEntry:id = [extended strongs number]-[language] (eg. H234a-eng, G8289-esp)
// SearchResult:hitsPerBook (eg. {"43":22,"44":3} would indicate 22 hits in John and 3 in Acts)

module.exports = `

  type Verse {
    id: ID
    usfm: String
  }

  type TagSet {
    id: ID
    tags: JSON
  }

  type Definition {
    id: ID
    lemma: String
    lemmaUnique: Boolean
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

  type VersionInfo {
    id: ID
    name: String
    language: String
    wordDividerRegex: String
    partialScope: String
    versificationModel: String
    skipsUnlikelyOriginals: Boolean
    extraVerseMappings: JSON
  }

`