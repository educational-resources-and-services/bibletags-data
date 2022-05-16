const { getCorrespondingRefs, getLocFromRef, getRefFromLoc } = require('@bibletags/bibletags-versification')

const { getOrigLangVersionIdFromLoc } = require('./utils')

const getWordInfoSetKey = ({ version, loc }) => `${loc}-${version.id}`

const getWordInfoByIdAndPart = async ({
  version,
  loc,
  locAndVersionCombos,  // must all be in the same testament
  t,
}) => {

  const { models } = global.connection

  if(!loc && locAndVersionCombos.length === 0) return {}

  const origLangVersionId = getOrigLangVersionIdFromLoc(loc || locAndVersionCombos[0].loc)

  const versionLocAndOriginalRefsCombos = (
    (locAndVersionCombos || [{ version, loc }]).map(({ version, loc }) => ({
      version,
      loc,
      originalRefs: getCorrespondingRefs({
        baseVersion: {
          info: version,
          ref: getRefFromLoc(loc),
        },
        lookupVersionInfo: {
          versificationModel: 'original',
        },
      }),
    }))
  )

  const wordRangesByOriginalLoc = {}
  versionLocAndOriginalRefsCombos.forEach(({ originalRefs }) => {
    (originalRefs || []).forEach(ref => {
      const [ loc, wordRangesStr ] = getLocFromRef(ref).split(':')
      wordRangesByOriginalLoc[loc] = wordRangesStr && wordRangesStr.split(',').map(wordRange => wordRange.split('-'))
    })
  })

  if(Object.values(wordRangesByOriginalLoc).length === 0) return {}

  const verses = await models[`${origLangVersionId}Verse`].findAll({
    where: {
      loc: Object.keys(wordRangesByOriginalLoc),
    },
    transaction: t,
  })

  const wordInfoSetByKey = {}
  versionLocAndOriginalRefsCombos.forEach(({ version, loc, originalRefs }) => {

    const wordInfoByIdAndPart = {}

    if(originalRefs) {
      verses.forEach(verse => {
        if(!originalRefs.some(ref => getLocFromRef(ref).split(':')[0] === verse.loc)) return

        let wordPartNumberInVerse = 1
        const usfmWords = verse.usfm.match(/\\w [^|]*\|lemma="[^"]*" strong="[^"]+" x-morph="[^"]+" x-id="[^"]+"\\w\*/g)
        usfmWords.forEach((usfmWord, idx) => {

          if(
            wordRangesByOriginalLoc[verse.loc]
            && !wordRangesByOriginalLoc[verse.loc].some(([ start, end ]) => (idx+1 >= start && idx+1 <= end))
          ) return

          const [ x, strong, morph, id ] = usfmWord.match(/\\w [^|]*\|lemma="[^"]*" strong="([^"]+)" x-morph="([^"]+)" x-id="([^"]+)"\\w\*/)
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
    }

    wordInfoSetByKey[getWordInfoSetKey({ version, loc })] = wordInfoByIdAndPart
  })

  if(!locAndVersionCombos) {
    return wordInfoSetByKey[getWordInfoSetKey({ version, loc })]
  }

  return wordInfoSetByKey
}

module.exports = getWordInfoByIdAndPart