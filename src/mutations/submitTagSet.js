const sendEmail = require('../email/sendEmail')
const calculateTagSets = require('../calculateTagSets')
const updatedTagSets = require('../queries/updatedTagSets')
const getWordInfoByIdAndPart = require('../getWordInfoByIdAndPart')
const { equalObjs , getTagsJson} = require('../utils')

const {
  adminEmail,
} = require('../constants')

const submitTagSet = async (args, req, queryInfo) => {

  const { input, updatedFrom } = args
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

  let origLangVersionId
  tagSubmissions.forEach(tagSubmission => {

    if(tagSubmission.origWordsInfo.length === 0 && tagSubmission.translationWordsInfo.length === 0) {
      throw `All tags must include either origWordsInfo or translationWordsInfo with at least 1 item.`
    }

    tagSubmission.origWordsInfo.forEach(({ uhbWordId, ugntWordId }) => {

      if(!uhbWordId === !ugntWordId) {
        throw `Each tag must contain either a uhbWordId or ugntWordId, but not both. uhbWordId: ${uhbWordId} / ugntWordId: ${ugntWordId}`
      }

      const thisOrigLangVersionId = uhbWordId ? 'uhb' : 'ugnt'

      if(origLangVersionId && origLangVersionId !== thisOrigLangVersionId) {
        throw `All tags in a single tagSet submission must relate to a single original language text.`
      }

      origLangVersionId = thisOrigLangVersionId

    })
  })

  // prep for next couple validations
  const version = await models.version.findByPk(versionId)
  const submissionOrigWordIdAndPartSets = []
  const submissionTranslationWordNumberSets = []
  tagSubmissions.forEach(({ origWordsInfo, translationWordsInfo }) => {
    submissionOrigWordIdAndPartSets.push(origWordsInfo.map(({ uhbWordId, ugntWordId, wordPartNumber }) => ugntWordId || `${uhbWordId}|${wordPartNumber}`))
    submissionTranslationWordNumberSets.push(translationWordsInfo.map(({ wordNumberInVerse }) => wordNumberInVerse))
  })
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
        required: true,
      },
    ],
  })
  if(!wordHashesSetSubmission) {
    throw `Call to submitTagSet cannot proceed call to submitWordHashesSet: ${loc} / ${wordsHash}`
  }

  // validate that every part of every orig word is covered, without repeats
  const wordInfoByIdAndPart = await getWordInfoByIdAndPart({ version, loc })
  const dataWordIdAndParts = Object.keys(wordInfoByIdAndPart).sort()
  const submittedWordIdAndParts = submissionOrigWordIdAndPartSets.flat().sort()
  if(!equalObjs(submittedWordIdAndParts, dataWordIdAndParts)) {
    if(!global.skipConsoleLogError) {
      console.log('Bad submitTagSet orig language parts comparison:', submittedWordIdAndParts, dataWordIdAndParts)
    }
    throw `All original language word parts must be covered in tag set.`
  }

  // validate that every translation word is covered, without repeats
  const submittedTranslationWordNumbers = wordHashesSetSubmission.wordHashesSubmissions.map(({ wordNumberInVerse }) => wordNumberInVerse).sort((a,b) => a-b)
  const dataTranslationWordNumbers = submissionTranslationWordNumberSets.flat().sort((a,b) => a-b)
  if(!equalObjs(submittedTranslationWordNumbers, dataTranslationWordNumbers)) {
    if(!global.skipConsoleLogError) {
      console.log('Bad submitTagSet translation word numbers comparison:', submittedTranslationWordNumbers, dataTranslationWordNumbers)
    }
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
        userId: user.id,
      },
      transaction: t,
    })

    if(existingTagSetSubmission) {
      await existingTagSetSubmission.destroy({transaction: t})
    }

    const tagSetSubmission = await models.tagSetSubmission.create(input, {transaction: t})
    const tagSetSubmissionId = tagSetSubmission.id

    await Promise.all(tagSubmissions.map(async tagSubmission => {

      const { alignmentType, translationWordsInfo, origWordsInfo } = tagSubmission

      const tagSetSubmissionItem = await models.tagSetSubmissionItem.create(
        {
          alignmentType,
          tagSetSubmissionId,
        },
        {transaction: t}
      )
      const tagSetSubmissionItemId = tagSetSubmissionItem.id

      await Promise.all([
        models.tagSetSubmissionItemTranslationWord.bulkCreate(
          translationWordsInfo.map(translationWordInfo => ({
            ...translationWordInfo,
            tagSetSubmissionItemId,
          })),
          {
            validate: true,
            transaction: t,
          },
        ),
        models[`${origLangVersionId}TagSubmission`].bulkCreate(
          origWordsInfo.map(origWordInfo => ({
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
      justSubmittedUserId: user.id,
      t,
    })

  })

  // if this was the first tagSetSubmission for this version, email the admin
  const numTagSetSubmissions = await models.tagSetSubmission.count({
    where: {
      versionId,
    },
  })

  if(numTagSetSubmissions === 1) {
    await sendEmail({
      models,
      toAddrs: adminEmail,
      subject: `First tag set submission for a version! (versionId: ${versionId})`,
      body: (
        `
          VERSION ID: $versionId}
          —————————

          Tag Set Submitted by:

          USER ID: ${user.id}
          USER NAME: ${user.name}
          USER EMAIL: ${user.email}
        `
      ),
    })
  }

  return await updatedTagSets({ versionId, updatedFrom, forceAll: true }, req, queryInfo)

}

module.exports = submitTagSet