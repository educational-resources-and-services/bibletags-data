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
  const bdbHasEntryByStrongs = {}
  const uniqueStateOfLexemes = {}
  let bdbOnlyCount = 0
  const updates = []

  const normalizeStrongs = strongs => strongs
    // .replace(/([0-9]+)/, match => ('H' + utils.padWithZeros(match, 5)))
    .replace(/([0-9])a/g, '$1')
    .replace(/([0-9])b/g, '$1.3')
    .replace(/([0-9])c/g, '$1.5')
    .replace(/([0-9])d/g, '$1.7')
    .replace(/([0-9])e/g, '$1.8')
    .replace(/([0-9])f/g, '$1.9')
  
  // go through all bdb entries and put in definitions, recording bdbHasEntryByStrongs with strongs as the keys

  const statement = `SELECT * FROM bdb WHERE src NOT LIKE "See <b data-stgs=%" OR src IS NULL`

  const result = await utils.queryAsync({ connection, statement })

  result.forEach(row => {
    const strongs = normalizeStrongs(row.id)
    bdbHasEntryByStrongs[strongs] = true
    uniqueStateOfLexemes[row.word] = uniqueStateOfLexemes[row.word] ? 0 : 1
  })
      
  await Promise.all(result.map(async row => {

    const strongs = normalizeStrongs(row.id)

    if(!strongs.match(/^H[0-9]{1,4}(\.[0-9])?$/)) {
      badStrongs[strongs] = true
      return
    }
      
    const statement2 = `SELECT pos, wordNumber FROM uhbWords WHERE definitionId="${strongs}"`

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
      updates.push(`UPDATE uhbWords SET lemma="${row.word}" WHERE definitionId="${strongs}"`)

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
      bdbOnlyCount++
    }

  }))

  console.log(`  - ${bdbOnlyCount} words in bdb, but not in uhbWords.`)
  console.log(`  - Strongs numbers skipped due to bad formation: ${Object.keys(badStrongs).join(', ')}`)

  const numRowsUpdated = await utils.doUpdatesInChunksAsync({ connection, updates })
  console.log(`\n  ${numRowsUpdated} rows inserted.\n`)


  // get all distinct strongs from uhbWords and see if there are any not in bdbHasEntryByStrongs
  
  const statement3 = `SELECT DISTINCT definitionId FROM uhbWords`

  const result3 = await utils.queryAsync({ connection, statement: statement3 })

  result3.forEach(row3 => {
    if(!bdbHasEntryByStrongs[row3.definitionId]) {
      console.log(`  - ${row3.definitionId} in uhbWords, but not in bdb.`)
    }
  })


  console.log(`\nCOMPLETED\n`)
  process.exit()

})
