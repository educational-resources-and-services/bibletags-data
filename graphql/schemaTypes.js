// Verse:id = [2-digit book][3-digit chapter][3-digit verse]-[original language or lxx versionCode] (eg. 0010101 for Gen 1:1)
// Verse:usfm - every word MUST be in a /w enclosure
// TagSet:id = [2-digit book][3-digit chapter][3-digit verse]-[versionCode] (eg. 0010101-esv)
// TagSet:tags = an array of the "top" original language word numbers (including chapter and verse) and "bottom" translation word numbers (eg. Gen 1:1's for the esv would be [{t:["1:1|1"],b:[1,3]},...] wherein "בראשית" is tagged to "In" and "beginning")
// Word:id = [extended strongs number]-[language] (eg. H234a-eng, G8289-esp; language is needed for the gloss)
// Word:pos = an array of parts of speech abbreviations (N, V, etc) that this lemma is found in
// Word:syn and Word:rel = arrays of synonym/related word objects (eg. [{"lemma":"τέκνον","strongs":"G5043","hits":99,"gloss":"child"},...])
// Word:lxx = an object with info on the lxx translation of this word (eg. [{"w":"ἀρχῇ","lemma":"ἀρχή","strongs":"G746","hits":236,"bhpHits":55}]); only relevant for Hebrew
// Hits:id = [extended strongs number]-[context abbreviation] (eg. H323-T for this word in the Torah, G822-40 for this word in Matthew as the 40th book, G873-LXX for this word in the LXX, G3025-ληνῶν for this word inflected in this way, etc)
// Translations:id = [extended strongs number]-[versionCode] (eg. H8873-esv for the different translations of the word in the esv)
// Translations:tr = an array of word translation objects (eg. [{"son":299,"sons":56,...},...])
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

  type Word {
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

`