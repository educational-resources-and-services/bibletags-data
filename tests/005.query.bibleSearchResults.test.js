const { doQuery } = require('./testUtils')

const bibleSearchResultsQuery = `
  results {
    originalLoc
    versionResults {
      versionId
      usfm
      tagSets {
        id
        tags
        status
      }
    }
  }
  rowCountByBookId
  hitsByBookId
  otherSuggestedQueries {
    suggestedQuery
    resultCount
  }
`

describe('Query: bibleSearchResults', async () => {

  it('Search: #H43250 include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H43250 include:variants", hebrewOrdering: false, offset: 0, limit: 1) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [
        {
          originalLoc: "01001002",
          versionResults: [
            {
              versionId: 'uhb',
              usfm: '\\v 2\n' +
                '\\w וְ⁠הָ⁠אָ֗רֶץ|lemma="אֶרֶץ" strong="c:d:H07760" x-morph="He,C:Td:Ncbsa" x-id="01SU2"\\w*\n' +
                '\\w הָיְתָ֥ה|lemma="הָיָה" strong="H19610" x-morph="He,Vqp3fs" x-id="01tJr"\\w*\n' +
                '\\w תֹ֨הוּ֙|lemma="תֹּהוּ" strong="H84140" x-morph="He,Ncmsa" x-id="01kYH"\\w*\n' +
                '\\w וָ⁠בֹ֔הוּ|lemma="בֹּהוּ" strong="c:H09220" x-morph="He,C:Ncmsa" x-id="01Aud"\\w*\n' +
                '\\w וְ⁠חֹ֖שֶׁךְ|lemma="חֹשֶׁךְ" strong="c:H28220" x-morph="He,C:Ncmsa" x-id="018H0"\\w*\n' +
                '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="01R3M"\\w*־\\w פְּנֵ֣י|lemma="פָּנִים" strong="H64400" x-morph="He,Ncbpc" x-id="01wdx"\\w*\n' +
                '\\w תְה֑וֹם|lemma="תְּהוֹם" strong="H84150" x-morph="He,Ncbsa" x-id="01NjL"\\w*\n' +
                '\\w וְ⁠ר֣וּחַ|lemma="רוּחַ" strong="c:H73070" x-morph="He,C:Ncbsc" x-id="01FbN"\\w*\n' +
                '\\w אֱלֹהִ֔ים|lemma="אֱלֹהִים" strong="H04300" x-morph="He,Ncmpa" x-id="01AyJ"\\w*\n' +
                '\\w מְרַחֶ֖פֶת|lemma="רָחַף" strong="H73632" x-morph="He,Vprfsa" x-id="01NN8"\\w*\n' +
                '\\w עַל|lemma="עַל" strong="H59211" x-morph="He,R" x-id="0107l"\\w*־\\w פְּנֵ֥י|lemma="פָּנִים" strong="H64400" x-morph="He,Ncbpc" x-id="01MyZ"\\w*\n' +
                '\\w הַ⁠מָּֽיִם|lemma="מַיִם" strong="d:H43250" x-morph="He,Td:Ncmpa" x-id="019DZ"\\w*׃',
              tagSets: null
            },
          ],
        },
      ],
      rowCountByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,54,44,43,45,21,23,13,0,8,10,19,23,3,4,1,10,0,25,53,14,2,3,58,29,5,48,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #noun#masculine#plural include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#noun#masculine#plural include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,797,693,385,645,629,374,365,22,448,324,447,418,596,566,219,305,96,359,1162,267,101,60,669,761,82,774,202,105,49,99,15,23,63,27,30,30,12,109,27,389,174,306,193,374,73,88,39,32,32,22,21,29,11,30,16,13,2,85,27,25,20,11,0,3,8,171],
      hitsByBookId: [0,1194,1221,603,1149,1094,673,603,33,741,480,811,792,1137,1192,475,657,173,439,1572,344,160,105,1068,1266,132,1344,352,169,88,156,19,46,101,50,47,49,16,160,38,559,246,397,232,499,85,116,59,41,45,31,25,37,11,37,22,16,2,103,36,29,26,13,0,4,9,256],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #H76210#plural', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H76210#plural", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #lemma:Ἰερουσαλήμ', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#lemma:Ἰερουσαλήμ", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,26,0,35,4,1,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,27,0,36,4,1,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #lemma:Ἰερουσαλήμ / #lemma:δαιμονίζομαι', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#lemma:Ἰερουσαλήμ / #lemma:δαιμονίζομαι", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,4,27,1,35,4,1,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3],
      hitsByBookId: null,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #G24140#lemma:Ἰερουσαλήμ', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#G24140#lemma:Ἰερουσαλήμ", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,26,0,35,4,1,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,27,0,36,4,1,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #form:μαγοι', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#form:μαγοι", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #form:שלם', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#form:שלם", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,3,4,0,0,0,0,1,0,1,0,5,3,5,7,3,0,0,0,0,0,1,0,1,4,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,3,4,0,0,0,0,1,0,1,0,5,3,5,7,3,0,0,0,0,0,1,0,1,4,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #form:שלם/שלום', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#form:שלם/שלום", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,8,4,1,2,3,1,6,0,6,3,7,11,10,8,6,2,3,3,20,2,2,1,20,16,0,5,1,0,0,0,0,0,2,1,0,0,1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,9,4,1,2,3,1,6,0,8,3,7,11,12,8,6,2,3,3,20,2,2,1,24,21,0,7,1,0,0,0,0,0,2,1,0,0,1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #b#H01600', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#b#H01600", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,2,0,1,0,0,2,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,2,0,1,0,0,2,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #v#h!#H07760', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#v#h!#H07760", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,5,0,3,0,2,5,1,0,0,0,0,1,1,0,0,1,0,0,1,0,1,0,4,0,0,9,0,1,0,0,0,0,0,0,0,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,5,0,3,0,2,5,1,0,0,0,0,1,1,0,0,1,0,0,1,0,1,0,4,0,0,9,0,1,0,0,0,0,0,0,0,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #h!', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#h!", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,789,776,549,727,599,456,408,53,543,485,579,504,445,580,181,262,147,96,325,42,140,60,429,738,21,622,301,34,37,71,8,32,39,14,11,26,33,130,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,1523,1677,1406,1445,1384,1145,843,104,1104,1053,1335,1178,862,1396,487,678,471,132,385,48,297,99,773,1697,27,1371,886,57,72,130,12,70,59,17,18,65,85,325,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #h\' include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#h' include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,231,276,236,263,230,153,155,14,204,133,207,157,160,217,33,83,58,144,348,103,55,37,305,345,38,294,37,49,14,44,4,6,25,12,14,15,11,60,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,286,364,345,377,321,217,187,14,267,160,279,202,234,320,52,126,73,174,400,135,88,49,429,475,51,443,51,59,21,55,5,8,27,21,18,23,18,79,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #h include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#h include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,858,840,604,792,663,482,436,54,591,515,625,532,497,624,184,267,149,228,613,136,159,78,599,869,52,726,305,74,40,89,11,33,53,21,23,33,36,143,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,1809,2041,1751,1822,1716,1363,1032,118,1375,1222,1617,1390,1101,1721,546,805,549,306,785,183,386,149,1203,2172,79,1818,937,116,93,185,17,78,86,38,36,88,103,406,59,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #h#v include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#h#v include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,82,87,84,85,104,77,38,1,58,40,77,52,68,145,52,63,29,12,20,5,24,2,96,89,3,111,89,9,10,7,1,3,6,4,1,4,6,22,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,89,124,105,96,157,115,45,1,69,48,94,71,98,213,76,101,33,12,20,5,30,2,118,112,3,148,117,10,13,7,1,4,7,4,1,4,8,29,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #v#h', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#v#h", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,82,87,84,85,104,77,38,1,58,40,77,52,68,145,52,63,29,12,20,5,24,2,96,89,2,111,89,9,10,7,1,3,6,4,1,4,6,22,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,89,124,105,96,155,115,45,1,68,46,94,71,98,213,76,101,32,12,20,5,30,2,118,112,2,146,117,10,13,7,1,4,7,4,1,4,8,29,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #h?', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#h?", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,48,9,0,18,11,4,28,7,39,37,32,51,7,20,1,7,3,73,22,8,3,1,38,47,1,34,4,0,1,10,2,1,9,1,6,0,5,8,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,52,9,0,22,13,4,29,8,42,39,32,57,7,21,2,8,3,74,26,8,3,1,45,51,1,41,4,0,1,13,3,1,13,1,6,0,5,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #h->', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#h->", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,109,66,32,85,61,84,46,2,54,40,37,47,30,35,2,2,0,5,8,2,3,1,21,48,0,81,8,3,2,2,0,2,1,0,2,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,133,70,32,91,66,119,52,2,57,41,42,52,34,44,2,2,0,5,8,2,4,2,23,50,0,118,10,3,2,2,0,3,1,0,2,0,2,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #h^', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#h^", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,40,4,0,15,4,4,18,3,36,8,5,11,4,4,13,33,0,17,108,7,3,2,3,10,4,9,10,3,1,1,0,2,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,43,4,0,21,4,4,20,4,36,10,6,11,4,4,17,41,0,19,133,7,3,2,4,10,4,10,14,3,1,1,0,2,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #G01630/G01620', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#G01630/G01620", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #preposition/particle include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#preposition/particle include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1311,1062,797,877,876,514,557,78,763,617,757,660,529,721,180,262,141,774,1490,449,184,90,982,1245,108,1118,336,159,51,111,20,46,86,33,45,43,33,186,53,715,452,814,640,828,329,273,222,111,130,86,87,70,43,70,60,30,18,233,73,80,50,85,10,12,20,320],
      hitsByBookId: [0,4037,3308,2561,2607,3061,1855,1946,271,2565,2079,2472,2339,1257,2143,654,789,530,1477,2482,688,611,202,2491,4267,210,3225,1673,397,128,328,51,150,203,67,105,116,98,535,164,1235,777,1487,1072,1568,653,481,494,211,274,168,194,150,88,112,118,48,30,419,116,161,91,181,25,17,33,649],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #b#H01600#suffix:3ms', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#b#H01600#suffix:3ms", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #b#suffix:2ms', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#b#suffix:2ms", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,21,37,9,13,101,7,16,2,33,18,13,18,8,10,2,7,2,9,101,12,5,0,19,19,0,24,9,7,0,1,1,0,2,0,0,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,24,49,10,13,124,11,17,2,34,20,14,21,9,14,2,8,2,10,116,14,5,0,21,29,0,36,10,7,0,1,1,0,2,0,0,0,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #b#suffix:2ms/3ms', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#b#suffix:2ms/3ms", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,96,99,86,59,158,24,59,4,91,63,57,78,34,70,6,18,21,76,221,75,23,6,105,69,7,85,46,18,2,5,4,1,5,1,6,1,5,11,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,103,125,99,63,197,32,64,4,99,67,65,87,35,83,6,19,28,85,242,84,25,6,122,91,7,102,53,19,2,5,5,1,5,1,8,1,5,12,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #H72250 #H12541', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H72250 #H12541", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: null,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #H72250 #not:H12541', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H72250 #not:H12541", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,2,2,2,4,6,0,0,0,2,0,0,0,0,1,0,2,0,3,3,5,1,0,1,6,0,3,1,1,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: null,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #H72250 / #not:H12541', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H72250 / #not:H12541", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1526,1212,859,1288,958,656,618,85,811,695,817,719,943,822,280,405,167,1070,2521,915,221,117,1274,1363,154,1268,357,197,73,145,21,48,105,47,56,53,38,211,54,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: null,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #H12541#not:qal', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H12541#not:qal", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,2,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,1,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,2,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,1,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #not:b#H01600', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#not:b#H01600", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,1,0,0,0,1,2,1,0,0,0,0,0,0,0,2,4,2,10,0,3,0,0,0,3,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,1,0,0,0,1,3,1,0,0,0,0,0,0,0,2,4,2,10,0,3,0,0,0,3,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #not:noun', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#not:noun", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,4,5,1,3,7,0,0,2,1,6,0,3,0,0,1,0,0,32,19,16,5,0,9,3,2,2,4,0,0,1,0,0,0,0,0,0,0,2,0,61,47,71,43,18,22,34,20,10,3,9,4,9,4,4,6,4,2,6,4,3,0,6,0,0,1,4],
      hitsByBookId: [0,4,5,1,3,7,0,0,2,1,6,0,3,0,0,1,0,0,32,19,16,5,0,9,3,2,2,4,0,0,1,0,0,0,0,0,0,0,2,0,61,47,71,43,18,22,34,20,10,3,9,4,9,4,4,6,4,2,6,4,3,0,6,0,0,1,4],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #H72250 / #H12541', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H72250 / #H12541", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,10,3,2,5,7,2,0,0,2,0,0,0,0,1,0,2,0,3,9,5,2,0,18,7,0,8,1,1,0,3,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: null,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #noun#masculine#plural/dual', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#noun#masculine#plural/dual", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,801,703,389,649,632,374,366,22,453,325,450,418,596,567,217,307,96,364,1170,277,102,64,673,768,81,782,203,108,49,100,15,24,64,30,30,30,12,109,27,389,174,306,193,374,73,88,39,32,32,22,21,29,11,30,16,13,2,85,27,25,20,11,0,3,8,171],
      hitsByBookId: [0,1202,1237,612,1161,1096,673,605,33,743,483,813,788,1133,1192,470,657,166,447,1580,349,160,113,1077,1277,130,1367,355,173,90,159,19,47,102,53,47,49,16,160,38,559,246,397,232,499,85,116,59,41,45,31,25,37,11,37,22,16,2,103,36,29,26,13,0,4,9,256],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #G15250 / (#G15190 #G20640)', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#G15250 / (#G15190 #G20640)", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,65,55,62,58,64,2,3,6,3,0,1,0,0,0,2,1,1,0,16,2,0,0,0,2,0,0,5],
      hitsByBookId: null,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: "#H72250 #H12541"', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "\\"#H72250 #H12541\\"", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: "#H72250 * #H04300"', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "\\"#H72250 * #H04300\\"", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: "#H72250 ... #H12541"', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "\\"#H72250 ... #H12541\\"", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #H01600 in:law', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H01600 in:law", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  // TODO
  // it('Search: #G15190 #G20640 same:verses:3', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#G15190 #G20640 same:verses:3", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  // it('Search: #G24140 include:variants', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#G24140 include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  it('Search: #H19790', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H19790", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #H19790 include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H19790 include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  // it('Search: #H01600+', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#H01600+", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  // it('Search: #H01600~', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#H01600~", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  // it('Search: =love', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "=love", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  // it('Search: =love[ESV]', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "=love[ESV]", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  // it('Search: =lov*', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "=lov*", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  // it('Search: =love+', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "=love+", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  // it('Search: =love~', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "=love~", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  it('Search: #noun', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#noun", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1529,1208,858,1286,952,658,618,83,810,689,817,716,943,822,279,405,167,1038,2508,899,217,117,1282,1361,152,1271,353,197,73,145,21,48,105,47,56,53,38,209,55,1010,631,1080,836,989,411,403,236,139,152,95,91,80,43,109,77,42,23,297,104,102,61,99,13,15,24,401],
      hitsByBookId: [0,9172,7958,5580,8593,6112,5240,4369,452,5754,5095,6215,5785,6818,6986,1958,2911,1574,3326,9395,3321,1148,637,7730,9877,737,8897,2075,1056,482,941,146,265,665,283,301,392,297,1414,357,3568,1978,3609,2654,4090,1685,1373,910,524,622,365,390,318,201,409,310,153,81,1169,388,428,301,393,49,31,124,2334],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #determiner', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#determiner", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,956,577,967,790,947,361,327,193,106,142,73,88,70,36,89,64,41,18,242,90,78,52,99,11,13,19,395],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2820,1519,2564,2180,2839,1000,885,542,252,435,177,261,174,108,177,146,79,39,637,224,185,138,326,31,26,58,2008],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #foreign', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#foreign", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,5,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,9,0,0,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #adjective', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#adjective", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,506,430,322,476,345,228,233,29,277,242,319,286,284,306,130,164,79,262,644,465,129,42,413,385,37,508,170,39,28,54,5,21,29,12,17,17,19,77,21,423,246,439,301,461,184,191,94,45,66,36,37,26,12,76,41,39,9,162,60,68,41,37,7,11,18,253],
      hitsByBookId: [0,897,835,542,1210,505,339,386,40,428,397,647,481,694,695,345,378,165,369,844,720,239,68,611,565,45,1019,302,45,39,93,7,35,39,15,23,25,40,133,32,669,363,647,378,620,281,304,124,58,91,58,51,34,16,145,75,89,13,261,114,125,70,55,9,17,32,480],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #conjunction', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#conjunction", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,320,231,249,192,301,105,133,24,233,162,151,123,101,166,36,44,37,285,460,136,82,15,338,445,27,254,75,62,28,37,5,9,31,7,13,15,6,44,21,1021,662,1095,809,956,385,392,232,134,121,86,75,75,43,96,70,34,18,270,99,93,58,98,12,11,20,386],
      hitsByBookId: [0,404,311,380,255,383,139,167,42,336,217,204,167,123,217,50,52,50,330,505,154,111,20,401,569,34,296,129,74,34,48,8,13,38,8,19,17,7,57,29,2363,1677,2564,1947,2190,860,1004,583,289,234,197,146,184,105,199,134,71,41,551,220,203,121,266,27,22,42,1394],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #adverb', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#adverb", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,289,155,30,157,151,100,115,23,183,155,153,143,79,132,51,31,14,131,182,47,31,5,245,367,8,297,78,39,10,43,4,4,23,8,8,10,11,42,9,614,372,578,587,565,273,304,186,96,65,66,48,63,26,62,38,22,9,206,60,58,36,66,8,10,16,175],
      hitsByBookId: [0,358,181,35,174,172,119,126,29,231,194,180,183,91,147,63,37,14,141,195,49,38,7,303,473,8,415,87,42,11,51,4,4,28,9,8,14,15,50,10,978,627,919,970,817,503,555,360,172,109,125,68,127,44,97,62,35,19,348,103,93,57,119,17,15,22,308],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #preposition', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#preposition", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1022,785,616,699,672,401,449,68,604,526,598,515,367,545,147,218,115,517,1003,221,115,74,671,964,72,905,265,127,38,84,11,41,65,21,34,27,27,141,35,692,442,797,619,815,322,255,217,107,130,86,87,70,43,69,60,30,18,231,71,80,50,85,10,12,20,316],
      hitsByBookId: [0,1853,1469,1120,1217,1234,813,912,144,1188,1066,1147,1002,586,1020,242,426,228,696,1277,267,188,118,1093,1803,103,1634,533,211,62,150,19,91,103,29,50,43,51,250,59,1132,732,1413,1009,1519,627,426,478,203,272,165,190,148,88,111,118,48,30,408,105,161,91,175,25,16,33,643],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #pronoun', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#pronoun", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,483,280,279,304,366,212,203,33,272,185,237,203,176,193,83,114,47,145,306,71,86,23,320,490,19,419,131,55,10,35,5,12,28,6,10,14,16,87,27,942,602,1058,810,880,363,363,224,125,132,98,89,82,46,81,66,32,25,254,92,90,50,98,13,15,25,365],
      hitsByBookId: [0,630,354,339,375,492,281,258,39,368,263,309,251,221,237,121,150,64,168,347,75,124,27,424,653,23,531,182,68,15,43,5,19,30,8,12,16,23,121,34,2583,1685,3125,2734,2356,950,904,688,300,323,278,234,246,137,153,163,70,69,631,210,195,128,361,39,39,59,1034],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #particle', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#particle", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1060,862,651,654,762,400,451,64,634,486,594,535,339,544,118,171,120,521,865,308,164,49,727,1059,71,794,285,105,39,88,17,28,55,23,32,31,20,136,45,89,39,68,60,48,22,42,14,8,2,3,4,2,0,1,0,0,0,10,10,0,0,6,0,1,0,6],
      hitsByBookId: [0,2184,1837,1439,1390,1827,1040,1033,127,1371,1001,1324,1331,669,1123,404,363,302,774,1203,418,423,83,1390,2464,103,1590,1140,185,66,178,32,59,100,38,55,73,47,285,105,103,45,74,63,49,26,55,16,8,2,3,4,2,0,1,0,0,0,11,11,0,0,6,0,1,0,6],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #verb', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#verb", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1458,1133,836,1088,933,525,616,85,801,666,782,716,550,803,176,278,163,1040,2431,845,211,98,1275,1345,152,1204,352,195,72,145,21,48,104,46,54,50,36,205,53,1062,674,1130,879,1005,408,409,239,143,146,98,93,85,44,104,78,43,18,296,105,100,59,105,13,15,24,395],
      hitsByBookId: [0,5059,3763,2515,3165,3553,1956,2575,413,3544,2754,3051,3031,1474,2857,557,984,647,2538,5808,1911,716,288,4964,5399,489,4337,1456,690,248,527,70,202,389,168,203,187,120,816,250,4010,2646,4444,3611,3962,1170,1308,764,415,327,256,236,243,121,298,226,114,44,922,358,283,193,436,48,52,85,1564],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #qal', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#qal", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1404,1043,707,1014,897,501,599,79,779,637,738,692,429,731,90,234,149,888,1945,694,199,87,1193,1287,134,1138,144,179,67,130,18,47,99,39,51,47,35,192,53,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,3871,2612,1491,2265,2512,1451,1984,335,2606,2020,2293,2276,929,1892,193,629,418,1626,3486,1209,528,204,3237,3723,323,3046,355,480,165,349,49,148,272,84,135,111,99,609,171,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #sequential-perfect', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#sequential-perfect", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [ 0,106,317,403,243,350,72,47,11,99,52,85,53,24,40,1,13,5,34,37,31,14,2,308,343,1,443,42,37,17,46,8,1,28,2,2,15,2,51,27,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,164,525,707,407,632,124,70,23,172,87,141,79,34,68,2,18,8,40,44,40,19,2,466,527,1,793,75,64,24,85,15,2,54,2,2,25,5,94,42,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #sequential-imperfect', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#sequential-imperfect", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1086,522,109,463,157,317,519,62,610,497,506,530,267,537,60,141,87,164,260,28,3,1,160,314,26,325,58,28,4,23,0,38,5,4,10,2,9,64,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,2105,887,189,750,255,592,1139,138,1318,1055,1040,1216,469,982,86,264,159,260,333,32,3,2,244,486,29,513,98,45,7,29,0,84,7,4,15,2,16,115,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #cohortative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#cohortative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,54,19,0,11,16,1,20,2,19,20,10,11,7,4,1,7,0,18,112,8,2,5,25,29,2,2,1,4,0,1,1,3,5,0,2,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,70,25,0,12,22,1,22,3,24,29,13,15,9,5,1,8,0,25,154,11,2,13,31,42,4,2,2,4,0,2,1,5,8,0,4,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #jussive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#jussive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,62,37,15,24,19,15,20,11,48,40,42,39,11,26,4,10,14,36,123,84,17,5,42,79,7,15,14,6,8,2,3,2,6,0,1,2,1,8,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,77,40,16,31,29,24,25,11,61,53,53,44,14,33,7,12,19,42,149,102,25,7,51,103,9,22,15,12,11,2,8,4,8,0,2,4,1,11,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #passive-participle', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#passive-participle", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,39,77,26,135,65,25,19,4,32,31,61,56,30,62,30,34,19,25,80,33,14,12,98,80,8,101,33,11,3,5,2,1,6,6,2,6,2,10,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,49,85,37,143,82,26,19,4,33,33,66,61,34,65,31,36,23,27,90,34,19,18,122,89,9,123,40,13,3,5,2,1,6,8,2,6,2,12,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #infinitive-absolute', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#infinitive-absolute", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,47,54,37,37,54,20,21,2,44,28,19,21,9,12,1,9,12,15,13,17,17,1,51,101,5,35,6,6,2,6,0,3,5,3,4,1,2,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,55,59,38,40,63,23,26,2,50,34,23,24,10,16,1,9,15,16,16,17,19,1,81,136,5,39,6,11,3,6,0,4,6,3,4,1,7,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #infinitive-construct', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#infinitive-construct", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,352,262,170,265,311,144,173,28,250,199,245,201,140,305,70,73,69,95,242,108,61,5,229,370,19,332,93,29,7,33,4,17,13,2,13,6,15,53,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,435,346,196,310,452,210,219,39,328,276,326,260,182,424,99,99,111,105,289,131,109,7,318,497,21,440,122,31,7,40,5,21,15,2,17,11,19,70,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #present', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#present", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,716,471,784,665,645,301,343,193,105,101,76,70,64,32,92,49,31,14,225,83,71,44,101,12,14,18,298],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1421,980,1501,1506,1228,610,796,401,207,174,146,127,137,65,203,89,78,23,426,199,140,95,284,32,36,41,612],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #future', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#future", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,239,83,210,124,85,81,60,30,18,6,14,6,4,4,8,17,0,3,38,17,9,10,4,2,3,1,76],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,353,123,314,172,107,97,82,42,20,8,16,6,6,7,8,24,0,3,52,26,13,15,8,2,3,1,120],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #aorist', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#aorist", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,845,549,925,663,844,224,200,133,86,77,43,50,45,27,41,48,15,11,187,59,64,30,44,5,8,14,321],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2039,1170,2142,1346,2053,370,315,251,140,122,69,81,79,40,68,87,27,14,335,118,108,60,67,10,9,33,704],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #pluperfect', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#pluperfect", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,16,31,16,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,16,34,17,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #perfect', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#perfect", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,653,388,166,323,368,281,308,46,436,361,429,440,285,436,107,153,95,394,960,161,110,51,604,824,118,558,226,102,39,79,10,21,41,28,24,23,23,103,40,105,84,159,222,149,68,85,50,27,16,17,17,15,6,17,21,6,2,76,17,13,17,48,3,2,8,90],
      hitsByBookId: [0,940,559,208,444,543,497,481,71,671,539,701,683,396,665,163,239,157,547,1406,210,188,104,1084,1435,261,917,430,169,75,105,19,36,61,55,42,39,33,177,76,116,92,169,283,164,79,96,67,29,19,20,19,18,6,19,26,8,3,87,19,15,20,69,3,3,9,115],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #imperfect', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#imperfect", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,364,475,544,403,536,108,147,31,245,196,193,159,63,124,40,50,34,701,1132,466,111,27,760,570,48,487,155,126,30,83,11,12,65,19,40,26,8,90,23,130,228,267,214,321,13,14,9,15,4,4,3,2,2,0,0,1,1,23,3,6,3,5,1,1,2,38],
      hitsByBookId: [0,536,754,878,637,970,170,214,62,375,290,294,233,87,200,71,94,52,1168,1767,688,193,50,1453,974,68,845,311,244,50,130,14,18,131,36,75,53,13,155,35,144,294,360,292,419,15,20,9,21,4,5,3,3,3,0,0,1,1,26,3,8,3,7,1,1,2,41],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #indicative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#indicative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1012,653,1074,873,968,332,370,199,133,88,70,68,56,30,72,57,23,15,243,86,55,47,102,13,15,16,369],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2247,1522,2442,2557,1983,659,769,405,244,121,117,96,96,49,114,105,31,24,419,181,88,78,310,22,29,30,892],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #subjunctive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#subjunctive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,202,155,174,216,64,59,111,54,28,26,18,18,13,12,19,10,14,5,55,19,16,4,41,4,4,0,62],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,281,209,241,292,77,83,156,71,32,28,19,23,19,16,20,12,16,5,65,27,17,5,52,6,4,0,85],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #optative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#optative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,11,1,15,12,3,0,3,0,0,0,3,3,0,3,0,1,1,0,3,1,0,0,0,2,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,11,1,17,12,3,0,3,0,0,0,5,4,0,3,0,1,1,0,3,1,0,0,0,2,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #infinitive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#infinitive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,203,151,310,128,362,85,81,50,28,28,27,10,34,17,28,17,14,3,81,20,17,10,6,3,4,5,77],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,257,200,402,144,479,101,100,70,32,30,39,11,45,19,40,18,21,3,94,26,19,14,7,5,6,9,103],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #imperative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#imperative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,192,130,34,106,69,66,94,17,144,89,107,126,41,63,10,19,6,77,446,93,21,19,182,203,16,135,32,20,19,23,1,7,18,6,6,5,9,27,5,259,121,252,112,113,49,79,20,20,33,18,26,14,5,28,25,11,4,29,40,27,7,8,2,2,5,82],
      hitsByBookId: [0,299,196,41,136,110,110,133,25,208,136,166,183,71,92,17,29,12,118,701,139,29,35,356,397,29,227,51,34,45,43,1,13,26,16,12,11,14,38,6,358,170,340,151,148,63,100,28,23,41,25,29,20,7,43,33,14,4,32,61,37,7,9,3,2,6,117],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #participle', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#participle", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,274,229,160,206,303,134,169,27,226,169,169,179,128,216,60,120,65,157,676,333,72,33,488,504,39,311,149,47,19,56,3,12,47,27,21,22,7,92,26,599,373,697,351,742,177,128,119,61,76,42,48,36,17,59,36,23,5,201,46,75,49,41,8,7,20,245],
      hitsByBookId: [0,329,287,205,255,395,179,227,35,304,222,228,233,168,307,79,176,91,190,859,507,110,49,758,713,53,416,306,63,23,80,5,14,67,42,28,35,10,130,52,938,565,1066,488,1284,254,181,196,83,107,56,77,58,26,81,55,32,7,315,70,120,88,58,12,11,39,396],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #cardinal-number', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#cardinal-number", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,266,253,128,321,85,133,137,14,130,111,162,148,187,152,96,79,38,33,21,23,21,10,41,47,0,203,71,3,1,17,1,4,3,0,0,1,8,30,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,478,547,190,915,121,213,239,16,201,195,379,285,476,434,277,252,89,59,26,29,31,16,71,101,0,494,110,4,1,34,1,8,4,0,0,1,19,48,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #ordinal-number', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#ordinal-number", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,37,61,49,51,11,15,12,1,11,10,30,16,57,18,14,17,10,1,2,2,4,0,6,24,0,24,16,2,0,0,0,1,0,0,0,0,8,11,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,42,67,53,62,11,15,12,1,11,11,33,20,102,23,16,19,10,2,2,2,4,0,7,29,0,31,16,2,0,0,0,1,0,0,0,0,8,17,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #gentilic', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#gentilic", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,68,33,4,118,52,71,90,8,163,102,45,29,150,86,21,65,44,14,10,1,0,1,9,33,0,17,9,0,2,5,2,1,1,2,0,2,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,102,66,9,184,75,120,110,8,209,138,56,35,211,112,33,89,55,18,11,1,0,2,10,37,0,21,12,0,2,6,2,1,1,2,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #proper-name', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#proper-name", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1076,646,361,913,578,591,517,58,703,581,631,606,871,678,221,283,135,127,914,102,6,27,645,1010,55,647,153,124,35,109,14,35,64,18,18,36,29,146,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,2565,1523,587,2156,1069,1830,1388,137,1888,1687,1728,1857,3044,2009,665,834,315,173,1223,112,8,42,1261,2406,71,1074,296,241,69,235,34,60,129,29,23,71,74,299,70,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #affirmation', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#affirmation", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,87,44,14,36,52,24,33,7,57,42,42,37,13,50,11,18,7,48,81,37,43,3,64,65,10,28,21,13,7,5,1,1,2,2,0,6,0,12,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,106,55,15,39,54,28,42,8,70,49,45,39,15,51,11,18,8,50,85,38,51,4,75,72,10,31,24,14,7,5,1,1,2,4,0,10,0,13,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #exhortation', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#exhortation", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,55,12,0,14,1,3,23,0,31,25,18,29,3,3,1,5,0,22,12,0,0,1,15,26,2,5,3,0,0,2,0,2,4,0,0,0,4,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,64,15,0,16,1,4,26,0,31,28,19,31,3,3,1,6,0,22,13,0,0,1,15,28,2,5,3,0,0,2,0,2,4,0,0,0,4,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #negative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#negative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,248,232,223,170,332,96,145,23,201,132,171,180,59,155,27,63,34,310,424,227,83,15,370,470,46,259,95,57,16,56,8,9,29,15,16,16,7,43,17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,289,286,314,224,462,128,178,27,258,172,218,222,71,203,33,84,43,396,556,271,130,18,608,693,55,383,131,91,19,78,14,14,42,16,24,30,10,63,27,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #direct-object-marker', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#direct-object-marker", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,640,590,428,423,411,275,264,24,366,273,353,343,233,326,23,86,77,39,129,20,56,17,166,525,7,427,35,34,13,35,5,12,16,1,3,14,8,69,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,1005,1026,762,704,656,564,466,33,539,400,551,590,454,531,31,129,114,44,152,21,74,24,223,863,7,648,45,44,17,45,9,14,17,1,3,22,18,104,34,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #interjection', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#interjection", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,17,4,0,8,1,4,11,2,15,10,4,10,3,0,0,3,0,8,83,1,2,1,31,23,1,18,0,2,1,3,0,3,2,1,9,3,0,4,0,119,40,85,55,32,13,4,6,5,1,3,0,1,0,3,1,0,2,5,8,3,1,0,0,0,3,45],
      hitsByBookId: [0,18,4,0,8,1,4,11,2,15,11,4,10,3,0,0,3,0,8,87,2,2,1,31,26,1,19,0,2,1,4,0,3,2,1,9,3,0,5,0,126,41,89,80,32,13,4,7,5,1,3,0,1,0,3,1,0,2,5,8,3,1,0,0,0,3,56],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #substantive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#substantive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,272,159,273,179,269,111,123,49,27,39,22,20,15,6,40,20,18,8,109,36,45,21,20,3,8,12,133],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,390,210,368,215,326,161,178,61,34,54,30,27,21,6,80,37,44,10,149,59,70,32,25,4,13,16,220],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #predicate', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#predicate", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,116,49,108,72,90,64,62,34,14,13,12,7,8,3,17,7,10,1,36,16,9,6,14,0,2,0,51],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,140,53,125,78,95,74,76,36,16,13,18,7,8,3,21,7,15,1,38,21,10,6,16,0,2,0,59],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #ascriptive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#ascriptive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,98,65,113,57,153,31,38,23,7,17,7,11,4,5,32,23,21,1,56,25,29,26,7,3,1,10,104],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,122,79,136,71,168,35,46,27,8,20,10,13,4,7,43,30,29,1,67,31,45,32,9,3,1,16,148],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #restrictive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#restrictive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,19,18,13,31,10,3,0,0,4,0,4,1,0,1,1,1,1,7,3,0,0,5,2,1,0,48],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,21,18,14,31,11,4,0,0,4,0,4,1,0,1,1,1,1,7,3,0,0,5,2,1,0,53],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #article', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#article", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,922,554,917,774,905,340,305,181,99,133,66,84,67,36,66,60,32,18,230,81,72,48,96,11,13,19,382],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2397,1321,2098,1906,2298,876,689,435,214,362,133,208,147,94,114,124,61,31,531,175,157,109,295,27,25,43,1667],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #differential', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#differential", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,8,30,28,20,14,26,11,4,2,4,1,2,0,10,2,3,0,9,4,3,6,0,1,0,4,16],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,28,8,30,29,20,16,34,14,4,2,4,1,2,0,11,2,3,0,9,4,3,6,0,1,0,4,16],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #possessive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#possessive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26,10,26,63,51,23,35,10,6,12,6,14,3,1,13,2,0,5,24,14,6,7,6,0,1,2,9],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31,10,28,73,55,24,41,12,6,12,7,14,4,1,13,2,0,5,28,17,7,8,7,0,1,2,9],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #quantifier', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#quantifier", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,110,62,158,43,214,52,51,37,14,31,24,25,15,12,27,9,9,3,33,15,9,4,15,1,0,4,64],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,128,72,179,44,234,59,62,43,15,40,28,31,16,12,29,9,10,3,38,16,12,6,16,1,0,7,73],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #ordinal', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#ordinal", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,6,15,10,16,0,5,2,0,1,1,0,0,0,1,1,1,0,5,1,1,1,1,0,0,1,31],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,7,16,10,17,0,7,2,0,1,1,0,0,0,1,1,1,0,5,1,1,1,2,0,0,1,41],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #reflexive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#reflexive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,44,37,75,64,53,35,30,26,11,15,8,3,13,7,8,5,2,2,20,6,7,2,6,1,2,6,12],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,47,38,78,68,54,40,30,38,12,19,8,3,13,7,9,5,3,2,20,6,7,2,6,1,2,6,12],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #reciprocal', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#reciprocal", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,5,11,14,8,13,4,1,5,4,1,2,5,1,0,0,1,0,1,3,4,0,6,1,0,0,2],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,5,11,15,8,14,4,1,7,4,1,2,5,1,0,0,1,0,1,4,4,0,6,1,0,0,2],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  // it('Search: #transitive', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#transitive", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  // it('Search: #intransitive', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#intransitive", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  // it('Search: #linking', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#linking", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  // it('Search: #modal', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#modal", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  // it('Search: #periphrastic', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#periphrastic", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // rowCountByBookId: [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  it('Search: #exclamation', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#exclamation", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,47,20,21,27,5,9,3,1,3,1,2,0,1,0,3,1,0,1,1,2,2,1,0,0,0,2,16],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,50,20,23,52,5,9,3,1,3,1,2,0,1,0,3,1,0,1,1,2,2,1,0,0,0,2,23],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #directive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#directive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,65,19,55,21,24,2,1,5,2,0,0,0,0,0,0,0,0,0,4,6,1,0,0,0,0,1,28],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,68,20,57,21,24,2,1,6,2,0,0,0,0,0,0,0,0,0,4,6,1,0,0,0,0,1,29],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #response', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#response", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,1,9,7,3,2,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,4],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,1,9,7,3,2,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,4],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #improper-preposition', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#improper-preposition", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,100,49,89,48,78,29,22,19,7,7,6,1,4,0,11,3,2,1,29,5,3,2,6,0,1,3,56],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,110,50,96,52,83,30,24,24,8,7,6,1,4,0,12,3,2,1,30,6,3,2,6,0,1,3,65],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #correlative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#correlative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,61,25,30,60,115,73,72,39,16,12,27,4,20,7,15,12,3,3,53,7,25,6,10,5,4,6,17],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,121,55,65,115,234,145,171,84,34,26,53,10,40,14,28,25,6,6,93,18,43,14,20,10,7,11,44],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #coordinating', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#coordinating", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,968,644,1057,726,914,348,340,203,113,104,72,64,66,39,79,64,28,14,241,89,64,54,77,10,10,19,376],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1884,1355,2113,1307,1776,591,602,352,175,164,116,105,122,64,137,97,49,23,385,161,104,94,137,14,15,30,1152],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #subordinating', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#subordinating", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,344,233,343,425,249,149,224,130,73,48,41,31,32,22,37,22,18,12,103,44,55,17,75,6,3,6,169],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,414,294,416,582,290,191,303,188,95,56,54,35,40,33,47,24,19,15,117,49,77,20,119,7,3,6,216],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #demonstrative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#demonstrative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,352,186,104,218,187,127,110,15,204,125,161,137,109,132,56,51,30,103,110,38,56,15,223,381,10,215,83,13,7,28,2,7,11,5,9,4,12,61,11,392,185,493,428,450,182,163,109,55,56,55,36,36,23,38,31,10,7,150,40,36,29,70,7,6,14,183],
      hitsByBookId: [0,424,215,106,237,220,160,136,16,246,152,191,172,122,150,72,59,38,114,117,40,75,20,278,478,12,240,96,13,9,29,2,9,12,6,10,4,17,74,12,508,246,724,580,597,274,236,170,78,76,74,49,52,28,48,43,11,7,209,54,42,35,114,12,9,18,266],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #indefinite', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#indefinite", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,3,0,0,0,1,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,0,149,143,217,174,196,58,142,61,23,25,27,14,17,11,28,18,12,3,56,20,16,5,22,4,5,4,47],
      hitsByBookId: [0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,4,0,0,0,1,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,171,162,241,194,233,72,208,80,32,31,33,18,19,14,32,20,14,3,64,27,18,7,24,4,5,5,51],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #personal', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#personal", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,338,185,229,162,255,127,159,24,189,136,160,130,96,123,39,84,30,107,264,66,59,16,229,304,14,349,76,51,7,26,4,11,20,6,9,12,9,62,22,818,519,908,714,697,244,226,185,82,97,75,69,70,40,26,47,23,24,147,69,61,43,82,10,11,17,300],
      hitsByBookId: [0,396,221,270,201,312,149,187,29,229,175,193,146,115,141,45,104,38,116,295,69,77,19,295,361,16,430,88,64,10,31,4,12,21,8,11,13,11,76,29,1696,1103,1868,1721,1284,419,354,372,137,151,134,124,151,79,36,79,36,51,253,112,86,67,191,20,18,27,618],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #interrogative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#interrogative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,90,49,2,38,27,18,55,8,88,77,34,46,13,26,7,13,16,118,112,27,37,14,87,106,11,23,9,10,5,8,3,7,10,6,5,1,2,21,13,98,79,119,74,58,39,23,9,7,8,2,2,3,0,1,1,0,1,12,6,4,1,5,0,0,0,15],
      hitsByBookId: [0,100,58,2,41,29,19,68,8,113,87,35,52,16,27,7,14,26,152,132,40,49,21,116,130,14,23,9,13,6,9,3,11,14,8,6,1,3,24,17,108,86,130,84,62,45,31,12,7,9,2,2,3,0,1,1,0,1,12,6,5,1,5,0,0,0,16],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #relative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#relative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,349,263,252,256,430,193,142,31,199,165,284,238,83,204,70,82,72,40,109,12,65,2,148,364,7,276,150,10,9,16,3,11,14,2,4,6,7,40,11,145,92,181,135,230,81,59,40,28,39,21,40,8,9,25,19,6,5,79,8,31,18,16,3,4,3,75],
      hitsByBookId: [0,411,311,309,295,584,265,177,42,237,190,377,319,91,254,111,96,99,40,112,12,89,2,173,461,9,342,250,12,12,18,4,12,16,2,4,6,7,44,13,172,104,207,146,257,102,68,47,32,40,28,42,8,9,28,23,7,5,90,9,37,20,21,3,5,4,91],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #number', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#number", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,294,274,159,348,92,145,145,14,138,120,175,157,219,160,100,94,43,33,23,25,23,10,47,63,0,213,82,5,1,17,1,5,3,0,0,1,10,36,3,79,38,65,34,66,8,15,3,6,7,1,1,0,0,5,0,2,0,7,2,1,1,0,0,0,0,96],
      hitsByBookId: [0,520,614,243,977,132,228,251,17,212,206,412,305,578,457,293,271,99,61,28,31,35,16,78,130,0,525,126,6,1,34,1,9,4,0,0,1,27,65,5,97,42,79,44,76,9,25,4,8,11,2,1,0,0,8,0,2,0,8,3,1,4,0,0,0,0,180],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #active', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#active", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1014,656,1074,863,969,349,366,208,133,122,89,80,77,39,97,73,33,16,264,96,82,54,105,11,14,20,368],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3090,2043,3308,3035,2817,794,940,496,297,217,188,148,174,80,206,154,78,35,594,249,176,119,387,38,37,54,1204],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #middle', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#middle", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,354,280,488,272,519,147,125,103,40,42,38,34,33,16,43,33,18,6,115,51,34,25,18,7,8,15,136],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,444,369,637,331,694,181,164,142,49,51,43,43,39,22,50,40,23,6,148,73,38,33,21,7,10,18,163],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #passive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#passive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,405,210,432,217,397,152,156,88,53,49,19,31,25,16,34,29,10,3,134,33,56,30,22,2,4,10,160],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,547,255,557,267,477,197,205,132,71,59,25,45,30,19,42,32,13,3,184,43,70,41,28,3,5,14,226],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #1st', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#1st", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,366,186,102,135,201,83,133,21,189,155,132,100,52,70,37,101,12,225,608,55,63,39,329,487,36,449,100,83,17,64,4,15,33,7,7,19,14,86,29,305,151,305,416,348,182,194,187,80,50,68,25,56,28,30,42,17,22,85,25,9,19,63,8,10,6,154],
      hitsByBookId: [0,613,321,158,221,311,126,227,42,325,275,237,170,91,124,66,200,26,387,956,87,110,76,639,837,53,850,164,159,23,102,5,26,62,14,16,28,20,150,47,530,254,562,1094,624,359,422,434,157,73,134,46,101,47,44,74,30,43,155,40,12,32,170,16,22,9,280],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #2nd', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#2nd", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,382,451,235,298,521,133,170,43,262,191,216,187,68,136,26,69,10,242,826,186,37,30,387,474,35,407,74,34,28,42,11,14,34,11,20,10,14,51,30,506,225,483,410,289,139,175,123,62,67,57,64,72,33,30,33,13,22,76,61,62,23,30,7,9,13,121],
      hitsByBookId: [0,685,839,394,507,1049,299,339,88,505,339,457,363,144,287,48,138,27,420,1416,321,72,57,823,998,72,863,140,69,60,81,17,28,66,24,40,20,21,89,56,1141,486,1076,989,578,288,341,237,120,106,99,119,141,56,60,65,23,35,142,153,112,31,74,17,17,20,256],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #3rd', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#3rd", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1362,890,713,886,698,484,589,80,758,621,718,692,468,724,139,200,148,785,1411,553,162,57,1023,1100,120,927,306,157,60,112,16,43,78,37,41,43,28,175,45,997,657,1061,827,910,294,301,138,92,93,48,64,37,31,69,51,29,9,238,87,61,48,99,10,8,17,357],
      hitsByBookId: [0,3289,2047,1757,1890,1513,1242,1705,232,2228,1750,1907,2066,960,1775,279,430,392,1509,2477,883,354,99,2518,2490,292,2036,774,408,139,244,40,120,188,83,107,99,52,429,100,2903,2238,3262,2714,2323,633,660,246,176,174,71,107,61,60,118,98,47,12,492,194,115,98,323,19,17,42,1187],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #gender-both', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#gender-both", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,735,587,398,602,546,311,314,23,426,294,400,356,311,457,114,185,83,443,1047,372,132,59,696,741,79,780,122,85,34,73,3,17,55,21,26,26,32,130,41,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,1119,933,596,1116,847,484,509,27,676,467,652,541,565,781,218,344,122,564,1331,470,226,92,1032,1153,109,1451,198,108,50,102,3,23,72,32,40,38,50,232,61,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #common', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#common", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,538,323,161,331,312,211,228,27,303,235,203,206,192,205,77,166,41,325,854,91,73,54,530,725,77,639,131,119,33,83,14,20,52,21,11,28,17,117,33,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,869,516,254,482,504,321,366,48,480,381,357,311,272,316,119,309,68,545,1356,133,134,104,1014,1399,142,1315,217,235,52,139,25,31,95,33,23,49,25,240,57,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #neuter', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#neuter", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,604,407,698,487,641,269,272,169,93,105,74,61,44,28,54,40,22,13,194,60,62,37,57,7,10,17,321],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1707,1039,1805,1275,1747,784,867,435,240,323,204,186,104,54,121,104,57,28,538,170,190,95,163,16,27,56,1373],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #masculine', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#masculine", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1512,1205,854,1284,955,596,616,84,805,691,815,718,903,817,271,359,161,1051,2496,897,217,113,1279,1348,148,1254,355,196,73,146,21,48,104,47,56,52,38,206,55,1023,652,1089,840,986,404,382,231,132,146,98,90,80,47,99,77,43,22,279,98,102,58,102,12,13,24,385],
      hitsByBookId: [0,8482,7756,5624,7440,6508,4045,4163,384,5692,4820,5880,5505,4442,5950,1577,2288,1402,4110,10144,4007,1475,494,7970,8612,723,7719,2527,1006,499,873,139,308,617,278,366,343,267,1290,394,6053,3480,6141,4853,6281,1954,1703,959,564,684,400,445,401,242,459,353,206,88,1393,453,513,314,658,63,55,159,2808],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #feminine', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#feminine", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,948,748,610,794,587,407,395,77,451,367,483,444,363,548,151,244,140,540,1317,603,129,94,878,957,100,974,240,112,50,99,14,32,82,39,34,38,20,139,37,611,403,700,442,735,312,254,185,99,121,68,78,62,36,93,61,36,15,258,83,81,60,74,11,10,20,355],
      hitsByBookId: [0,2232,1777,1681,1799,1219,903,917,306,979,844,1256,1049,692,1279,300,540,417,888,2034,1157,256,280,2053,2291,223,2746,641,227,104,209,22,74,189,97,66,107,38,341,76,2093,1293,2332,1356,2584,1152,784,739,300,479,218,301,190,127,355,229,133,46,956,312,291,275,282,47,26,78,1888],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #dual', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#dual", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,182,150,74,143,90,48,67,13,93,87,111,109,76,93,35,41,23,101,182,129,22,26,119,111,18,150,24,11,5,14,0,5,7,5,6,2,7,30,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,207,217,88,160,105,51,76,14,107,103,128,129,85,104,39,46,25,109,195,136,23,33,144,133,18,197,30,11,6,15,0,5,7,7,6,2,7,39,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #singular', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#singular", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1496,1201,857,1245,950,610,609,85,799,691,816,716,820,812,236,333,163,1055,2485,911,222,117,1269,1357,150,1268,353,193,73,145,20,48,105,47,56,52,38,209,55,1040,663,1130,872,987,425,427,248,143,152,103,92,80,46,107,79,43,25,302,105,105,61,102,13,15,22,400],
      hitsByBookId: [0,9487,7991,6590,7552,6560,3752,4078,621,5791,5141,6150,5309,3773,5364,1243,1954,1550,4651,10294,4583,1708,643,8645,9274,793,9253,2624,1094,441,913,131,337,684,301,384,389,296,1489,386,9148,5474,9983,8738,9073,3742,3294,2000,1069,1241,782,785,522,387,778,680,295,210,2496,913,778,506,1194,126,110,176,5169],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #plural', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#plural", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1142,957,589,1014,782,517,515,57,615,483,605,586,700,739,252,342,126,660,1925,559,145,99,1043,1137,118,1077,287,158,65,129,20,32,89,41,39,46,32,178,53,879,559,905,670,884,328,343,232,123,139,88,87,89,43,93,62,41,15,256,88,96,57,85,12,13,24,342],
      hitsByBookId: [0,3008,2774,1477,3125,2413,1950,1801,130,1929,1268,1867,1968,2113,2858,932,1481,434,1347,4376,1048,360,294,3280,4048,386,3781,929,471,258,395,58,94,282,132,105,146,77,575,195,4316,2538,4062,2697,4341,1245,1381,964,450,527,313,376,448,177,364,222,189,33,1034,362,420,310,370,45,49,174,2177],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #absolute', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#absolute", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1303,1106,780,1080,892,558,560,74,737,646,757,647,656,777,224,328,157,915,2062,848,222,110,1192,1266,125,1148,323,170,71,138,19,44,96,46,55,51,38,200,51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,4150,4391,3321,4380,3103,1944,1968,211,2583,2243,3105,2428,2375,3423,959,1527,951,2177,4942,2877,1079,387,4532,4628,346,5059,1386,487,286,503,51,177,326,183,206,205,167,844,241,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #construct', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#construct", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1327,1094,760,1129,873,579,573,67,721,618,741,668,789,775,257,339,154,819,2226,789,174,113,1151,1272,138,1214,319,166,67,130,20,35,99,42,46,49,34,191,53,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,3731,3251,2456,3665,2922,2010,1645,183,2048,1817,2323,2275,2295,2621,789,1140,587,1562,5023,1593,429,343,3428,4210,427,4322,1037,449,192,381,75,78,322,136,125,182,108,546,139,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #determined', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#determined", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #nominative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#nominative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,960,584,983,812,900,341,372,209,116,121,79,76,60,33,79,63,33,17,255,93,90,51,93,10,11,21,361],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3457,1896,3345,3158,3052,1132,1335,654,362,347,212,239,179,94,242,192,100,44,757,359,279,189,431,43,28,87,1859],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #genitive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#genitive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,789,453,867,603,786,333,284,194,109,129,76,74,66,37,80,58,28,17,260,89,82,56,81,10,10,20,358],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2911,1537,3052,2011,3287,1372,893,836,403,551,283,335,294,211,293,215,115,64,1126,292,336,244,340,39,37,110,2278],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #dative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#dative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,646,412,727,545,626,276,246,167,80,117,80,74,56,31,61,49,27,18,162,56,68,52,65,11,10,17,233],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1869,1057,2164,1351,2003,941,815,668,237,464,266,326,217,128,236,179,81,61,441,171,241,177,236,31,26,58,834],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #accusative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#accusative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,847,573,929,746,899,335,287,198,116,107,86,73,68,39,83,68,40,21,255,76,85,52,94,11,13,20,346],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3401,2327,3801,2875,4303,1338,1014,792,402,480,328,292,277,135,312,283,177,69,1113,266,351,203,344,51,47,90,1902],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #vocative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#vocative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,97,32,105,63,80,21,24,6,14,7,9,6,14,7,3,1,0,2,9,21,7,5,17,1,3,3,15],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,151,50,141,76,137,36,27,6,21,14,15,12,15,8,4,1,0,2,13,29,10,5,20,1,3,3,75],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #comparative', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#comparative", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,48,20,39,28,49,3,17,14,2,3,4,0,1,0,10,4,2,0,34,3,6,4,3,1,2,0,13],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,52,20,43,29,49,4,21,16,2,3,6,0,1,0,12,4,2,0,41,3,7,4,3,1,2,0,13],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #superlatives', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#superlatives", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,11,22,5,15,6,8,3,1,0,1,0,1,1,6,3,1,1,2,2,1,4,0,0,0,1,2],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,11,23,5,15,6,8,3,1,0,1,0,1,1,6,3,1,1,2,2,1,4,0,0,0,1,2],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #diminutive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#diminutive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31,24,24,22,9,0,1,1,4,0,0,0,0,0,0,1,0,0,4,0,0,0,10,0,0,0,30],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34,29,24,24,9,0,1,1,5,0,0,0,0,0,0,1,0,0,4,0,0,0,11,0,0,0,32],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #indeclinable', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#indeclinable", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,121,62,169,78,122,36,8,8,16,1,1,0,0,0,3,1,0,0,39,8,3,3,1,0,0,3,66],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,206,71,264,99,157,44,9,14,19,1,2,0,0,0,3,1,0,0,59,12,4,4,1,0,0,6,111],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #G00050', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#G00050", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #G00050 in:ugnt', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#G00050 in:ugnt", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #G00050 in:lxx', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#G00050 in:lxx", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #G00050 in:lxx,ugnt', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#G00050 in:lxx,ugnt", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #G60037 in:lxx', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#G60037 in:lxx", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      rowCountByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,9,0,0,0,2,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hitsByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,9,0,0,0,2,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

})

