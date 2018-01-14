require('dotenv').config()

const mysql = require('mysql2')
const xml2js = require('xml2js')
const js2xmlparser = require("js2xmlparser")
const fs = require('fs')

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
  const uniqueStateOfLemmas = {}
  let bdbOnlyCount = 0
  const updates = []
  
  
  // go through all bdb entries and put in definitions, recording bdbHasEntryByStrongs with strongs as the keys

  const statement = `SELECT * FROM bdb`

  const result = await utils.queryAsync({ connection, statement })

  result.forEach(row => {
    const paddedStrongs = row.id.replace(/([0-9]+)/, match => utils.padWithZeros(match, 5))
    bdbHasEntryByStrongs[paddedStrongs] = true
    uniqueStateOfLemmas[row.word] = uniqueStateOfLemmas[row.word] ? 0 : 1
  })
      
  await Promise.all(result.map(async row => {

    const paddedStrongs = row.id.replace(/([0-9]+)/, match => utils.padWithZeros(match, 5))

    if(!paddedStrongs.match(/^H[0-9]{5}[a-z]?$/)) {
      badStrongs[paddedStrongs] = true
      return
    }
      
    const statement2 = `SELECT morph FROM oshbWords WHERE strongs="${paddedStrongs}"`

    const result2 = await utils.queryAsync({ connection, statement: statement2 })

    if(result2.length > 0) {

      const defInsert = {
        id: paddedStrongs,
        lemma: row.word,
        lemmaUnique: uniqueStateOfLemmas[row.word],
        vocal: row.xlit,
        hits: result2.length,
        lxx: JSON.stringify([]),  // this info is not yet known
      }

      updates.push(`INSERT INTO definitions (${Object.keys(defInsert).join(", ")}) VALUES ('${Object.values(defInsert).join("', '")}')`)

      const posInKeys = {}

      result2.forEach(row2 => {
        // TODO: this needs to be determined differently for aramaic
        const morphParts = row2.morph.substr(1).split('/')
        if(morphParts[morphParts.length - 1].substr(0,1) == 'S') {
          morphParts.pop()
        }
        const pos = (morphParts.pop() || '').substr(0,1)
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
      bdbOnlyCount++
    }

  }))

  console.log(`  - ${bdbOnlyCount} words in bdb, but not in oshbWords.`)
  console.log(`  - Strongs numbers skipped due to bad formation: ${Object.keys(badStrongs).join(', ')}`)

  const numRowsUpdated = await utils.doUpdatesInChunksAsync({ connection, updates })
  console.log(`\n  ${numRowsUpdated} rows inserted.\n`)


  // get all distinct strongs from oshbWords and see if there are any not in bdbHasEntryByStrongs
  
  const statement3 = `SELECT DISTINCT strongs FROM oshbWords`

  const result3 = await utils.queryAsync({ connection, statement: statement3 })

  result3.forEach(row3 => {
    if(!bdbHasEntryByStrongs[row3.strongs]) {
      console.log(`  - ${row3.strongs} in oshbWords, but not in bdb.`)
    }
  })


  console.log(`\nCOMPLETED\n`)
  process.exit()

})
