require('dotenv').config()

const { createConnection } = require('./setupDataModel')
const connection = createConnection()

connection.sync({force: true}).then(() => {

  // It seems that sequelize is buggy with regard to UNIQUE indexes that use foreign keys. Thus,
  // I do these manually.
  connection.query(
    'ALTER TABLE `oshbWords` ADD UNIQUE INDEX `bookId-chapter-verse-number-qere` (`bookId`, `chapter`, `verse`, `number`, `qere`);' +
    'ALTER TABLE `uiWords` ADD UNIQUE INDEX `str-desc` (`str`, `desc`);' +
    ''
  ).then(() => {

    console.log('Database setup.');
    process.exit()
    
  })
})
