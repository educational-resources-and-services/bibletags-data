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

    if(tagSubmission.origWordsInfo.length === 0) {
      throw `All tags must include origWordsInfo with at least 1 item.`
    }

    if(tagSubmission.translationWordsInfo.length === 0) {
      throw `All tags must include translationWordsInfo with at least 1 item.`
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
          {transaction: t},
        ),
        models[`${origLangVersion}TagSubmission`].bulkCreate(
          tagSubmission.origWordsInfo.map(origWordInfo => ({
            ...origWordInfo,
            tagSetSubmissionItemId,
          })),
          {transaction: t},
        ),
      ])

    }))

    // Recalculate tagSets here

  })

  const where = {
    loc,
    versionId,
    wordsHash,
  }

  return models.tagSet.findOne({
    where,
  })
}

module.exports = submitTagSet