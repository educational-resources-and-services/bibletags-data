const submitWordHashesSet = require('./submitWordHashesSet')

const NUMBER_AT_A_TIME = 3

const submitWordHashesSets = async (args, req, queryInfo) => {

  const { input } = args

  let idx = -1

  const submitOne = async () => {
    if(++idx >= input.length) return
    await submitWordHashesSet({ input: input[idx], skipGetTagSet: true })
    await submitOne()
  }

  await Promise.all(Array(NUMBER_AT_A_TIME).fill().map(submitOne))

  return true
}

module.exports = submitWordHashesSets