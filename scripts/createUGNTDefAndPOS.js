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

// matches posTerms options in bibletags-widget/src/utils/greekMorph.js
const posOptions = [
  "N",
  "A",
  "NS",
  "NP",
  "E",
  "R",
  "V",
  "I",
  "P",
  "D",
  "PI",
  "C",
  "T",
  "TF",
]

connection.connect(async (err) => {
  if(err) throw err

  console.log(`\nSTARTING`)

  const badStrongs = {}
  const dodsonHasEntryByStrongs = {}
  const uniqueStateOfLexemes = {}
  let dodsonOnlyCount = 0
  const updates = []
  
  
  // go through all dodson entries and put in definitions, recording dodsonHasEntryByStrongs with strongs as the keys

  const statement = `SELECT * FROM dodson`

  const result = await utils.queryAsync({ connection, statement })

  result.forEach(row => {
    const paddedStrongs = row.id.replace(/([0-9]+)/, match => utils.padWithZeros(match, 5))
    dodsonHasEntryByStrongs[paddedStrongs] = true
    uniqueStateOfLexemes[row.word] = uniqueStateOfLexemes[row.word] ? 0 : 1
  })
      
  await Promise.all(result.map(async row => {

    const paddedStrongs = row.id
      .replace(/([0-9]+)/, match => utils.padWithZeros(match, 5))
      .replace(/\+([0-9])?$/, '.$1')

    if(!paddedStrongs.match(/^G[0-9]{5}(?:\.[0-9])?$/)) {
      badStrongs[paddedStrongs] = true
      return
    }
      
    const statement2 = `SELECT morph FROM ugntWords WHERE strongs="${paddedStrongs}"`

    const result2 = await utils.queryAsync({ connection, statement: statement2 })

    if(result2.length > 0) {

      const defInsert = {
        id: paddedStrongs,
        lex: row.word,
        lexUnique: uniqueStateOfLexemes[row.word],
        vocal: row.xlit,
        hits: result2.length,
        lxx: JSON.stringify([]),  // this info is not yet known
      }

      updates.push(`INSERT INTO definitions (${Object.keys(defInsert).join(", ")}) VALUES ('${Object.values(defInsert).join("', '")}')`)

      const posInKeys = {}

      result2.forEach(row2 => {

        let pos = row2.morph.substr(3,2)
        if(!posOptions[pos]) {
          pos = pos.substr(0,1)
          if(!posOptions[pos]) {
            console.log(`  ** ERROR **`)
            console.log(`Invalid pos`, row2)
            process.exit()
          }
        }

        if(pos) {
          posInKeys[pos] = true
        }
      })

      Object.keys(posInKeys).forEach(pos => {

        const posInsert = {
          pos,
          definitionId: paddedStrongs,
        }
        
        updates.push(`INSERT INTO partOfSpeeches (${Object.keys(posInsert).join(", ")}) VALUES ('${Object.values(posInsert).join("', '")}')`)

      })

    } else {
      dodsonOnlyCount++
    }

  }))

  console.log(`  - ${dodsonOnlyCount} words in dodson, but not in ugntWords.`)
  console.log(`  - Strongs numbers skipped due to bad formation: ${Object.keys(badStrongs).join(', ')}`)

process.exit()

  const numRowsUpdated = await utils.doUpdatesInChunksAsync({ connection, updates })
  console.log(`\n  ${numRowsUpdated} rows inserted.\n`)


  // get all distinct strongs from ugntWords and see if there are any not in dodsonHasEntryByStrongs
  
  const statement3 = `SELECT DISTINCT strongs FROM ugntWords`

  const result3 = await utils.queryAsync({ connection, statement: statement3 })

  result3.forEach(row3 => {
    if(!dodsonHasEntryByStrongs[row3.strongs]) {
      console.log(`  - ${row3.strongs} in ugntWords, but not in dodson.`)
    }
  })


  console.log(`\nCOMPLETED\n`)
  process.exit()

})
