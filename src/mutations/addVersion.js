const sendEmail = require('../email/sendEmail')
const { equalObjs, cloneObj } = require('../utils')
const setUpVersionDataModel = require('../db/setUpVersionDataModel')

const {
  adminEmail,
} = require('../constants')

const addVersion = async (args, req, queryInfo) => {

  const { input: { extraVerseMappingsStr, ...otherInput } } = args
  otherInput.extraVerseMappings = JSON.parse(extraVerseMappingsStr)

  const { models } = global.connection

  let version = await models.version.findByPk(otherInput.id)

  if(version) {
    const updatedInput = cloneObj(otherInput)
    Object.keys(updatedInput).forEach(key => {
      if(equalObjs(updatedInput[key], version.dataValues[key])) {
        delete updatedInput[key]
      }
    })

    if(Object.values(updatedInput).length > 0) {
      await sendEmail({
        models,
        toAddrs: adminEmail,
        subject: `Proposed update to version table (${otherInput.id})`,
        body: (
          `
            VERSION ID: ${otherInput.id}
            —————————
            OLD:
            ${Object.keys(updatedInput).map(key => (
              `${key}: ${JSON.stringify(version.dataValues[key], null, '  ')}`
            )).join('\n')}
            —————————
            NEW:
            ${Object.keys(updatedInput).map(key => (
              `${key}: ${JSON.stringify(updatedInput[key], null, '  ')}`
            )).join('\n')}
            —————————
          `
            .replace(/\n +/g, '\n')
            .replace(/\n/g, '<br>')
            .replace(/  +/g, '&nbsp;&nbsp;')
        ),
      })
    }

  } else {
    setUpVersionDataModel(otherInput.id)
    await global.connection.sync()
    version = await models.version.create(otherInput)
  }

  return version
}

module.exports = addVersion