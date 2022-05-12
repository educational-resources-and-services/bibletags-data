const { doQuery } = require('./testUtils')

describe('Query: tagSet', async () => {

  it('Genesis 21:14 (after resubmit of Genesis 1:1)', async () => {
    const tagSet = await doQuery(`
      tagSet(id: "01021014-esv-8r//") {
        id
        tags
        status
      }
    `)
    tagSet.should.eql({
      id: `01021014-esv-8r//`,
      tags: [
        // {o:['01dPb|1'],t:[5,6]},  // בַּ⁠בֹּ֡קֶר - because the ב here does not match the parsing while the ב in בְּ⁠מִדְבַּ֖ר does, this gets a lower score and is not chosen
        {o:["01biP|1"],t:[8]},  // וַ⁠יִּֽקַּֽח
        {o:["01rgf|1"],t:[11]},  // וְ⁠חֵ֨מַת
        {o:["01tdm|1"],t:[16]},  // וַ⁠יִּתֵּ֣ן
        {o:['01L84|1'],t:[28]},  // הַ⁠יֶּ֖לֶד
        {o:["01c61|1"],t:[30]},  // וַֽ⁠יְשַׁלְּחֶ֑⁠הָ
        {o:["01ley|1"],t:[34]},  // וַ⁠תֵּ֣לֶךְ
        {o:["016We|1"],t:[37]},  // וַ⁠תֵּ֔תַע
        {o:["01NV5|1"],t:[39]},  // בְּ⁠מִדְבַּ֖ר
      ],
      status: "automatch",
    })
  })

})