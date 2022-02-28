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

  it('Search: #noun#masculine#plural include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#noun#masculine#plural include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
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
      countByBookId: [0,789,776,549,727,599,456,408,53,543,485,579,504,445,580,181,262,147,96,325,42,140,60,429,738,21,622,301,34,37,71,8,32,39,14,11,26,33,130,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 24755,
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

  it('Search: #h include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#h include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
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

  it('Search: #h#v include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#h#v include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
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
      countByBookId: [0,82,87,84,85,104,77,38,1,58,40,77,52,68,145,52,63,29,12,20,5,24,2,96,89,2,111,89,9,10,7,1,3,6,4,1,4,6,22,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 2188,
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
      countByBookId: [0,133,56,3,55,37,23,80,14,117,103,66,96,17,44,4,17,19,203,138,35,38,14,121,146,12,56,13,10,7,20,4,10,16,7,10,1,6,26,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 2244,
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
      countByBookId: [0,109,66,32,85,61,84,46,2,54,40,37,47,30,35,2,2,0,5,8,2,3,1,21,48,0,81,8,3,2,2,0,2,1,0,2,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 1080,
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
      countByBookId: [0,40,4,0,15,4,4,18,3,36,8,5,11,4,4,13,33,0,17,108,7,3,2,3,10,4,9,10,3,1,1,0,2,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 444,
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

  it('Search: #preposition/particle include:variants', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#preposition/particle include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
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
      totalHits: 630,
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
      countByBookId: [0,96,99,86,59,158,24,59,4,91,63,57,78,34,70,6,18,21,76,221,75,23,6,105,69,7,85,46,18,2,5,4,1,5,1,6,1,5,11,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 2062,
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
      countByBookId: [0,801,703,389,649,632,374,366,22,453,325,450,418,596,567,217,307,96,364,1170,277,102,64,673,768,81,782,203,108,49,100,15,24,64,30,30,30,12,109,27,389,174,306,193,374,73,88,39,32,32,22,21,29,11,30,16,13,2,85,27,25,20,11,0,3,8,171],
      totalHits: 23808,
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

  // it('Search: #G15190 #G20640 same:verses:3', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#G15190 #G20640 same:verses:3", hebrewOrdering: false, offset: 0, limit: 0) {
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

  // it('Search: #G24140 include:variants', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#G24140 include:variants", hebrewOrdering: false, offset: 0, limit: 0) {
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

  it('Search: #H19790', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#H19790", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 5,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 6,
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

  it('Search: #noun', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#noun", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [0,1529,1208,858,1286,952,658,618,83,810,689,817,716,943,822,279,405,167,1038,2508,899,217,117,1282,1361,152,1271,353,197,73,145,21,48,105,47,56,53,38,209,55,1010,631,1080,836,989,411,403,236,139,152,95,91,80,43,109,77,42,23,297,104,102,61,99,13,15,24,401],
      totalHits: 172770,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,956,577,967,790,947,361,327,193,106,142,73,88,70,36,89,64,41,18,242,90,78,52,99,11,13,19,395],
      totalHits: 19830,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,5,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 17,
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
      countByBookId: [0,506,430,322,476,345,228,233,29,277,242,319,286,284,306,130,164,79,262,644,465,129,42,413,385,37,508,170,39,28,54,5,21,29,12,17,17,19,77,21,423,246,439,301,461,184,191,94,45,66,36,37,26,12,76,41,39,9,162,60,68,41,37,7,11,18,253],
      totalHits: 19471,
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
      countByBookId: [0,320,231,249,192,301,105,133,24,233,162,151,123,101,166,36,44,37,285,460,136,82,15,338,445,27,254,75,62,28,37,5,9,31,7,13,15,6,44,21,1021,662,1095,809,956,385,392,232,134,121,86,75,75,43,96,70,34,18,270,99,93,58,98,12,11,20,386],
      totalHits: 24032,
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
      countByBookId: [0,289,155,30,157,151,100,115,24,183,155,153,143,79,132,51,31,14,131,182,47,31,5,245,367,8,297,78,39,10,43,4,4,23,8,8,10,11,42,9,614,372,578,587,565,273,304,186,96,65,66,48,63,26,62,38,22,9,206,60,58,36,66,8,10,16,175],
      totalHits: 11966,
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
      countByBookId: [0,1022,785,616,699,672,401,449,68,604,526,598,515,367,545,147,218,115,517,1003,221,115,74,671,964,72,905,265,127,38,84,11,41,65,21,34,27,27,141,35,692,442,797,619,815,322,255,217,107,130,86,87,70,43,69,60,30,18,231,71,80,50,85,10,12,20,316],
      totalHits: 34863,
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
      countByBookId: [0,483,280,279,304,366,212,203,33,272,185,237,203,176,193,83,114,47,145,306,71,86,23,320,490,19,419,131,55,10,35,5,12,28,6,10,14,16,87,27,942,602,1058,810,880,363,363,224,125,132,98,89,82,46,81,66,32,25,254,92,90,50,98,13,15,25,365],
      totalHits: 27394,
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
      countByBookId: [0,1060,862,651,654,762,400,451,64,634,486,594,535,339,544,118,171,120,521,865,308,164,49,727,1059,71,794,285,105,39,88,17,28,55,23,32,31,20,136,45,89,39,68,60,48,22,42,14,8,2,3,4,2,0,1,0,0,0,10,10,0,0,6,0,1,0,6],
      totalHits: 30062,
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
      countByBookId: [0,1458,1133,836,1088,933,525,616,85,801,666,782,716,550,803,176,278,163,1040,2431,845,211,98,1275,1345,152,1204,352,195,72,145,21,48,104,46,54,50,36,205,53,1062,674,1130,879,1005,408,409,239,143,146,98,93,85,44,104,78,43,18,296,105,100,59,105,13,15,24,395],
      totalHits: 101810,
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
      countByBookId: [0,1404,1043,707,1014,897,501,599,79,779,637,738,692,429,731,90,234,149,888,1945,694,199,87,1193,1287,134,1138,144,179,67,130,18,47,99,39,51,47,35,192,53,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 50186,
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
      countByBookId: [ 0,106,317,403,243,350,72,47,11,99,52,85,53,24,40,1,13,5,34,37,31,14,2,308,343,1,443,42,37,17,46,8,1,28,2,2,15,2,51,27,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 5682,
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
      countByBookId: [0,1086,522,109,463,157,317,519,62,610,497,506,530,267,537,60,141,87,164,260,28,3,1,160,314,26,325,58,28,4,23,0,38,5,4,10,2,9,64,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 14976,
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
      countByBookId: [0,54,19,0,11,16,1,20,2,19,20,10,11,7,4,1,7,0,18,112,8,2,5,25,29,2,2,1,4,0,1,1,3,5,0,2,0,0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 572,
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
      countByBookId: [0,62,37,15,24,19,15,20,11,48,40,42,39,11,26,4,10,14,36,123,84,17,5,42,79,7,15,14,6,8,2,3,2,6,0,1,2,1,8,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 1143,
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
      countByBookId: [0,39,77,26,135,65,25,19,4,32,31,61,56,30,62,30,34,19,25,80,33,14,12,98,80,8,101,33,11,3,5,2,1,6,6,2,6,2,10,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 1467,
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
      countByBookId: [0,47,54,37,37,54,20,21,2,44,28,19,21,9,12,1,9,12,15,13,17,17,1,51,101,5,35,6,6,2,6,0,3,5,3,4,1,2,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 881,
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
      countByBookId: [0,352,262,170,265,311,144,173,28,250,199,245,201,140,305,70,73,69,95,242,108,61,5,229,370,19,332,93,29,7,33,4,17,13,2,13,6,15,53,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 6604,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,716,471,784,665,645,301,343,193,105,101,76,70,64,32,92,49,31,14,225,83,71,44,101,12,14,18,298],
      totalHits: 11557,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,239,83,210,124,85,81,60,30,18,6,14,6,4,4,8,17,0,3,38,17,9,10,4,2,3,1,76],
      totalHits: 1628,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,845,549,925,663,844,224,200,133,86,77,43,50,45,27,41,48,15,11,187,59,64,30,44,5,8,14,321],
      totalHits: 11857,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,16,31,16,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
      totalHits: 86,
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
      countByBookId: [0,653,388,166,323,368,281,308,46,436,361,429,440,285,436,107,153,95,394,960,161,110,51,604,824,118,558,226,102,39,79,10,21,41,28,24,23,23,103,40,105,84,159,222,149,68,85,50,27,16,17,17,15,6,17,21,6,2,76,17,13,17,48,3,2,8,90],
      totalHits: 16999,
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
      countByBookId: [0,364,475,544,403,536,108,147,31,245,196,193,159,63,124,40,50,34,701,1132,466,111,27,760,570,48,487,155,126,30,83,11,12,65,19,40,26,8,90,23,130,228,267,214,321,13,14,9,15,4,4,3,2,2,0,0,1,1,23,3,6,3,5,1,1,2,38],
      totalHits: 16074,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1012,653,1074,873,968,332,370,199,133,88,70,68,56,30,72,57,23,15,243,86,55,47,102,13,15,16,369],
      totalHits: 15630,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,202,155,174,216,64,59,111,54,28,26,18,18,13,12,19,10,14,5,55,19,16,4,41,4,4,0,62],
      totalHits: 1861,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,11,1,15,12,3,0,3,0,0,0,3,3,0,3,0,1,1,0,3,1,0,0,0,2,0],
      totalHits: 68,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,203,151,310,128,362,85,81,50,28,28,27,10,34,17,28,17,14,3,81,20,17,10,6,3,4,5,77],
      totalHits: 2294,
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
      countByBookId: [0,266,253,128,321,85,133,137,14,130,111,162,148,187,152,96,79,38,33,21,23,21,10,41,47,0,203,71,3,1,17,1,4,3,0,0,1,8,30,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 6368,
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
      countByBookId: [0,37,61,49,51,11,15,12,1,11,10,30,16,57,18,14,17,10,1,2,2,4,0,6,24,0,24,16,2,0,0,0,1,0,0,0,0,8,11,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 630,
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
      countByBookId: [0,68,33,4,118,52,71,90,8,163,102,45,29,150,86,21,65,44,14,10,1,0,1,9,33,0,17,9,0,2,5,2,1,1,2,0,2,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 1744,
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
      countByBookId: [0,1076,646,361,913,578,591,517,58,703,581,631,606,871,678,221,283,135,127,914,102,6,27,645,1010,55,647,153,124,35,109,14,35,64,18,18,36,29,146,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 33282,
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
      countByBookId: [0,87,44,14,36,52,24,33,7,57,42,42,37,13,50,11,18,7,48,81,37,43,3,64,65,10,28,21,13,7,5,1,1,2,2,0,6,0,12,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 1154,
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
      countByBookId: [0,55,12,0,14,1,3,23,0,31,25,18,29,3,3,1,5,0,22,12,0,0,1,15,26,2,5,3,0,0,2,0,2,4,0,0,0,4,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 355,
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
      countByBookId: [0,248,232,223,170,332,96,145,23,201,132,171,180,59,155,27,63,34,310,424,227,83,15,370,470,46,259,95,57,16,56,8,9,29,15,16,16,7,43,17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 6881,
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
      countByBookId: [0,640,590,428,423,411,275,264,24,366,273,353,343,233,326,23,86,77,39,129,20,56,17,166,525,7,427,35,34,13,35,5,12,16,1,3,14,8,69,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 10984,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,272,159,273,179,269,111,123,49,27,39,22,20,15,6,40,20,18,8,109,36,45,21,20,3,8,12,133],
      totalHits: 2840,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,116,49,108,72,90,64,62,34,14,13,12,7,8,3,17,7,10,1,36,16,9,6,14,0,2,0,51],
      totalHits: 938,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,98,65,113,57,153,31,38,23,7,17,7,11,4,5,32,23,21,1,56,25,29,26,7,3,1,10,104],
      totalHits: 1201,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,19,18,13,31,10,3,0,0,4,0,4,1,0,1,1,1,1,7,3,0,0,5,2,1,0,48],
      totalHits: 200,
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
      countByBookId: [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,922,554,917,774,905,340,305,181,99,133,66,84,67,36,66,60,32,18,230,81,72,48,96,11,13,19,382],
      totalHits: 16537,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27,8,30,28,20,14,26,11,4,2,4,1,2,0,10,2,3,0,9,4,3,6,0,1,0,4,16],
      totalHits: 251,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26,10,26,63,51,23,35,10,6,12,6,14,3,1,13,2,0,5,24,14,6,7,6,0,1,2,9],
      totalHits: 417,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,110,62,158,43,214,52,51,37,14,31,24,25,15,12,27,9,9,3,33,15,9,4,15,1,0,4,64],
      totalHits: 1183,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,6,15,10,16,0,5,2,0,1,1,0,0,0,1,1,1,0,5,1,1,1,1,0,0,1,31],
      totalHits: 133,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,44,37,75,64,53,35,30,26,11,15,8,3,13,7,8,5,2,2,20,6,7,2,6,1,2,6,12],
      totalHits: 536,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,5,11,14,8,13,4,1,5,4,1,2,5,1,0,0,1,0,1,3,4,0,6,1,0,0,2],
      totalHits: 100,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #transitive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#transitive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 0,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #intransitive', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#intransitive", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 0,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #linking', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#linking", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 0,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #modal', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#modal", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 0,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #periphrastic', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#periphrastic", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      totalHits: 0,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  it('Search: #exclamation', async () => {
    const bibleSearchResults = await doQuery(`
      bibleSearchResults(query: "#exclamation", hebrewOrdering: false, offset: 0, limit: 0) {
        ${bibleSearchResultsQuery}
      }
    `)

    bibleSearchResults.should.eql({
      results: [],
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,47,20,21,27,5,9,3,1,3,1,2,0,1,0,3,1,0,1,1,2,2,1,0,0,0,2,16],
      totalHits: 206,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,65,19,55,21,24,2,1,5,2,0,0,0,0,0,0,0,0,0,4,6,1,0,0,0,0,1,28],
      totalHits: 242,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,1,9,7,3,2,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,4],
      totalHits: 36,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,100,49,89,48,78,29,22,19,7,7,6,1,4,0,11,3,2,1,29,5,3,2,6,0,1,3,56],
      totalHits: 629,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,61,25,30,60,115,73,72,39,16,12,27,4,20,7,15,12,3,3,53,7,25,6,10,5,4,6,17],
      totalHits: 1492,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,968,644,1057,726,914,348,340,203,113,104,72,64,66,39,79,64,28,14,241,89,64,54,77,10,10,19,376],
      totalHits: 13124,
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
      countByBookId: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,344,233,343,425,249,149,224,130,73,48,41,31,32,22,37,22,18,12,103,44,55,17,75,6,3,6,169],
      totalHits: 3710,
      otherSuggestedQueries: [
        // {
        //   suggestedQuery: ``,
        //   resultCount: 1,
        // },
      ],
    })
  })

  // it('Search: #TEMP', async () => {
  //   const bibleSearchResults = await doQuery(`
  //     bibleSearchResults(query: "#TEMP", hebrewOrdering: false, offset: 0, limit: 0) {
  //       ${bibleSearchResultsQuery}
  //     }
  //   `)

  //   bibleSearchResults.should.eql({
  //     results: [],
  //     countByBookId: [],
  //     totalHits: 0000,
  //     otherSuggestedQueries: [
  //       // {
  //       //   suggestedQuery: ``,
  //       //   resultCount: 1,
  //       // },
  //     ],
  //   })
  // })

})