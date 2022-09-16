const versionIdsWithIncompleteTagSets = async (args, req, queryInfo) => {

  const { versionIds } = args

  const { models } = global.connection

  const versions = await models.version.findAll({
    where: {
      id: versionIds,
    },
  })

  const versionIdsWithIncompleteTagSets = []

  await Promise.all(versions.map(async ({ id, partialScope }) => {

    const [[{ count }]] = await global.connection.query(`
      SELECT COUNT(DISTINCT loc) AS \`count\` FROM ${id}TagSets
    `)

    if(
      count < .9 * ({
        ot: 23213,
        nt: 7958,
        all: 31171,
      }[partialScope || `all`])  
    ) { 
      versionIdsWithIncompleteTagSets.push(id)
    }

  }))

  return versionIdsWithIncompleteTagSets

}

module.exports = versionIdsWithIncompleteTagSets