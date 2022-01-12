require('dotenv').config()

const { createConnection } = require('./setupDataModel')
const connection = createConnection()

connection.sync({force: true}).then(() => {

  connection.query(
    'SELECT 1;'
  ).then(() => {

    console.log('Database setup.');
    process.exit()
    
  })
})
