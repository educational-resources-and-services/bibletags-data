const { Op } = require('sequelize')
const { getQueryAndFlagInfo, bibleSearch, bibleSearchFlagMap } = require('@bibletags/bibletags-ui-helper')

const bibleSearchResults = async (args, req, queryInfo) => {

  const { query, flags } = getQueryAndFlagInfo({ ...args, FLAG_MAP: bibleSearchFlagMap })

  const { models } = global.connection

  if(/(?:^| )[^#= ]/.test(query.replace(/["/()*.]/g, ''))) throw `invalid original language search: contains token that doesn't start with # or =`
  if((flags.same || "verse") !== "verse") throw `invalid original language search: cannot use the 'same' flag`

  if(!(flags.in || []).some(inItem => [ 'uhb', 'ugnt', 'lxx' ].includes(inItem))) {
    flags.in = flags.in || []
    if(/#G/.test(query)) {
      flags.in.push('ugnt')
    } else if(/#H/.test(query)) {
      flags.in.push('uhb')
    } else {
      flags.in.push('ugnt')
      flags.in.push('uhb')
    }
  }

  const getVersions = async versionIds => versionIds.map(versionId => ({
    id: versionId,
    versificationModel: [ 'lxx' ].includes(versionId) ? 'lxx' : 'original',
    partialScope: [ 'uhb', 'lxx' ].includes(versionId) ? 'ot' : 'nt',
  }))

  const getUnitWords = async ({ versionId, id, limit }) => (
    await models[`${versionId}UnitWord`].findAll({
      where: {
        id: (
          /^[^*]+\*$/.test(id)
            ? {
              [Op.like]: global.connection.literal(`"${id.replace(/([%_\\"])/g, '\\$1').replace(/\*/g, '%')}" ESCAPE '\\\\'`),
            }
            : id
        )
      },
      limit,
    })
  )

  const getUnitRanges = async ({ versionId, ids }) => (
    await models[`${versionId}UnitRange`].findAll({
      where: {
        id: ids,
      },
    })
  )

  const getVerses = async ({ versionId, locs }) => (
    await models[`${versionId}Verse`].findAll({
      where: {
        loc: locs,
      },
    })
  )

  return bibleSearch({
    ...args,
    query,
    flags,
    getVersions,
    getUnitWords,
    getUnitRanges,
    getVerses,
    // doClocking: true,
  })

}

module.exports = bibleSearchResults