const { buildSchema } = require('graphql')

const scalars = require('./scalars')
const types = require('./types')
const inputs = require('./inputs')
const queries = require('./queries')
const mutations = require('./mutations')

const schema = buildSchema(`

  ${Object.keys(scalars).map(scalarType => `scalar ${scalarType}`)}

  ${types}

  ${inputs}

  type Query {
    ${queries}
  }

  type Mutation {
    ${mutations}
  }

`)

Object.keys(scalars).forEach(scalarType => {
  Object.assign(schema._typeMap[scalarType], scalars[scalarType])
})

const root = {}

const addKeysToRoot = ({ schemaString, type }) => {
  schemaString
    .split('\n')
    .forEach(line => {
      const query = (line.match(/[^ \(\:]+/) || [])[0]
      if(query) {
        root[query] = async (...params) => {
          try {
            return await require(`./${type}/${query}`)(...params)
          } catch(err) {
            console.error(`Error in ${type} - ${query}\n`, err)
            throw (
              typeof err === 'string'
                ? new Error(err)
                : err
            )
          }
        }
      }
    })

}

addKeysToRoot({ schemaString: queries, type: `queries` })
addKeysToRoot({ schemaString: mutations, type: `mutations` })

module.exports = {
  schema,
  root,
}