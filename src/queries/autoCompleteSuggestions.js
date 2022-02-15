const { Op } = require('sequelize')
const { containsHebrewChars, stripGreekAccents, stripHebrewVowelsEtc, stripVocalOfAccents } = require('@bibletags/bibletags-ui-helper')

const SUGGESTIONS_LIMIT = 4

const safeifyForLike = str => str.replace(/_/g, ' ').replace(/%/g, '')

const getStrongsFromQueryStr = str => (str.match(/#[GH][0-9]{5}/g) || []).map(s => s.replace(/^#/, ''))

const getOriginalWordsFromStrongs = async ({ includeHits, strongs, where, languageId, limit, models }) => {

  const originalWords = {}

  const definitions = await models.definition.findAll({
    where: where || {
      id: strongs,
    },
    include: [
      {
        model: models.languageSpecificDefinition,
        attributes: [ 'gloss' ],
        required: false,
        where: {
          languageId,
        },
      },
    ],
    limit,
  })

  definitions.forEach(({ id, lex, hits, languageSpecificDefinitions=[] }) => {
    const gloss = (languageSpecificDefinitions[0] || {}).gloss || ''
    originalWords[id] = { lex, gloss }
    if(includeHits) {
      originalWords[id].hits = hits
    }
  })

  return originalWords

}

const getDefDetailArrayFromProceedingStrongs = async ({ queryStrProceedingDetail, detailType, partialDetail, limit, models }) => {

  const [ strongDetailOnSameWord ] = queryStrProceedingDetail.split(' ').pop().match(/#[GH][0-9]{5}/) || []
  let detailArray = null

  if(strongDetailOnSameWord) {
    detailArray = []
    const definition = await models.definition.findByPk(strongDetailOnSameWord.replace(/^#/, ''))
    if(definition) {
      detailArray = (
        definition[detailType]
          .filter(detail => stripGreekAccents(stripHebrewVowelsEtc(detail)).toLowerCase().indexOf(partialDetail) === 0)
          .slice(0, limit)
          .map(id => ({ id }))
      )
    }
  }

  return detailArray
}

const autoCompleteSuggestions = async (args, req, queryInfo) => {

  const { incompleteQuery, languageId } = args

  const { models } = global.connection
  const suggestions = []

  // 1. check commonQueryItem table

  // TODO: should function just like in biblearc-data

  // const commonQueryItems = await models.commonQueryItem.findAll({
  //   where: {
  //     ...(!incompleteQuery ? {} : {
  //       [Op.or]: [
  //         {
  //           query: {
  //             [Op.like]: `${safeifyForLike(incompleteQuery)}%`
  //           },
  //         },
  //         {
  //           preAutoCompleteQuery: {
  //             [Op.like]: `${safeifyForLike(incompleteQuery)}%`
  //           },
  //         },
  //       ],
  //     }),
  //   },
  //   order: [ [ 'numUsagesInLastPeriod', 'DESC' ] ],
  //   limit: SUGGESTIONS_LIMIT - suggestions.length,
  // })

  // commonQueryItems.forEach(({ query, originalWords, resultCount }) => {
  //   suggestions.push({
  //     from: `common-query`,
  //     suggestedQuery: query,
  //     originalWords: originalWords || {},
  //     resultCount,
  //   })
  // })

  if(suggestions.length === SUGGESTIONS_LIMIT) return suggestions

  // 2. look-up in Bible tables

  const limit = SUGGESTIONS_LIMIT - suggestions.length

  if(/(?:^ )=[^#+~*=[\]\/(). ]+$/i.test(incompleteQuery)) {  // translated to
    // TODO

  } else if(/#(not:)?lemma:[^#+~*=[\]\/(). ]*$/i.test(incompleteQuery)) {  // lemma
    // lemmas matching partial naked lemma
    // table: lemmas

    let [ x, queryStrProceedingDetail, negator='', partialDetail ] = incompleteQuery.match(/^(.*)#(not:)?lemma:([^#+~*=[\]\/(). ]*)$/i)
    partialDetail = stripGreekAccents(stripHebrewVowelsEtc(partialDetail)).toLowerCase()

    const [ lemmas, originalWords ] = await Promise.all([
      (async () => {

        let lemmas = await getDefDetailArrayFromProceedingStrongs({ queryStrProceedingDetail, detailType: "lemmas", partialDetail, limit, models })

        if(!lemmas && partialDetail) {  // i.e. there wasn't a proceeeding strongs
          lemmas = await models.lemma.findAll({
            where: {
              nakedLemma: {
                [Op.like]: `${safeifyForLike(partialDetail)}%`
              },
            },
            limit,
          })
        }

        return lemmas || []

      })(),
      getOriginalWordsFromStrongs({ strongs: getStrongsFromQueryStr(queryStrProceedingDetail), languageId, models }),
    ])

    lemmas.forEach(({ id: lemma }) => {
      suggestions.push({
        from: `look-up`,
        suggestedQuery: `${queryStrProceedingDetail}#${negator}lemma:${lemma}`,
        originalWords,
      })
    })

  } else if(/#(not:)?form:[^#+~*=[\]\/(). ]*$/i.test(incompleteQuery)) {  // form
    // forms matching partial naked form
    // table: unitWords

    let [ x, queryStrProceedingDetail, negator='', partialDetail ] = incompleteQuery.match(/^(.*)#(not:)?form:([^#+~*=[\]\/(). ]*)$/i)
    partialDetail = stripGreekAccents(stripHebrewVowelsEtc(partialDetail)).toLowerCase()

    const [ forms, originalWords ] = await Promise.all([
      (async () => {

        let forms = await getDefDetailArrayFromProceedingStrongs({ queryStrProceedingDetail, detailType: "forms", partialDetail, limit, models })

        if(!forms && partialDetail) {  // i.e. there wasn't a proceeeding strongs
          const versionId = containsHebrewChars(partialDetail) ? `uhb` : `ugnt`
          forms = await models[`${versionId}UnitWord`].findAll({
            where: {
              id: {
                [Op.like]: `verseNumber:form:${safeifyForLike(partialDetail)}%`
              },
            },
            limit,
          })
        }

        return forms || []

      })(),
      getOriginalWordsFromStrongs({ strongs: getStrongsFromQueryStr(queryStrProceedingDetail), languageId, models }),
    ])

    forms.forEach(({ id }) => {
      const form = id.replace(/^verseNumber:form:/, '')
      suggestions.push({
        from: `look-up`,
        suggestedQuery: `${queryStrProceedingDetail}#${negator}form:${form}`,
        originalWords,
      })
    })

  } else if(/#(not:)?[0-9a-z\u0590-\u05FF\u0370-\u03FF\u1F00-\u1FFF]+$|^[\u0590-\u05FF\u0370-\u03FF\u1F00-\u1FFF]+$/i.test(incompleteQuery)) {  // strongs

    const [ x, queryStrProceedingDetail, negator='', partialDetail ] = (
      incompleteQuery.match(/^(.*)#(not:)?([0-9a-z\u0590-\u05FF\u0370-\u03FF\u1F00-\u1FFF]+)$/i)
      || incompleteQuery.match(/^()()([\u0590-\u05FF\u0370-\u03FF\u1F00-\u1FFF]+)$/i)
    )

    let where

    if(/[GH][0-9]+/.test(partialDetail)) {
      // G1 - [G00001], G0001?, G1????
      // G12 - G00012, G0012?, G12???
      // G123 - G00123, G0123?, G123??
      const headLetter = partialDetail[0].toUpperCase()
      const strongsAsInt = parseInt(partialDetail.slice(1), 10)
      where = {
        [Op.or]: [
          {
            id: `${headLetter}${`0000${strongsAsInt}`.slice(-5)}`,
          },
          {
            id: {
              [Op.like]: `${headLetter}${`000${strongsAsInt}`.slice(-4)}%`,
            },
          },
          {
            id: {
              [Op.like]: `${partialDetail.toUpperCase()}%`,
            },
          },
        ],
      }

    } else if(/[\u0590-\u05FF\u0370-\u03FF\u1F00-\u1FFF]/.test(partialDetail)) {  // Greek or Hebrew
      where = {
        nakedLex: {
          [Op.like]: `${safeifyForLike(stripGreekAccents(stripHebrewVowelsEtc(partialDetail)).toLowerCase())}%`,
        },
      }

    } else {
      where = {
        simplifiedVocal: {
          [Op.like]: `${safeifyForLike(stripVocalOfAccents(partialDetail))}%`,
        },
      }
    }

    const includeHits = (!queryStrProceedingDetail && !negator)

    const [ originalWords, originalWordsForSuggestions ] = await Promise.all([
      getOriginalWordsFromStrongs({ strongs: getStrongsFromQueryStr(queryStrProceedingDetail), languageId, models }),
      getOriginalWordsFromStrongs({ includeHits, where, languageId, limit, models }),
    ])

    for(let strongs in originalWordsForSuggestions) {
      const { hits: resultCount, ...originalWordsInfo } = originalWordsForSuggestions[strongs]
      suggestions.push({
        from: `look-up`,
        suggestedQuery: `${queryStrProceedingDetail}#${negator}${strongs}`,
        originalWords: {
          ...originalWords,
          [strongs]: originalWordsInfo,
        },
        ...(!resultCount ? {} : { resultCount }),
      })
    }

  }

  return suggestions

}

module.exports = autoCompleteSuggestions