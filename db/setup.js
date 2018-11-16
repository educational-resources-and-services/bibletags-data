require('dotenv').config()

const { createConnection } = require('./setupDataModel')
const connection = createConnection()

connection.sync({force: true}).then(() => {

  // It seems that sequelize is buggy with regard to UNIQUE indexes that use foreign keys. Thus,
  // I do these manually.
  connection.query(
    'ALTER TABLE `uiWords` ADD UNIQUE INDEX `str-desc-languageId` (`str`, `desc`, `languageId`);' +
    ''
  ).then(() => {

    console.log('Database setup.');
    process.exit()
    
  })
})
