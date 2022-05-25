require('dotenv').config()

const mysql = require('mysql2')
const fs = require('fs')
const { getPartialWordRowFromUsfmWord } = require('@bibletags/bibletags-ui-helper')

const utils = require('./utils')

const connection = mysql.createConnection({
  host: process.env.DB_NAME || "localhost",
  database: process.env.HOST || 'bibletags',
  user: process.env.USERNAME || "root",
  password: process.env.PASSWORD || "",
  multipleStatements: true,
})

connection.connect(async (err) => {
  if(err) throw err

  console.log(`\nSTARTING importUGNTFromUsfm...`)

  const importDir = '../bibletags-usfm/usfm/ugnt'
  let filenames

  await new Promise(resolve => {

    fs.readdir(importDir, (err, files) => {
      if(err) { 
        console.log(err)
        process.exit()
      }              

      filenames = files.filter(filename => filename.match(/^[0-9]{2}-\w{3}\.usfm$/))
      // filenames = files.slice(0,1)

      resolve()
    })

  })

  await new Promise(resolve => {

    const definitionUpdates = {}

    const exportBook = () => {

      const filename = filenames.shift()

      if(!filename) {
        resolve()
        return
      }

      let wordNumber = 1
      let verseNumber = 0
      let phraseNumber = 1
      let sentenceNumber = 1
      let paragraphNumber = 0
  
      const bookId = parseInt(filename.replace(/^([0-9]{2}).*$/, '$1'), 10) - 1
      let chapter, verse

      fs.readFile(`${importDir}/${filename}`, 'utf-8', (err, usfm) => {
        console.log(`====================================================================================`)
        console.log(`  Began ${filename}...`)

        if(err) { 
          console.log(err)
          process.exit()
        }

        const updates = []
        let currentVerseContent = []

        const putVerseInUpdates = () => {
          const loc = utils.padWithZeros(bookId, 2) + utils.padWithZeros(chapter, 3) + utils.padWithZeros(verse, 3)
          const usfmVerseContent = currentVerseContent.join("\n")

          updates.push(`INSERT INTO ugntVerses (loc, usfm) VALUES ('${loc}', '${usfmVerseContent.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')`)

          usfmVerseContent.match(/\\w.*?\\w\*|\\zApparatusJson.*?\\zApparatusJson\*|\\p|./g).forEach(wordUsfm => {

            if([';', ',', '"', ':'].includes(wordUsfm)) {
              phraseNumber++
            }

            if(['.', '!', '?'].includes(wordUsfm)) {
              phraseNumber++
              sentenceNumber++
            }

            if(wordUsfm === "\\p") {
              paragraphNumber++
            }

            const handleWord = usfmWord => {

              const wordRow = {
                bookId,
                chapter,
                verse,
                verseNumber,
                phraseNumber,
                sentenceNumber,
                paragraphNumber,            
                ...getPartialWordRowFromUsfmWord(usfmWord),
              }

              if(!usfmWord.isVariant) {
                wordRow.wordNumber = wordNumber++
              }

              const definitionInsert = {
                id: wordRow.definitionId,
                lex: "",
                nakedLex: "",
                lexUnique: 0,
                vocal: "",
                simplifiedVocal: "",
                hits: 0,
                lxx: JSON.stringify([]),
                lemmas: JSON.stringify([]),
                forms: JSON.stringify([]),
              }

              if(!definitionUpdates[wordRow.definitionId]) {
                definitionUpdates[wordRow.definitionId] = true
                updates.push(`
                  INSERT INTO definitions (\`${Object.keys(definitionInsert).join("\`, \`")}\`)
                  VALUES ('${Object.values(definitionInsert).join("', '")}')
                `)
              }

              updates.push(`
                INSERT INTO ugntWords (\`${Object.keys(wordRow).join("\`, \`")}\`)
                VALUES ('${Object.values(wordRow).join("', '")}')
              `)

            }

            if(/^\\zApparatusJson/.test(wordUsfm)) {

              // TODO: I first need to get strong, lemma, and morph attributes for the critical text comparison in the apparatus before I can add these to ugntWords

              // const apparatus = JSON.parse((wordUsfm.match(/\\zApparatusJson (.*?)\\zApparatusJson\*/) || [])[1])
              // apparatus.words.filter(word => typeof word === 'object').forEach(word => handleWord({ ...word, isVariant: true }))

            } else if(wordUsfm.match(/^\\w.*?\\w\*$/)) {

              const w = (wordUsfm.match(/^\\w ([^\|]*)\|/) || [])[1]
              const id = (wordUsfm.match(/x-id="([^"]*)"/) || [])[1]
              const lemma = (wordUsfm.match(/lemma="([^"]*)"/) || [])[1]
              const strong = (wordUsfm.match(/strong="([^"]*)"/) || [])[1]
              const morph = (wordUsfm.match(/x-morph="([^"]*)"/) || [])[1]

              handleWord({ w, id, lemma, strong, morph })

            }

          })

        }

        let pLine, chLine, nextChapter
        usfm.split(/\n/g).forEach(line => {

          const chapterMatch = line.match(/^\\c ([0-9]+)/)
          const verseMatch = line.match(/^\\v ([0-9]+)/)

          if(verseMatch && currentVerseContent.length > 0 && verse) {
            putVerseInUpdates()
            currentVerseContent = []
          }

          if(chapterMatch) {
            nextChapter = parseInt(chapterMatch[1], 10)
            chLine = line
            return
          }

          if(verseMatch) {
            chapter = nextChapter
            verse = parseInt(verseMatch[1], 10)
            verseNumber++
          }

          if(line.match(/^\\p/)) {
            pLine = line
          }

          if(verseMatch || line.match(/\\w |\\f |\\zApparatusJson /)) {
            pLine && currentVerseContent.push(pLine)
            chLine && currentVerseContent.push(chLine)
            pLine = chLine = undefined
            currentVerseContent.push(line)
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
