const { doQuery } = require('./testUtils')

describe('Query: tagSet', async () => {

  it('Genesis 1:1', async () => {
    const tagSet = await doQuery(`
      tagSet(id: "01001001-esv-7+j841rr4vj8eOvlj8hS") {
        id
        tags
        status
      }
    `)
    tagSet.should.eql({
      id: "01001001-esv-7+j841rr4vj8eOvlj8hS",
      tags: [
        {o:["01h7N|1"],t:[1]},
        {o:[],t:[2]},
        {o:["01h7N|2"],t:[3]},
        {o:["01cuO|1"],t:[4]},
        {o:["01RAp|1"],t:[5]},
        {o:["01vvO|1"],t:[6]},
        {o:["01vvO|2"],t:[7]},
        {o:["01Q4j|1"],t:[8]},
        {o:["01VFX|1"],t:[9]},
        {o:["01VFX|2"],t:[10]},
        {o:["01Q4j|2"],t:[]},
        {o:["01XDl|1"],t:[]},
      ],
      status: "unconfirmed",
    })
  })

  it('Genesis 1:2', async () => {
    const tagSet = await doQuery(`
      tagSet(id: "01001002-esv-pHhSp3/AP8vlyrvlm3p3O3j81ci/j8Ziwzj8rki/rrp3mfO3j81ci/j8dS") {
        id
        tags
        status
      }
    `)
    tagSet.should.eql({
      id: "01001002-esv-pHhSp3/AP8vlyrvlm3p3O3j81ci/j8Ziwzj8rki/rrp3mfO3j81ci/j8dS",
      tags: [
        {o:["01SU2|2"],t:[1]},
        {o:["01SU2|3"],t:[2]},
        {o:["01SU2|1"],t:[6]},
        {o:["01Aud|1"],t:[8]},
        {o:["019DZ|1"],t:[12]},
        {o:["018H0|1"],t:[17]},
        {o:["01AyJ|1"],t:[21]},
      ],
      status: "automatch",
    })
  })

})