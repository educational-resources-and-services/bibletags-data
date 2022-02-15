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
        resultCount: 3,
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
        resultCount: 1,
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
        resultCount: 5,
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
        resultCount: 6,
        suggestedQuery: "#H43020",
      },
    ])
  })

  it('Search: #H01200 #b#H43', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "#H01200 #b#H43", languageId: "eng") {
        ${autoCompleteSuggestionsQuery}
      }
    `)

    autoCompleteSuggestions.should.eql([
      {
        from: "look-up",
        originalWords: {
          H01200: {
            gloss: "man, mankind",
            lex: "אָדָם",
          },          
          H00430: {
            gloss: "Ebjasaph",
            lex: "אֶבְיָסָף",
          },
        },
        resultCount: null,
        suggestedQuery: "#H01200 #b#H00430",
      },
      {
        from: "look-up",
        originalWords: {
          H01200: {
            gloss: "man, mankind",
            lex: "אָדָם",
          },          
          H43000: {
            gloss: "an iron bar",
            lex: "מְטִיל",
          },
        },
        resultCount: null,
        suggestedQuery: "#H01200 #b#H43000",
      },
      {
        from: "look-up",
        originalWords: {
          H01200: {
            gloss: "man, mankind",
            lex: "אָדָם",
          },          
          H43010: {
            gloss: "hidden treasure, treasure",
            lex: "מַטְמוֹן",
          },
        },
        resultCount: null,
        suggestedQuery: "#H01200 #b#H43010",
      },
      {
        from: "look-up",
        originalWords: {
          H01200: {
            gloss: "man, mankind",
            lex: "אָדָם",
          },          
          H43020: {
            gloss: "place, act of planting, plantation",
            lex: "מַטָּע",
          },
        },
        resultCount: null,
        suggestedQuery: "#H01200 #b#H43020",
      },
    ])
  })

  it('Search: #not:H43', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "#not:H43", languageId: "eng") {
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
        suggestedQuery: "#not:H00430",
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
        suggestedQuery: "#not:H43000",
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
        suggestedQuery: "#not:H43010",
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
        suggestedQuery: "#not:H43020",
      },
    ])
  })

  it('Search: #elo', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "#elo", languageId: "eng") {
        ${autoCompleteSuggestionsQuery}
      }
    `)

    autoCompleteSuggestions.should.eql([
      {
        from: "look-up",
        originalWords: {
          G16820: {
            gloss: "Aramaic for my God",
            lex: "ἐλοΐ",
          },
        },
        resultCount: 4,
        suggestedQuery: "#G16820",
      },
      {
        from: "look-up",
        originalWords: {
          H04300: {
            gloss: "God, god",
            lex: "אֱלֹהִים",
          },
        },
        resultCount: 2598,
        suggestedQuery: "#H04300",
      },
      {
        from: "look-up",
        originalWords: {
          H04330: {
            gloss: "god, God",
            lex: "אֱלוֹהַּ",
          },
        },
        resultCount: 60,
        suggestedQuery: "#H04330",
      },
      {
        from: "look-up",
        originalWords: {
          H04360: {
            gloss: "terebinth",
            lex: "אֵלוֹן",
          },
        },
        resultCount: 9,
        suggestedQuery: "#H04360",
      },
    ])
  })

  it('Search: #λογ', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "#λογ", languageId: "eng") {
        ${autoCompleteSuggestionsQuery}
      }
    `)

    autoCompleteSuggestions.should.eql([
      {
        from: "look-up",
        originalWords: {
          G30480: {
            gloss: "a collection, collecting",
            lex: "λογία",
          },
        },
        resultCount: 2,
        suggestedQuery: "#G30480",
      },
      {
        from: "look-up",
        originalWords: {
          G30490: {
            gloss: "I reckon, count, decide",
            lex: "λογίζομαι",
          },
        },
        resultCount: 41,
        suggestedQuery: "#G30490",
      },
      {
        from: "look-up",
        originalWords: {
          G30500: {
            gloss: "reasonable, rational, metaphorical",
            lex: "λογικός",
          },
        },
        resultCount: 2,
        suggestedQuery: "#G30500",
      },
      {
        from: "look-up",
        originalWords: {
          G30510: {
            gloss: "divine communication",
            lex: "λόγιον",
          },
        },
        resultCount: 4,
        suggestedQuery: "#G30510",
      },
    ])
  })

  it('Search: =test', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "=test", languageId: "eng") {
        ${autoCompleteSuggestionsQuery}
      }
    `)

    autoCompleteSuggestions.should.eql([
    ])
  })

  it('Search: #lemma:βαρ', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "#lemma:βαρ", languageId: "eng") {
        ${autoCompleteSuggestionsQuery}
      }
    `)

    autoCompleteSuggestions.should.eql([
      {
        from: "look-up",
        originalWords: {},
        resultCount: null,
        suggestedQuery: "#lemma:Βαραββᾶς",
      },
      {
        from: "look-up",
        originalWords: {},
        resultCount: null,
        suggestedQuery: "#lemma:Βαράκ",
      },
      {
        from: "look-up",
        originalWords: {},
        resultCount: null,
        suggestedQuery: "#lemma:Βαραχίας",
      },
      {
        from: "look-up",
        originalWords: {},
        resultCount: null,
        suggestedQuery: "#lemma:βάρβαρος",
      },
    ])
  })

  it('Search: #G00140#lemma:', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "#G00140#lemma:", languageId: "eng") {
        ${autoCompleteSuggestionsQuery}
      }
    `)

    autoCompleteSuggestions.should.eql([
      {
        from: "look-up",
        originalWords: {
          G00140: {
            gloss: "I perform good deeds",
            lex: "ἀγαθοεργέω",
          },
        },
        resultCount: null,
        suggestedQuery: "#G00140#lemma:ἀγαθουργέω",
      },
      {
        from: "look-up",
        originalWords: {
          G00140: {
            gloss: "I perform good deeds",
            lex: "ἀγαθοεργέω",
          },
        },
        resultCount: null,
        suggestedQuery: "#G00140#lemma:ἀγαθοεργέω",
      },
    ])
  })

  it('Search: #G00140#lemma:ἀγαθου', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "#G00140#lemma:ἀγαθου", languageId: "eng") {
        ${autoCompleteSuggestionsQuery}
      }
    `)

    autoCompleteSuggestions.should.eql([
      {
        from: "look-up",
        originalWords: {
          G00140: {
            gloss: "I perform good deeds",
            lex: "ἀγαθοεργέω",
          },
        },
        resultCount: null,
        suggestedQuery: "#G00140#lemma:ἀγαθουργέω",
      },
    ])
  })

  it('Search: #G00140#lemma:αγαθου', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "#G00140#lemma:αγαθου", languageId: "eng") {
        ${autoCompleteSuggestionsQuery}
      }
    `)

    autoCompleteSuggestions.should.eql([
      {
        from: "look-up",
        originalWords: {
          G00140: {
            gloss: "I perform good deeds",
            lex: "ἀγαθοεργέω",
          },
        },
        resultCount: null,
        suggestedQuery: "#G00140#lemma:ἀγαθουργέω",
      },
    ])
  })

  it('Search: #form:βαρ', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "#form:βαρ", languageId: "eng") {
        ${autoCompleteSuggestionsQuery}
      }
    `)

    autoCompleteSuggestions.should.eql([
      {
        from: "look-up",
        originalWords: {},
        resultCount: null,
        suggestedQuery: "#form:βαραββαν",
      },
      {
        from: "look-up",
        originalWords: {},
        resultCount: null,
        suggestedQuery: "#form:βαραββας",
      },
      {
        from: "look-up",
        originalWords: {},
        resultCount: null,
        suggestedQuery: "#form:βαρακ",
      },
      {
        from: "look-up",
        originalWords: {},
        resultCount: null,
        suggestedQuery: "#form:βαραχιου",
      },
    ])
  })

  it('Search: #G00320#form:', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "#G00320#form:", languageId: "eng") {
        ${autoCompleteSuggestionsQuery}
      }
    `)

    autoCompleteSuggestions.should.eql([
      {
        from: "look-up",
        originalWords: {
          G00320: {
            gloss: "an angel, messenger",
            lex: "ἄγγελος",
          },
        },
        resultCount: null,
        suggestedQuery: "#G00320#form:αγγελος",
      },
      {
        from: "look-up",
        originalWords: {
          G00320: {
            gloss: "an angel, messenger",
            lex: "ἄγγελος",
          },
        },
        resultCount: null,
        suggestedQuery: "#G00320#form:αγγελοις",
      },
      {
        from: "look-up",
        originalWords: {
          G00320: {
            gloss: "an angel, messenger",
            lex: "ἄγγελος",
          },
        },
        resultCount: null,
        suggestedQuery: "#G00320#form:αγγελοι",
      },
      {
        from: "look-up",
        originalWords: {
          G00320: {
            gloss: "an angel, messenger",
            lex: "ἄγγελος",
          },
        },
        resultCount: null,
        suggestedQuery: "#G00320#form:αγγελον",
      },
    ])
  })

  it('Search: #G00320#form:αγγελω', async () => {
    const autoCompleteSuggestions = await doQuery(`
      autoCompleteSuggestions(incompleteQuery: "#G00320#form:αγγελω", languageId: "eng") {
        ${autoCompleteSuggestionsQuery}
      }
    `)

    autoCompleteSuggestions.should.eql([
      {
        from: "look-up",
        originalWords: {
          G00320: {
            gloss: "an angel, messenger",
            lex: "ἄγγελος",
          }
        },
        resultCount: null,
        suggestedQuery: "#G00320#form:αγγελων",
      },
      {
        from: "look-up",
        originalWords: {
          G00320: {
            gloss: "an angel, messenger",
            lex: "ἄγγελος",
          }
        },
        resultCount: null,
        suggestedQuery: "#G00320#form:αγγελω",
      },
    ])
  })

})