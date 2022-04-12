const calculateTagSets = require('../calculateTagSets')
const tagSet = require('../queries/tagSet')
const getWordInfoByIdAndPart = require('../getWordInfoByIdAndPart')
const { equalObjs , getTagsJson} = require('../utils')

const submitTagSet = async (args, req, queryInfo) => {

  const { input } = args
  const { loc, versionId, wordsHash, deviceId, embeddingAppId, tagSubmissions } = input

  const { models } = global.connection

  // TODO: look for auth, else use the id of the user with email = user-[deviceId]@bibletags.org
  let [ user, embeddingApp ] = await Promise.all([
    models.user.findByPk(`user-${deviceId}@bibletags.org`),
    models.embeddingApp.findByPk(embeddingAppId),
  ])

  if(!embeddingApp) {
    throw `Invalid embeddingAppId. Please register via bibletags.org.`
  }

  if(!tagSubmissions || tagSubmissions.length === 0) {
    throw `No tags submitted.`
  }

  let origLangVersion
  tagSubmissions.forEach(tagSubmission => {

    if(tagSubmission.origWordsInfo.length === 0 && tagSubmission.translationWordsInfo.length === 0) {
      throw `All tags must include either origWordsInfo or translationWordsInfo with at least 1 item.`
    }

    tagSubmission.origWordsInfo.forEach(({ uhbWordId, ugntWordId }) => {

      if(!uhbWordId === !ugntWordId) {
        throw `Each tag must contain either a uhbWordId or ugntWordId, but not both. uhbWordId: ${uhbWordId} / ugntWordId: ${ugntWordId}`
      }

      const thisOrigLangVersion = uhbWordId ? 'uhb' : 'ugnt'

      if(origLangVersion && origLangVersion !== thisOrigLangVersion) {
        throw `All tags in a single tagSet submission must relate to a single original language text.`
      }

      origLangVersion = thisOrigLangVersion

    })
  })

  const version = await models.version.findByPk(versionId)
  const submissionOrigWordIdAndPartSets = []
  const submissionTranslationWordNumberSets = []
  tagSubmissions.forEach(({ origWordsInfo, translationWordsInfo }) => {
    submissionOrigWordIdAndPartSets.push(origWordsInfo.map(({ uhbWordId, ugntWordId, wordPartNumber }) => ugntWordId || `${uhbWordId}|${wordPartNumber}`))
    submissionTranslationWordNumberSets.push(translationWordsInfo.map(({ wordNumberInVerse }) => wordNumberInVerse))
  })

  // validate that every part of every orig word is covered, without repeats
  const wordInfoByIdAndPart = await getWordInfoByIdAndPart({ version, loc })
  if(
    !equalObjs(
      Object.keys(wordInfoByIdAndPart).sort(),
      submissionOrigWordIdAndPartSets.flat().sort(),
    )
  ) {
    throw `All original language word parts must be covered in tag set.`
  }

  // validate that every translation word is covered, without repeats
  const wordHashesSetSubmission = await models.wordHashesSetSubmission.findOne({
    attributes: [ 'id' ],
    where: {
      loc,
      versionId,
      wordsHash,
    },
    include: [
      {
        model: models.wordHashesSubmission,
        attributes: [ 'id', 'wordNumberInVerse' ],
        require: true,
      },
    ],
  })
  if(!wordHashesSetSubmission) {
    throw `Call to submitTagSet cannot proceed a call to submitWordHashesSet for the same verse`
  }
  if(
    !equalObjs(
      wordHashesSetSubmission.wordHashesSubmissions.map(({ wordNumberInVerse }) => wordNumberInVerse).sort(),
      submissionTranslationWordNumberSets.flat().sort(),
    )
  ) {
    throw `All translation word numbers must be covered in tag set.`
  }

  delete input.tagSubmissions

  await global.connection.transaction(async t => {

    if(!user) {
      user = await models.user.create({
        id: `user-${deviceId}@bibletags.org`,
        email: `user-${deviceId}@bibletags.org`,
        name: `ANONYMOUS`,
        languageId: `eng`,  // TODO
      })
    }

    input.userId = user.id

    const existingTagSetSubmission = await models.tagSetSubmission.findOne({
      where: {
        loc,
        versionId,
        wordsHash,
      },
      transaction: t,
    })

    if(existingTagSetSubmission) {
      await existingTagSetSubmission.destroy({transaction: t})
    }

    const tagSetSubmission = await models.tagSetSubmission.create(input, {transaction: t})
    const tagSetSubmissionId = tagSetSubmission.id

    await Promise.all(tagSubmissions.map(async tagSubmission => {

      const tagSetSubmissionItem = await models.tagSetSubmissionItem.create({ tagSetSubmissionId }, {transaction: t})
      const tagSetSubmissionItemId = tagSetSubmissionItem.id

      await Promise.all([
        models.tagSetSubmissionItemTranslationWord.bulkCreate(
          tagSubmission.translationWordsInfo.map(translationWordInfo => ({
            ...translationWordInfo,
            tagSetSubmissionItemId,
          })),
          {
            validate: true,
            transaction: t,
          },
        ),
        models[`${origLangVersion}TagSubmission`].bulkCreate(
          tagSubmission.origWordsInfo.map(origWordInfo => ({
            ...origWordInfo,
            tagSetSubmissionItemId,
          })),
          {
            validate: true,
            transaction: t,
          },
        ),
      ])

    }))

    // Recalculate tagSets here
    await calculateTagSets({
      loc,
      wordsHash,
      versionId,
      t,
    })

  })

  return await tagSet({ id: `${loc}-${versionId}-${wordsHash}` }, req, queryInfo)

}

module.exports = submitTagSet