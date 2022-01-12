const request = require('supertest')(`http://localhost:8081`)

const now = Date.now()
let updatedSince = now

const doQuery = (query, type='') => new Promise(resolve => {
  request
    .post('/graphql')
    .send({ query: `${type} { ${query} }`})
    .expect(200)
    .end((err,res) => {
      if(err) {
        try {
          return resolve(new Error(JSON.parse(res.text).errors[0].message))
        } catch(x) {
          return resolve(err)
        }
      }

      const response = Object.values(res.body.data)[0]

      if((response || {}).newUpdatedSince) {
        updatedSince = response.newUpdatedSince
      }

      resolve(response)
    })
})

const doMutation = query => doQuery(query, 'mutation')

const shouldEqlWithAcceptAnyValueCols = ({ updatedRows, expectedRows, acceptAnyValueCols }) => {
  if(acceptAnyValueCols) {
    const newRows = updatedRows
      .map(row => {
        const newRow = { ...row }
        acceptAnyValueCols.forEach(col => {
          newRow.should.include.all.keys(col)
          delete newRow[col]
        })
        return newRow
      })
      newRows.should.eql(expectedRows)
  } else {
    updatedRows.should.eql(expectedRows)
  }
}

module.exports = {
  now,
  shouldEqlWithAcceptAnyValueCols,
  doQuery,
  doMutation,
}