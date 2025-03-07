const { doQuery } = require('./testUtils')

describe('Query: tagSetsByIds', async () => {

  it('Genesis 1:1,2', async () => {
    const tagSets = await doQuery(`
      tagSetsByIds(ids: [ "01001001-esv-Sfgh", "01001002-esv-vmGG" ]) {
        id
        tags
        status
      }
    `)
    tagSets.should.eql([
      {
        id: "01001001-esv-Sfgh",
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
      },
      {
        id: "01001002-esv-vmGG",
        tags: [
          {o:["01SU2|2"],t:[1]},  // וְ⁠הָ⁠אָ֗רֶץ
          {o:["01SU2|3"],t:[2]},  // וְ⁠הָ⁠אָ֗רֶץ
          {o:["01Aud|1"],t:[8]},  // וָ⁠בֹ֔הוּ  - this is the wrong guess, but the algorithm is working right
          {o:["01FbN|1"],t:[17]},  // וְ⁠ר֣וּחַ
          {o:["01AyJ|1"],t:[21]},  // אֱלֹהִ֔ים
          {o:["019DZ|1"],t:[28]},  // הַ⁠מָּֽיִם
        ],
        status: "automatch",
      },
    ])
  })

})