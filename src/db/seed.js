require('dotenv').config()

const { setUpConnection } = require('./connect')
const setUpVersionDataModel = require('./setUpVersionDataModel')

;(async () => {

  console.log('\nSeeding db...')

  if(!global.connection) {
    setUpConnection()
    await global.connection.authenticate()
  }

  const { models } = global.connection

  await models.version.bulkCreate([
    {
      "id": "esv",
      "name": "English Standard Version",
      // "wordDividerRegex": null,
      // "partialScope": "ot",
      "versificationModel": "kjv",
      "skipsUnlikelyOriginals": 1,
      "extraVerseMappings": {
        "64001014": "64001014",
        "64001015": "64001015"
      },
      "createdAt": "2022-01-01 00:00:00 GMT",
      "updatedAt": "2022-01-01 00:00:00 GMT",
      "languageId": "eng",
    },
  ])

  setUpVersionDataModel('esv')
  await global.connection.sync()

  await models.embeddingApp.bulkCreate([
    {
      "id": "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
      "uri": "import",
      "createdAt": "2022-01-01 00:00:00 GMT",
      "updatedAt": "2022-01-01 00:00:00 GMT",
    },
    {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "uri": "https://biblearc.com",
      "createdAt": "2022-01-01 00:00:00 GMT",
      "updatedAt": "2022-01-01 00:00:00 GMT",
    },
  ])

  await models.user.bulkCreate([
    {
      "id": "import",
      "email": "import@bibletags.org",
      "rating": 5,
      "ratingHistory": "Initial: 5",
      "createdAt": "2022-01-01 00:00:00 GMT",
      "updatedAt": "2022-01-01 00:00:00 GMT",
      "languageId": "eng",
    },
    {
      "id": "user-111@bibletags.org",
      "email": "user-111@bibletags.org",
      "name": "ANONYMOUS",
      "rating": 100,
      "ratingHistory": "Initial: 100",
      "createdAt": "2022-01-01 00:00:00 GMT",
      "updatedAt": "2022-01-01 00:00:00 GMT",
      "languageId": "eng",
    },
    {
      "id": "user-444@bibletags.org",
      "email": "user-444@bibletags.org",
      "name": "ANONYMOUS",
      "rating": 51,
      "ratingHistory": "Initial: 51",
      "createdAt": "2022-01-01 00:00:00 GMT",
      "updatedAt": "2022-01-01 00:00:00 GMT",
      "languageId": "eng",
    },
  ])

  console.log('...DB seeded.\n')

  process.exit()

})()
