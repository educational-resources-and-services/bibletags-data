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
  countByBookId
  totalHits
  otherSuggestedQueries {
    suggestedQuery
    resultCount
  }
`

describe('Query: bibleSearchResults', async () => {

  it('Search: #H43250', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H43250", hebrewOrdering: false, offset: 0, limit: 1) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [
        {
          originalLoc: "01001002",
          versionResults: [
            {
              tagSets: null,
              usfm: "\\w וְ⁠הָ⁠אָ֗רֶץ|lemma=\"אֶרֶץ\" strong=\"c:d:H07760\" x-morph=\"He,C:Td:Ncbsa\" x-id=\"01SU2\"\\w*\n\\w הָיְתָ֥ה|lemma=\"הָיָה\" strong=\"H19610\" x-morph=\"He,Vqp3fs\" x-id=\"01tJr\"\\w*\n\\w תֹ֨הוּ֙|lemma=\"תֹּהוּ\" strong=\"H84140\" x-morph=\"He,Ncmsa\" x-id=\"01kYH\"\\w*\n\\w וָ⁠בֹ֔הוּ|lemma=\"בֹּהוּ\" strong=\"c:H09220\" x-morph=\"He,C:Ncmsa\" x-id=\"01Aud\"\\w*\n\\w וְ⁠חֹ֖שֶׁךְ|lemma=\"חֹשֶׁךְ\" strong=\"c:H28220\" x-morph=\"He,C:Ncmsa\" x-id=\"018H0\"\\w*\n\\w עַל|lemma=\"עַל\" strong=\"H59211\" x-morph=\"He,R\" x-id=\"01R3M\"\\w*־\\w פְּנֵ֣י|lemma=\"פָּנִים\" strong=\"H64400\" x-morph=\"He,Ncbpc\" x-id=\"01wdx\"\\w*\n\\w תְה֑וֹם|lemma=\"תְּהוֹם\" strong=\"H84150\" x-morph=\"He,Ncbsa\" x-id=\"01NjL\"\\w*\n\\w וְ⁠ר֣וּחַ|lemma=\"רוּחַ\" strong=\"c:H73070\" x-morph=\"He,C:Ncbsc\" x-id=\"01FbN\"\\w*\n\\w אֱלֹהִ֔ים|lemma=\"אֱלֹהִים\" strong=\"H04300\" x-morph=\"He,Ncmpa\" x-id=\"01AyJ\"\\w*\n\\w מְרַחֶ֖פֶת|lemma=\"רָחַף\" strong=\"H73632\" x-morph=\"He,Vprfsa\" x-id=\"01NN8\"\\w*\n\\w עַל|lemma=\"עַל\" strong=\"H59211\" x-morph=\"He,R\" x-id=\"0107l\"\\w*־\\w פְּנֵ֥י|lemma=\"פָּנִים\" strong=\"H64400\" x-morph=\"He,Ncbpc\" x-id=\"01MyZ\"\\w*\n\\w הַ⁠מָּֽיִם|lemma=\"מַיִם\" strong=\"d:H43250\" x-morph=\"He,Td:Ncmpa\" x-id=\"019DZ\"\\w*׃",
              versionId: "uhb",
            },
          ],
        },
      ],
      countByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 582,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #noun#masculine#plural', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#noun#masculine#plural", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [0,797,693,385,645,629,374,365,22,448,324,447,418,596,566,219,305,96,359,1162,267,101,60,669,761,82,774,202,105,49,99,15,23,63,27,30,30,12,109,27,389,174,306,193,374,73,88,39,32,32,22,21,29,11,30,16,13,2,85,27,25,20,11,0,3,8,171],
      totalHits: 23685,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 2,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,26,0,35,4,1,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3],
      totalHits: 76,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,26,0,35,4,1,0,2,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3],
      totalHits: 76,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 1,
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
      countByBookId: [0,3,4,0,0,0,0,1,0,1,0,5,3,5,7,3,0,0,0,0,0,1,0,1,4,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 40,
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
      countByBookId: [0,8,4,1,2,3,1,6,0,6,3,7,11,10,8,6,2,3,3,20,2,2,1,20,16,0,5,1,0,0,0,0,0,2,1,0,0,1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 175,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,2,0,1,0,0,2,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 9,
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
      countByBookId: [0,5,0,3,0,2,5,1,0,0,0,0,1,1,0,0,1,0,0,1,0,1,0,4,0,0,9,0,1,0,0,0,0,0,0,0,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 38,
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
      countByBookId: [0,789,776,549,727,599,456,408,53,543,485,579,504,445,580,181,262,147,96,325,42,140,60,429,738,22,622,301,34,37,71,8,32,39,14,11,26,33,130,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 24827,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #h\'', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#h'", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [0,231,276,236,263,230,153,155,14,204,133,207,157,160,217,33,83,58,144,348,103,55,37,305,345,38,294,37,49,14,44,4,6,25,12,14,15,11,60,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 6472,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #h', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#h", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [0,858,840,604,792,663,482,436,54,591,515,625,532,497,624,184,267,149,228,613,136,159,78,599,869,52,726,305,74,40,89,11,33,53,21,23,33,36,143,30,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 31299,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #h#v', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#h#v", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [0,82,87,84,85,104,77,38,1,58,40,77,52,68,145,52,63,29,12,20,5,24,2,96,89,3,111,89,9,10,7,1,3,6,4,1,4,6,22,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 2197,
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
      countByBookId: [0,82,87,84,85,104,77,38,1,58,40,77,52,68,145,52,63,29,12,20,5,24,2,96,89,3,111,89,9,10,7,1,3,6,4,1,4,6,22,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 2197,
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
      countByBookId: [0,133,56,3,55,37,23,80,14,117,103,66,96,17,44,4,17,19,203,138,36,38,14,121,146,12,56,13,10,7,20,4,10,16,7,10,1,6,26,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 2247,
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
      countByBookId: [0,109,66,32,85,61,84,46,2,54,40,37,47,30,35,2,2,0,5,8,2,3,1,21,48,0,82,8,3,2,2,0,2,1,0,2,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 1082,
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
      countByBookId: [0,40,4,0,16,4,5,19,3,36,8,5,11,4,5,13,33,0,17,108,7,3,2,3,10,5,9,10,3,1,1,0,2,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 455,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 5,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #preposition/particle', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#preposition/particle", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [0,1311,1062,797,877,876,514,557,78,763,617,757,660,529,721,180,262,141,774,1490,449,184,90,982,1245,108,1118,336,159,51,111,20,46,86,33,45,43,33,186,53,715,452,814,640,828,329,273,222,111,130,86,87,70,43,70,60,30,18,233,73,80,50,85,10,12,20,320],
      totalHits: 64994,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 4,
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
      countByBookId: [0,21,37,9,13,101,7,16,2,33,18,13,18,8,10,2,7,2,9,101,12,5,0,19,19,0,24,9,7,0,1,1,0,2,0,0,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 631,
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
      countByBookId: [0,96,99,86,59,158,24,59,4,91,65,57,78,34,70,6,18,21,76,221,75,23,6,105,69,7,85,46,18,2,5,4,1,5,1,6,1,5,11,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 2082,
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
      countByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: null,
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
      countByBookId: [0,2,2,2,4,6,0,0,0,2,0,0,0,0,1,0,2,0,3,3,5,1,0,1,6,0,3,1,1,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: null,
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
      countByBookId: [0,1526,1212,859,1288,958,656,618,85,811,695,817,719,943,822,280,405,167,1070,2521,915,221,117,1274,1363,154,1268,357,197,73,145,21,48,105,47,56,53,38,211,54,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: null,
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
      countByBookId: [0,2,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,1,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 15,
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
      countByBookId: [0,0,0,0,0,1,0,0,0,1,2,1,0,0,0,0,0,0,0,2,4,2,10,0,3,0,0,0,3,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 31,
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
      countByBookId: [0,4,5,1,3,7,0,0,2,1,6,0,3,0,0,1,0,0,32,19,16,5,0,9,3,2,2,4,0,0,1,0,0,0,0,0,0,0,2,0,61,47,71,43,18,22,34,20,10,3,9,4,9,4,4,6,4,2,6,4,3,0,6,0,0,1,4],
      totalHits: 523,
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
      countByBookId: [0,10,3,2,5,7,2,0,0,2,0,0,0,0,1,0,2,0,3,9,5,2,0,18,7,0,8,1,1,0,3,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: null,
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
      countByBookId: [0,801,703,389,649,632,374,366,22,453,327,450,420,597,567,219,307,96,366,1171,279,102,64,674,768,82,782,203,108,49,100,15,24,64,30,30,30,12,109,27,389,174,306,193,374,73,88,39,32,32,22,21,29,11,30,16,13,2,85,27,25,20,11,0,3,8,171],
      totalHits: 23886,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,65,55,62,58,64,2,3,6,3,0,1,0,0,0,2,1,1,0,16,2,0,0,0,2,0,0,5],
      totalHits: null,
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
      countByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 1,
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
      countByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 1,
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
      countByBookId: [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 1,
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
      countByBookId: [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 1,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  // TODO
  // it('Search: #G24140 in:lxx,ugnt', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#G24140 in:lxx,ugnt", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     // countByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  //     // totalHits: 582,
  //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

  it('Search: #G15190 #G20640 same:verses:3', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#G15190 #G20640 same:verses:3", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      // countByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      // totalHits: 582,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #G24140 include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#G24140 include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      // countByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      // totalHits: 582,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #H01600 include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H01600 include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      // countByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      // totalHits: 582,
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
  //     // countByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  //     // totalHits: 582,
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
  //     // countByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  //     // totalHits: 582,
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
  //     // countByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  //     // totalHits: 582,
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
  //     // countByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  //     // totalHits: 582,
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
  //     // countByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  //     // totalHits: 582,
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
  //     // countByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  //     // totalHits: 582,
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
  //     // countByBookId: [0,46,38,40,36,20,20,11,0,8,10,17,19,3,4,1,10,0,25,49,14,2,3,54,26,5,40,3,3,2,5,0,2,1,3,3,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  //     // totalHits: 582,
  //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

})