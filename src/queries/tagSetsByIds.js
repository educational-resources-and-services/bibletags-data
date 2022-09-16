const { getVersionTables } = require('../utils')

const tagSetsByIds = async (args, req, queryInfo) => {

  const { ids } = args

  const escapeQuote = str => str.replace(/'/g, "\\'")

  const locAndWordsHashSetStrsByVersionId = {}
  ids.forEach(id => {
    const [ loc, versionId, wordsHash ] = id.split('-')
    locAndWordsHashSetStrsByVersionId[versionId] = locAndWordsHashSetStrsByVersionId[versionId] || []
    locAndWordsHashSetStrsByVersionId[versionId].push(`('${escapeQuote(loc)}', '${escapeQuote(wordsHash)}')`)
  })

  const tagSetsReadyToReturn = []

  await Promise.all(
    Object.keys(locAndWordsHashSetStrsByVersionId).map(async versionId => {

      const { tagSetTable } = await getVersionTables(versionId)

      const tagSets = await tagSetTable.findAll({
        where: global.connection.literal(`(loc, wordsHash) IN (${locAndWordsHashSetStrsByVersionId[versionId].join(', ')})`),
      })

      tagSetsReadyToReturn.push(...tagSets.map(({ loc, wordsHash, tags, status }) => ({
        id: `${loc}-${versionId}-${wordsHash}`,
        tags,
        status,
      })))

    })
  )

  return tagSetsReadyToReturn

}

module.exports = tagSetsByIds