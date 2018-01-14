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
  let noGlossCount = 0
  const iRegex = /<i(?: [^>]*)?>(.*?)<\/i>/g
  const liRegex = /<li(?: [^>]*)?>(.*?)<\/li>/g
  const tagRegex = /<[^>]*>/g
  const bracketsRegex = /\[\]/g

  const cleanUp = str => str
    .replace(tagRegex, '')
    .replace(bracketsRegex, '')
    .replace(/[=√]/g, '')
    .replace(/^\((.*)\)$/, '$1')
    .replace(/^(?:[\. ,]|id\.)*$/, '')
    .replace(/^[\.,=&: ]+/, '')
    .replace(/ [\.]/g, '')
    .trim()
    .replace(/^\((.*)\)$/, '$1')
    .trim()

  const updates = []
  
  
  // go through all bdb entries and put gloss in engDefinitions

  const statement = `SELECT id, bdb FROM bdb`

  const result = await utils.queryAsync({ connection, statement })

  result.forEach(row => {

    const paddedStrongs = row.id.replace(/([0-9]+)/, match => utils.padWithZeros(match, 5))

    if(!paddedStrongs.match(/^H[0-9]{5}[a-z]?$/)) {
      badStrongs[paddedStrongs] = true
      return
    }
      
    let gloss = (row.bdb.split('<ol')[0].match(iRegex) || [])
      .map(def => cleanUp(def))
      .join(', ')

    if(!gloss) {
      gloss = cleanUp(row.bdb.split('<ol')[0].replace(/<[^>]*>.*?<\/[^>]*>/g, '')).split(',')[0]
      if(gloss.split(' ').length > 8) gloss = ''
      // if(gloss) console.log('>> ' + gloss)
    }

    if(!gloss) {
      gloss = (row.bdb.match(iRegex) || [])
        .map(def => cleanUp(def))
        .filter(def => def && def.split(' ').length <= 4)
        .filter((def, i, a) => i === a.indexOf(def))  // dedup
        .slice(0, 4)
        .join(', ')
      // if(gloss) console.log('>> ' + gloss)
    }

    if(!gloss) {
      gloss = (row.bdb.match(liRegex) || [])
        .map(def => cleanUp(def))
        .filter(def => def && def.split(' ').length <= 4)
        .filter((def, i, a) => i === a.indexOf(def))  // dedup
        .slice(0, 4)
        .join(', ')
      // if(gloss) console.log('>> ' + gloss)
    }

    while(utils.lengthInUtf8Bytes(gloss) > 100) {
      gloss = gloss.split(',').slice(0, -1).join(',')
    }

    if(gloss) {

      gloss = gloss.replace(/'/g, "\\'")

      const defInsert = {
        id: paddedStrongs,
        gloss,
        syn: JSON.stringify([]),  // this info is not yet known
        rel: JSON.stringify([]),  // this info is not yet known
      }

      updates.push(`INSERT INTO engDefinitions (${Object.keys(defInsert).join(", ")}) VALUES ('${Object.values(defInsert).join("', '")}')`)

    } else {
      noGlossCount++
      // if(row.bdb.trim()) console.log(row.bdb)
    }

  })

  console.log(`  - ${noGlossCount} words without a valid gloss.`)
  console.log(`  - Strongs numbers skipped due to bad formation: ${Object.keys(badStrongs).join(', ')}`)

  const numRowsUpdated = await utils.doUpdatesInChunksAsync({ connection, updates })
  console.log(`\n  ${numRowsUpdated} rows inserted.\n`)
  
  console.log(`\nCOMPLETED\n`)
  process.exit()

})
