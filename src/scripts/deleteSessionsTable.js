require('dotenv').config()

const mysql = require('mysql2/promise')

;(async() => {

  const connection = await mysql.createConnection({
    host: process.env.DB_NAME || "localhost",
    database: process.env.HOST || 'bibletags',
    user: process.env.USERNAME || "root",
    password: process.env.PASSWORD || "",
    multipleStatements: true,
  })

  console.log(`\nSTARTING deleteSessionsTable...\n`)

  await connection.query(`DELETE TABLE sessions`)

  console.log(`\nCOMPLETED\n`)
  process.exit()

})()