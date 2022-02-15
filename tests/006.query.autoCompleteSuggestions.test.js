const { doQuery } = require('./testUtils')

const autoCompleteSuggestionsQuery = `
  from
  suggestedQuery
  originalWords
  resultCount
`

describe('Query: autoCompleteSuggestions', async () => {

  it('Search: #H43', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "#H43", languageId: "eng") {
        ${autoCompleteSuggestionsQuery}
      }
    `)

    autoCompleteSuggestions.should.eql([
      {
        from: "look-up",
        originalWords: {
          H00430: {
            gloss: "Ebjasaph",
            lex: "אֶבְיָסָף",
          },
        },
        resultCount: null,
        suggestedQuery: "#H00430",
      },
      {
        from: "look-up",
        originalWords: {
          H43000: {
            gloss: "an iron bar",
            lex: "מְטִיל",
          },
        },
        resultCount: null,
        suggestedQuery: "#H43000",
      },
      {
        from: "look-up",
        originalWords: {
          H43010: {
            gloss: "hidden treasure, treasure",
            lex: "מַטְמוֹן",
          },
        },
        resultCount: null,
        suggestedQuery: "#H43010",
      },
      {
        from: "look-up",
        originalWords: {
          H43020: {
            gloss: "place, act of planting, plantation",
            lex: "מַטָּע",
          },
        },
        resultCount: null,
        suggestedQuery: "#H43020",
      },
    ])
  })

  // it('Search: #H43', async () => {
  //   const autoCompleteSuggestions = await doQuery(`
  //     autoCompleteSuggestions(incompleteQuery: "#H43", languageId: "eng") {
  //       ${autoCompleteSuggestionsQuery}
  //     }
  //   `)

  //   autoCompleteSuggestions.should.eql([
  //   ])
  // })

})