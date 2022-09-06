const sendEmail = require('../email/sendEmail')
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')

const {
  adminEmail,
} = require('../constants')

const iam = new AWS.IAM()

const makeIamUserAndGetKeys = async ({ embeddingAppId }) => {
  if(process.env.LOCAL) return {}

  const UserName = `bibletags-embedding-app-${embeddingAppId}`

  await iam.createUser({ UserName }).promise()

  const { Policy: { Arn } } = await iam.createPolicy({
    PolicyName: `bibletags-${embeddingAppId}`,
    PolicyDocument: JSON.stringify(
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Sid": "AllowStatement1",
            "Action": [
              "s3:ListBucket",
            ],
            "Effect": "Allow",
            "Resource": [
              "arn:aws:s3:::cdn.bibletags.org",
            ],
            "Condition": {
              "StringEquals": {
                "s3:prefix": [
                  "",
                  `tenants/${embeddingAppId}`,
                ],
              },
            },
          },
          {
            "Sid": "AllowStatement2",
            "Action": [
              "s3:ListBucket",
            ],
            "Effect": "Allow",
            "Resource": [
              "arn:aws:s3:::cdn.bibletags.org",
            ],
            "Condition": {
              "StringLike": {
                "s3:prefix": [
                  `tenants/${embeddingAppId}/*`,
                ],
              },
            },
          },
          {
            "Sid": "AllowStatement3",
            "Effect": "Allow",
            "Action": "*",
            "Resource": [
              `arn:aws:s3:::cdn.bibletags.org/tenants/${embeddingAppId}/*`,
            ],
          },
        ],
      },
    ),
  }).promise()

  await iam.attachUserPolicy({
    PolicyArn: Arn,
    UserName,
  }).promise()

  const { AccessKey: { AccessKeyId: awsAccessKeyId, SecretAccessKey: awsSecretAccessKey } } = await iam.createAccessKey({ UserName }).promise()

  return {
    awsAccessKeyId,
    awsSecretAccessKey,
  }
}

const addEmbeddingApp = async (args, req, queryInfo) => {

  const { input } = args
  const {
    uri,
    appName,
    orgName,
    contactEmail,
  } = input

  const { models } = global.connection

  let embeddingApp = await models.embeddingApp.findOne({
    where: {
      uri,
    },
  })

  if(embeddingApp) {
    throw `There is already an embedding app with that uri. Contact us if you need help: ${adminEmail}.`
  }

  const notes = `
    appName=${appName}
    orgName=${orgName}
    contactEmail=${contactEmail}
  `.replace(/\n +/g, '\n').replace(/^\n|\n$/, '')

  embeddingApp = await models.embeddingApp.create({
    id: uuidv4(),
    uri,
    notes,
  })

  let accessKeys = {}
  try {
    accessKeys = await makeIamUserAndGetKeys({ embeddingAppId: embeddingApp.id })
  } catch(err) {
    console.error(`Error when creating IAM user for embedding app`, err.message)
  }

  const hadIamError = !Object.values(accessKeys).length

  await sendEmail({
    models,
    toAddrs: adminEmail,
    subject: `New embedding app (${uri})${hadIamError ? ` - IAM ERROR` : ``}`,
    body: (
      `
        ID: ${embeddingApp.id}
        URI: ${uri}
        App Name: ${appName}
        Orginization Name: ${orgName}
        Contact Email: ${contactEmail}

        ${hadIamError ? `IAM USER CREATION FAILED!!` : ``}
      `
        .replace(/\n +/g, '\n')
        .replace(/\n/g, '<br>')
        .replace(/  +/g, '&nbsp;&nbsp;')
    ),
  })

  if(hadIamError) {
    await embeddingApp.destroy()
    throw `Error when creating IAM user for embedding app`
  }

  return {
    ...embeddingApp.dataValues,
    ...accessKeys,
  }
}

module.exports = addEmbeddingApp