require('dotenv').config()

const mysql = require('mysql2')
const mysqlPromise = require('mysql2/promise')
const fs = require('fs').promises

const connectionObj = {
  host: process.env.RDS_HOST || "localhost",
  database: process.env.RDS_DATABASE || 'BibleTags',
  user: process.env.RDS_USERNAME || "root",
  password: process.env.RDS_PASSWORD || "",
  multipleStatements: true,
}

const connection = mysql.createConnection(connectionObj)

connection.connect(async (err) => {
  if(err) throw err

  console.log(`\nSTARTING importEmptyVersionTables...`)

  const connectionPromise = await mysqlPromise.createConnection(connectionObj)

  const versionIdsToDo = [
    `esv`,
    `kjv`,
  ]

  for(let versionId of versionIdsToDo) {
    
    const [[ hasTable ]] = await connectionPromise.query(`SHOW TABLES LIKE '${versionId}TagSets'`)

    if(!hasTable) {
      console.log(`  Importing ${versionId}...`)
      const sqlImport = (await fs.readFile(`src/data/${versionId}.sql`)).toString()
      await connectionPromise.query(sqlImport)
    }

  }

  console.log(`\nCOMPLETED\n`)
  process.exit()

})