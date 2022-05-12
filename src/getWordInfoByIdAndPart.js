const { getCorrespondingRefs, getLocFromRef, getRefFromLoc } = require('@bibletags/bibletags-versification')

const { getOrigLangVersionIdFromLoc } = require('./utils')

const getWordInfoByIdAndPart = async ({
  version,
  loc,
  t,
}) => {

  const { models } = global.connection

  const origLangVersionId = getOrigLangVersionIdFromLoc(loc)

  const originalRefs = getCorrespondingRefs({
    baseVersion: {
      info: version,
      ref: getRefFromLoc(loc),
    },
    lookupVersionInfo: {
      versificationModel: 'original',
    },
  })

  if(!originalRefs) return {}

  const wordRangesByLoc = {}
  originalRefs.forEach(ref => {
    const [ loc, wordRangesStr ] = getLocFromRef(ref).split(':')
    wordRangesByLoc[loc] = wordRangesStr && wordRangesStr.split(',').map(wordRange => wordRange.split('-'))
  })

  const verses = await models[`${origLangVersionId}Verse`].findAll({
    where: {
      loc: Object.keys(wordRangesByLoc),
    },
    transaction: t,
  })

  const wordInfoByIdAndPart = {}
  verses.forEach(verse => {
    let wordPartNumberInVerse = 1
    const usfmWords = verse.usfm.match(/\\w [^|]*\|lemma="[^"]+" strong="[^"]+" x-morph="[^"]+" x-id="[^"]+"\\w\*/g)
    usfmWords.forEach((usfmWord, idx) => {

      if(
        wordRangesByLoc[verse.loc]
        && !wordRangesByLoc[verse.loc].some(([ start, end ]) => (idx+1 >= start && idx+1 <= end))
      ) return

      const [ x, strong, morph, id ] = usfmWord.match(/\\w [^|]*\|lemma="[^"]+" strong="([^"]+)" x-morph="([^"]+)" x-id="([^"]+)"\\w\*/)
      const strongParts = `${strong}${(morph.match(/:S.*$/) || [``])[0]}`.split(':')

      morph.slice(3).split(':').forEach((morphPart, idx2) => {
        const wordIdAndPartNumber = `${id}${origLangVersionId === 'uhb' ? `|${idx2+1}` : ``}`
        wordInfoByIdAndPart[wordIdAndPartNumber] = {
          wordIdAndPartNumber,
          morphPart,
          strongPart: strongParts[idx2],
          wordPartNumberInVerse: wordPartNumberInVerse++,
        }
      })

    })
  })

  return wordInfoByIdAndPart
}

module.exports = getWordInfoByIdAndPart