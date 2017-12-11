// Verse id: [2-digit book][3-digit chapter][3-digit verse]-[original language or lxx versionCode] (eg. 0010101 for Gen 1:1; versification accords with the original language version)
// TagSet id: [Verse id]-[versionCode] (eg. 0010101-esv)
// TagSet:origLangId is a Verse id
// Word id: [extended strongs number]-[language] (eg. H234a-eng, G8289-esp; language is needed for the gloss)
// Word:pos is an array of parts of speech abbreviations (N, V, etc) that this lemma is found in
// Hits id: [extended strongs number]-[context abbreviation] (eg. H323-T for this word in the Torah, G822-40 for this word in Matthew as the 40th book, G873-LXX for this word in the LXX, G3025-ληνῶν for this word inflected in this way, etc)
// Translations id: [extended strongs number]-[versionCode] (eg. H8873-esv for the different translations of the word in the esv)
// Tr:w is the translation word (eg. "son" would be one for υἱός)
// LexEntry id: [extended strongs number]-[language] (eg. H234a-eng, G8289-esp)
// LxxWord:w is the inflected greek word

// usfm content is sent for a verse; every word in the original languages (or lxx) MUST be in a /w enclosure.

// two english verses = one hebrew ??
// one english verse = two hebrew - yes

module.exports = `

  type Verse {
    id: ID
    usfm: String
  }

  type TagSet {
    id: ID
    origLangId: String
    
  }

  type Word {
    id: ID
    lemma: String
    sound: String
    hits: Int
    gloss: String
    pos: [String]
    syn: [Wrd]
    rel: [Wrd]
    lxxWord: LxxWord
  }

  type LxxWord {
    w: String
    lemma: String
    strongs: String
    hits: Int
    bhpHits: Int
  }
  
  type Hits {
    id: ID
    hits: Int
  }

  type Wrd {
    id: ID
    lemma: String
    hits: Int
    gloss: String
  }

  type Translations {
    id: ID
    tr: [Tr]
  }

  type Tr {
    w: String
    hits: Int
  }

  type LexEntry {
    id: ID
    entry: String
  }

`