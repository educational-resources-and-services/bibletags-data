const { padWithZeros } = require('../utils')

const {
  versionIdRegEx,
} = require('../constants')

const versionProgressByBookId = async (args, req, queryInfo) => {

  const { versionId } = args

  if(!versionId.match(versionIdRegEx)) {
    throw `Invalid versionId (${versionId}).`
  }

  const getByBookIdQuery = where => `

    SELECT
      substr(loc, 1, 2) AS bookId,
      COUNT(*) AS cnt

    FROM (
      SELECT DISTINCT loc
      FROM ${versionId}TagSets
      ${where || ``}
    ) as tbl

    GROUP BY bookId

  `

  const [
    total,
    tagged,
    confirmed,
  ] = (
    await Promise.all([
      global.connection.query(getByBookIdQuery()),
      global.connection.query(getByBookIdQuery(`WHERE status IN ("unconfirmed", "confirmed")`)),
      global.connection.query(getByBookIdQuery(`WHERE status IN ("confirmed")`)),
    ])
  ).map(([ rows ], idx) => rows)

  const progressByBookId = [ null ]

  for(let bookId = 1; bookId <= 66; bookId++) {
    progressByBookId[bookId] = {
      total: (total.find(row => row.bookId === padWithZeros(bookId, 2)) || {}).cnt || 0,
      tagged: (tagged.find(row => row.bookId === padWithZeros(bookId, 2)) || {}).cnt || 0,
      confirmed: (confirmed.find(row => row.bookId === padWithZeros(bookId, 2)) || {}).cnt || 0,
    }
  }

  return progressByBookId

}

module.exports = versionProgressByBookId