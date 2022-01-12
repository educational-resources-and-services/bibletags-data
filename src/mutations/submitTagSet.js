const submitTagSet = async (args, req, queryInfo) => {

  const { input } = args
  const { loc, versionId, wordsHash, embeddingAppId, tagSubmissions } = input
  // look for auth, else use the id of the user with email = user-[deviceId]@bibletags.org
  let origLangVersion

  if(!tagSubmissions || tagSubmissions.length === 0) {
    throw `No tags submitted.`
  }

  tagSubmissions.forEach(tagSubmission => {
    const { uhbWordId, ugntWordId } = tagSubmission

    if(!uhbWordId === !ugntWordId) {
      throw `Each tag must contain either a uhbWordId or ugntWordId, but not both.`
    }

    const thisOrigLangVersion = uhbWordId ? 'uhb' : 'ugnt'
    
    if(origLangVersion && origLangVersion !== thisOrigLangVersion) {
      throw `All tags in a single tagSet submission must relate to a single original language text.`
    }
    
    origLangVersion = thisOrigLangVersion
  })

  delete input.tagSubmissions

  const { models } = global.connection

  await global.connection.transaction(async t => {

    const tagSetSubmission = await models.tagSetSubmission.create(input, {transaction: t})

    tagSubmissions.forEach(tagSubmission => {
      tagSubmission.tagSetSubmissionId = tagSetSubmission.id
      tagSubmission.embeddingAppId = embeddingAppId  // do I need this data repeated here?
    })

    await models[`${origLangVersion}TagSubmission`].bulkCreate(tagSubmissions, {transaction: t})

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