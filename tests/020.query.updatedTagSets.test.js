const { doQuery } = require('./testUtils')

describe('Query: updatedTagSets', async () => {

  it('Query first page of tagSets', async () => {
    const updatedTagSets = await doQuery(`
      updatedTagSets(versionId: "esv", updatedSince: 0) {
        tagSets {
          id
          tags
          status
        }
        hasMore
        newUpdatedFrom
      }
    `)

    updatedTagSets.hasMore.should.eql(true)
    updatedTagSets.tagSets.slice(0,3).should.eql([
     {
        "id": "33005010-esv-bVfV",
        "status": "automatch",
        "tags": [
          {
            "o": [
              "33JKg|1",
            ],
            "t": [
              2,
            ],
          },
        ],
      },
      {
        "id": "08003011-esv-/sMv",
        "status": "automatch",
        "tags": [
          {
            "o": [
              "08x0P|1",
            ],
            "t": [
              1,
            ],
          },
        ],
      },
      {
        "id": "08003018-esv-PY/5",
        "status": "automatch",
        "tags": [
          {
            "o": [
              "08ayN|1",
            ],
            "t": [
              15,
            ],
          },
          {
            "o": [
              "08Ua2|1",
            ],
            "t": [
              23,
            ],
          },
        ],
      },
    ])

  })

})