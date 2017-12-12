// tagSets:version = [translationVersionCode] (eg. esv)

// Most of the time, wordsByPosition will return a single word, but in the event that multiple orig language words
// connect to a single translation word, more than one word might need to be sent back. Same goes for translationsByPosition.

/*

  mutation eg.

  type Mutation {
    updateUser(id: ID, input: UserInput!): User
  }
  
*/

const schemaTypes = require('./schemaTypes')
const schemaInputs = require('./schemaInputs')

`

scalar JSON
scalar Date

${schemaTypes}

${schemaInputs}

type Query {
  chapter(bookId: Int!, chapter: Int!, version: String!): [Verse]
  verse(id: ID!): Verse
  tagSets(bookId: Int!, chapter: Int!, version: String!): [TagSet]
  tagSet(id: ID!): TagSet
  word(id: ID!): Word
  wordsByPosition(verseId: String!, wordNum: Int!): [Word]
  hits(id: ID!): Hits
  translations(id: ID!): Translations
  translationsByPosition(verseId: String!, wordNum: Int!): [Translations]
  search(query: String!, offset: Int, limit: Int, tagVersions: [String]): SearchResult
}

type Mutation {
  
}

schema {
  query: Query
  mutation: Mutation
}


`