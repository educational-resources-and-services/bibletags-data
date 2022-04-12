require('dotenv').config()

const { setUpConnection } = require('./connect')

;(async () => {

  console.log('\nSeeding db...')

  if(!global.connection) {
    setUpConnection()
    await global.connection.authenticate()
  }

  const { models } = global.connection

  await models.language.bulkCreate([
    {
      "id": "eng",
      "name": "English",
      "englishName": "English",
      "definitionPreferencesForVerbs": [
        "#infinitive-construct",
        "#infinitive",
        "#participle#1st#singular",
        "#present#1st#singular",
      ],
      "createdAt": "2022-01-01 00:00:00 GMT",
      "updatedAt": "2022-01-01 00:00:00 GMT",
    },
    {
      "id": "spa",
      "name": "Español",
      "englishName": "Spanish",
      "definitionPreferencesForVerbs": [
        "#infinitive-construct",
        "#infinitive",
        "#participle#3rd#singular",
        "#present#3rd#singular",
      ],
      "createdAt": "2022-01-01 00:00:00 GMT",
      "updatedAt": "2022-01-01 00:00:00 GMT",
    },
  ])

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
      "ratingHistory": "",
      "createdAt": "2022-01-01 00:00:00 GMT",
      "updatedAt": "2022-01-01 00:00:00 GMT",
      "languageId": "eng",
    },
  ])

  console.log('...DB seeded.\n')

  process.exit()

})()
