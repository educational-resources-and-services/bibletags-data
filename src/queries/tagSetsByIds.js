const tagSetsByIds = async (args, req, queryInfo) => {

  const { ids } = args

  const { models } = global.connection

  const escapeQuote = str => str.replace(/'/g, "\\'")
  const getLocWordsHashAndVersionIdSetStr = id => {
    const [ loc, versionId, wordsHash ] = id.split('-')
    return `('${escapeQuote(loc)}', '${escapeQuote(wordsHash)}', '${escapeQuote(versionId)}')`
  }

  const tagSets = await models.tagSet.findAll({
    where: global.connection.literal(`(loc, wordsHash, versionId) IN (${ids.map(getLocWordsHashAndVersionIdSetStr).join(', ')})`),
  })

  return tagSets.map(({ loc, versionId, wordsHash, tags, status }) => ({
    id: `${loc}-${versionId}-${wordsHash}`,
    tags,
    status,
  }))

}

module.exports = tagSetsByIds