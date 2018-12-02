require('dotenv').config()

const { createConnection } = require('./setupDataModel')
const connection = createConnection()

connection.sync({force: true}).then(() => {

  connection.query(
    ''
  ).then(() => {

    console.log('Database setup.');
    process.exit()
    
  })
})
