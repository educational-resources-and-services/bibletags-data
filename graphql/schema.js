// tagSets:versionId = [translationVersionId] (eg. esv)

// definitionsByPosition:versionId = (eg. uhb, esv)
// definitionsByPosition:verseId = (eg. 01001001)
// definitionsByPosition:wordNum = (eg. 3)
// definitionsByPosition:languageId = (eg. eng)
// translationsByPosition has same params

// Most of the time, definitionsByPosition will return a single word, but in the event that multiple orig language words
// connect to a single translation word, more than one word might need to be sent back. Same goes for translationsByPosition.

/*

  mutation eg.

  type Mutation {
    updateUser(id: ID, input: UserInput!): User
  }
  
*/

const fs = require('fs')
const { makeExecutableSchema } = require('graphql-tools')
const GraphQLJSON = require('graphql-type-json')
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
const schemaTypes = require('./schemaTypes')
const schemaInputs = require('./schemaInputs')

// mutation requires found inline below

module.exports = ({ connection, nullLikeDate }) => {

  const { models } = connection

  const queryFunctions = {}
  const items = fs.readdirSync(`${__dirname}/queries`)
  items.forEach(item => {
    if(!item.match(/\.js$/)) return
    const itemName = item.replace(/\.js$/, '')
    queryFunctions[itemName] = require(`./queries/${itemName}`)({
      connection,
      models, 
    })
  })

  const schemaString = `

    scalar JSON
    scalar Date
    
    ${schemaTypes}
    
    ${schemaInputs}
    
    type Query {
      chapter(bookId: Int!, chapter: Int!, versionId: String!): [Verse]
      verse(id: ID!): Verse
      tagSets(bookId: Int!, chapter: Int!, verse: Int, versionId: String!): [TagSet]
      tagSet(id: ID!): TagSet
      definition(id: ID!): Definition
      definitionsByPosition(versionId: String!, verseId: String!, wordNum: Int!, languageId: String!): [Definition]
      hits(id: ID!): Hits
      translations(id: ID!): Translations
      translationsByPosition(versionId: String!, verseId: String!, wordNum: Int!, languageId: String!): [Translations]
      search(query: String!, offset: Int, limit: Int, tagVersionIds: [String]): SearchResult
      versionInfo(id: ID!): VersionInfo
      uiWords(languageId: String!): [UIWord]
    }
    
    type Mutation {
      submitWordHashesSet(input: WordHashesSetInput!): Boolean
      submitTagSet(input: TagSetInput!): Boolean
      submitUIWords(input: UIWordsInput!): Boolean
    }
    
    schema {
      query: Query
      mutation: Mutation
    }
  
  `

  const resolveFunctions = {
    JSON: GraphQLJSON,
    Date: new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue(value) {
        return new Date(value); // value from the client
      },
      serialize(value) {
        return value.getTime(); // value sent to the client
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return parseInt(ast.value, 10); // ast value is always in string format
        }
        return null;
      },
    }),
    Query: (() => {

      const queries = {}
      const items = fs.readdirSync(`${__dirname}/queries`)
      
      items.forEach(item => {
        if(!item.match(/\.js$/)) return
        const itemName = item.replace(/\.js$/, '')
        queries[itemName] = require(`./queries/${itemName}`)({
          connection,
          nullLikeDate,
          models, 
        })
      })

      return queries

    })(),
    Mutation: (() => {

      const mutations = {}
      const items = fs.readdirSync(`${__dirname}/mutations`)
      
      items.forEach(item => {
        if(!item.match(/\.js$/)) return
        const itemName = item.replace(/\.js$/, '')
        mutations[itemName] = require(`./mutations/${itemName}`)(Object.assign({
          connection,
          nullLikeDate,
          models, 
        }, queryFunctions))
      })

      return mutations

    })(),
  }


  return makeExecutableSchema({ typeDefs: schemaString, resolvers: resolveFunctions });

}