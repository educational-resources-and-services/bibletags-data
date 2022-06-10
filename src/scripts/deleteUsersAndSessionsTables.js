require('dotenv').config()

const mysql = require('mysql2/promise')

;(async() => {

  const connection = await mysql.createConnection({
    host: process.env.RDS_HOST || "localhost",
    database: process.env.RDS_DATABASE || 'BibleTags',
    user: process.env.RDS_USERNAME || "root",
    password: process.env.RDS_PASSWORD || "",
    multipleStatements: true,
  })

  console.log(`\nSTARTING deleteUsersAndSessionsTables...\n`)

  await connection.query(`SET foreign_key_checks = 0`)
  await connection.query(`DROP TABLE IF EXISTS sessions`)
  await connection.query(`DROP TABLE IF EXISTS users`)
  await connection.query(`SET foreign_key_checks = 1`)

  console.log(`\nCOMPLETED\n`)
  process.exit()

})()