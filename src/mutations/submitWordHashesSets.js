const submitWordHashesSet = require('./submitWordHashesSet')

const submitWordHashesSets = async (args, req, queryInfo) => {

  const { input } = args
  await Promise.all(input.map(set => submitWordHashesSet({ input: set, skipGetTagSet: true })))

  return true
}

module.exports = submitWordHashesSets