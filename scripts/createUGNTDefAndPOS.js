require('dotenv').config()

const mysql = require('mysql2')

const utils = require('./utils')

const connection = mysql.createConnection({
  host: process.env.DB_NAME || "localhost",
  database: process.env.HOSTNAME || 'bibletags',
  user: process.env.USERNAME || "root",
  password: process.env.PASSWORD || "",
  multipleStatements: true,
})

connection.connect(async (err) => {
  if(err) throw err

  console.log(`\nSTARTING`)

  const badStrongs = {}
  const dodsonHasEntryByStrongs = {}
  const uniqueStateOfLexemes = {}
  let dodsonOnlyCount = 0
  const updates = []
  
  const normalizeStrongs = strongs => strongs
    .replace(/\+1$/g, '.5')
    .replace(/^G1189\+2$/g, 'G1189.5')
    .replace(/^G1774\+2$/g, 'G1774.5')
    .replace(/^G3835\+2$/g, 'G3835.5')
    .replace(/^G4345\+2$/g, 'G4345.5')
    .replace(/^G1177\+2$/g, 'G1177.5')
  
  // go through all dodson entries and put in definitions, recording dodsonHasEntryByStrongs with strongs as the keys

  const statement = `SELECT * FROM dodson`

  const result = await utils.queryAsync({ connection, statement })

  result.forEach(row => {
    const strongs = normalizeStrongs(row.id)
    dodsonHasEntryByStrongs[strongs] = true
    uniqueStateOfLexemes[row.word] = uniqueStateOfLexemes[row.word] ? 0 : 1
  })
      
  await Promise.all(result.map(async row => {

    const strongs = normalizeStrongs(row.id)

    if(!strongs.match(/^G[0-9]{1,4}(?:\.[0-9])?$/)) {
      badStrongs[strongs] = true
      return
    }
      
    const statement2 = `SELECT pos, wordNumber FROM ugntWords WHERE definitionId="${strongs}"`

    const result2 = await utils.queryAsync({ connection, statement: statement2 })

    if(result2.length > 0) {

      const hits = result2.reduce((sum, row2) => sum + (row2.wordNumber ? 1 : 0), 0)

      const defUpdate = {
        lex: row.word,
        lexUnique: uniqueStateOfLexemes[row.word],
        vocal: row.xlit,
        hits,
        // lxx: JSON.stringify([]),  // this info is not yet known
      }

      const set = []

      for(let col in defUpdate) {
        set.push(`${col}="${(defUpdate[col] + '').replace(/"/g, '\\"')}"`)
      }

      updates.push(`UPDATE definitions SET ${set.join(", ")} WHERE id="${strongs}"`)

      const posInKeys = {}

      result2.forEach(row2 => posInKeys[row2.pos] = true)

      Object.keys(posInKeys).forEach(pos => {

        const posInsert = {
          pos,
          definitionId: strongs,
        }
        
        updates.push(`INSERT INTO partOfSpeeches (${Object.keys(posInsert).join(", ")}) VALUES ('${Object.values(posInsert).join("', '")}')`)
      })

    } else {
      dodsonOnlyCount++
    }

  }))

  console.log(`  - ${dodsonOnlyCount} words in dodson, but not in ugntWords.`)
  console.log(`  - Strongs numbers skipped due to bad formation: ${Object.keys(badStrongs).join(', ')}`)

  const numRowsUpdated = await utils.doUpdatesInChunksAsync({ connection, updates })
  console.log(`\n  ${numRowsUpdated} rows inserted.\n`)


  // get all distinct strongs from ugntWords and see if there are any not in dodsonHasEntryByStrongs
  
  const statement3 = `SELECT DISTINCT definitionId FROM ugntWords`

  const result3 = await utils.queryAsync({ connection, statement: statement3 })

  const missingStrongs = []
  result3.forEach(row3 => {
    if(!dodsonHasEntryByStrongs[row3.definitionId]) {
      missingStrongs.push(row3.definitionId)
    }
  })
  console.log(`  - The following are in ugntWords, but not in dodson:\n${missingStrongs.join("\n")}`)


  console.log(`\nCOMPLETED\n`)
  process.exit()

})
