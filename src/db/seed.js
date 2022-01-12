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
      "createdAt": "2022-01-01 00:00:00 GMT",
      "updatedAt": "2022-01-01 00:00:00 GMT",
    },
    {
      "id": "spa",
      "name": "Español",
      "englishName": "Spanish",
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
      // "extraVerseMappings": null,
      "createdAt": "2022-01-01 00:00:00 GMT",
      "updatedAt": "2022-01-01 00:00:00 GMT",
      "languageId": "eng",
    },
  ])

  console.log('...DB seeded.\n')

  process.exit()

})()
