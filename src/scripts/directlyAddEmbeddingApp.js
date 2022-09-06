require('dotenv').config()

const mysql = require('mysql2/promise')

const directlyAddEmbeddingApp = async embeddingApp => {

  const connection = await mysql.createConnection({
    host: process.env.RDS_HOST || "localhost",
    database: process.env.RDS_DATABASE || 'BibleTags',
    user: process.env.RDS_USERNAME || "root",
    password: process.env.RDS_PASSWORD || "",
    multipleStatements: true,
  })

  embeddingApp.createdAt = embeddingApp.updatedAt = new Date().toISOString().split('T')[0]
  const keys = Object.keys(embeddingApp)
  await connection.query(`
    INSERT INTO embeddingApps
      (${keys.map(key => `\`${key}\``).join(', ')})
      VALUES (${keys.map(key => JSON.stringify(embeddingApp[key])).join(', ')})
  `)

}

module.exports = directlyAddEmbeddingApp