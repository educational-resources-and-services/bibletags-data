const versionIdsWithIncompleteTagSets = async (args, req, queryInfo) => {

  const { versionIds } = args

  const { models } = global.connection

  const versions = await models.version.findAll({
    where: {
      id: versionIds,
    },
  })

  const [[ countByVersionId ]] = await global.connection.query(`
    SELECT
      ${
        versionIds
        .map((versionId, idx) => `
          (SELECT COUNT(*) FROM (SELECT DISTINCT loc FROM tagSets WHERE versionId="${versionId}") AS t) AS ${versionId}
        `)
        .join(',')
      }
  `)

  const versionWithIncompleteTagSets = versions.filter(({ id, partialScope }) => (
    countByVersionId[id] < .9 * ({
      ot: 23213,
      nt: 7958,
      all: 31171,
    }[partialScope || `all`])
  ))

  return versionWithIncompleteTagSets.map(({ id }) => id)

}

module.exports = versionIdsWithIncompleteTagSets