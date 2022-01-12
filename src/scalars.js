const GraphQLJSON = require('graphql-type-json')
const { GraphQLScalarType, Kind } = require('graphql')

const serialize = value => (
  value instanceof Date  // value sent to the client
    ? value.getTime()
    : value  // already be an int ms timestamp
)

const scalars = {
  JSON: GraphQLJSON,
  Milliseconds: new GraphQLScalarType({
    name: 'Milliseconds',
    description: 'Milliseconds since UNIX epoch, no more than now',
    parseValue: value => {  // value from the client
      if(!Number.isInteger(value)) throw `bad Milliseconds value`
      return new Date(Math.min(value, Date.now()))  // disallow any times in the future
    },
    serialize,
    // parseLiteral,
  }),
  MillisecondsIncludingFuture: new GraphQLScalarType({
    name: 'MillisecondsIncludingFuture',
    description: 'Milliseconds since UNIX epoch',
    parseValue: value => {  // value from the client
      if(!Number.isInteger(value)) throw `bad MillisecondsIncludingFuture value`
      return new Date(value)
    },
    serialize,
    // parseLiteral,
  }),
}

module.exports = scalars