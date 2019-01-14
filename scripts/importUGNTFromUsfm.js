require('dotenv').config()

const mysql = require('mysql2')
const fs = require('fs')

const utils = require('./utils')

const connection = mysql.createConnection({
  host: process.env.DB_NAME || "localhost",
  database: process.env.HOSTNAME || 'bibletags',
  user: process.env.USERNAME || "root",
  password: process.env.PASSWORD || "",
  multipleStatements: true,
})

const noSpaceBeforeWordIds = [
]

connection.connect(async (err) => {
  if(err) throw err

  console.log(`\nSTARTING`)

  const bookURIsByBookId = {}
  const importDir = '../../UGNT'
  let filenames

  await new Promise(resolve => {

    fs.readdir(importDir, (err, files) => {
      if(err) { 
        console.log(err)
        process.exit()
      }              

      filenames = files.filter(filename => filename.match(/^[0-9]{2}-\w{3}\.usfm$/))

      resolve()
    })

  })

  await new Promise(resolve => {

    const exportBook = () => {

      const filename = filenames.shift()

      if(!filename) {
        resolve()
        return
      }

      const bookId = parseInt(filename.replace(/^([0-9]{2}).*$/, '$1'), 10) - 1
      let chapter, verse
      let wordIndexInBook = 0

      fs.readFile(`${importDir}/${filename}`, 'utf-8', (err, usfm) => {
        console.log(`====================================================================================`)
        console.log(`  Began ${filename}...`)

        if(err) { 
          console.log(err)
          process.exit()
        }

        const updates = []
        let currentVerseContent = []
        const ids = []

        const putVerseInUpdates = () => {
          const loc = utils.padWithZeros(bookId, 2) + utils.padWithZeros(chapter, 3) + utils.padWithZeros(verse, 3)
          const usfmVerseContent = currentVerseContent
            .join("\n")
            .replace(/ ?\\w\*/g, () => {

              const id = `${utils.padWithZeros(bookId, 2)}${utils.padWithZeros((wordIndexInBook++).toString(36),3)}`
              if(ids.includes(id)) {
                console.log('repeat id', wordIndexInBook, id)
                process.exit()
              }
              ids.push(id)
              
              return ` x-id="${id}" \\w*`
            })
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")

          updates.push(`INSERT INTO ugntVerses (loc, usfm) VALUES ('${loc}', '${usfmVerseContent}')`)
        }

        usfm.split(/\n/g).forEach(line => {

          const chapterMatch = line.match(/^\\c ([0-9]+)/)
          const verseMatch = line.match(/^\\v ([0-9]+)/)

          if((chapterMatch || verseMatch) && currentVerseContent.length > 0) {
            putVerseInUpdates()
            currentVerseContent = []
          }

          if(chapterMatch) {
            chapter = parseInt(chapterMatch[1], 10)
            return
          }

          if(verseMatch) {
            verse = parseInt(verseMatch[1], 10)
            return
          }

          if(line.match(/^\\w /)) {
            currentVerseContent.push(line.replace(/ x-tw="[^"]*"/g, ""))
          }

        })

        putVerseInUpdates()

        utils.doUpdatesInChunks(connection, { updates }, numRowsUpdated => {
          console.log(`  Book #${bookId} done--${numRowsUpdated} rows inserted.`)
          exportBook()
        })

      })
    }
          
    exportBook()
                
  })

  console.log(`\nCOMPLETED\n`)
  process.exit()

})
