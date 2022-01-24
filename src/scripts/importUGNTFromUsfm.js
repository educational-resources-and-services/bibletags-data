require('dotenv').config()

const mysql = require('mysql2')
const fs = require('fs')

const utils = require('./utils')

const connection = mysql.createConnection({
  host: process.env.DB_NAME || "localhost",
  database: process.env.HOST || 'bibletags',
  user: process.env.USERNAME || "root",
  password: process.env.PASSWORD || "",
  multipleStatements: true,
})

// matches posTerms in bibletags-widget/src/utils/greekMorph.js
const posMapping = {
  N: "N",
  A: "A",
  NS: "A",  // better categorized as an adjective
  NP: "A",  // better categorized as an adjective
  E: "E",
  R: "R",
  V: "V",
  I: "I",
  P: "P",
  D: "D",
  PI: "D",  // better categorized as an adverb
  C: "C",
  T: "T",
  TF: "F",  // better in its own category
}

connection.connect(async (err) => {
  if(err) throw err

  console.log(`\nSTARTING`)

  const importDir = '../bibletags-usfm/usfm/ugnt'
  let filenames

  await new Promise(resolve => {

    fs.readdir(importDir, (err, files) => {
      if(err) { 
        console.log(err)
        process.exit()
      }              

      filenames = files.filter(filename => filename.match(/^[0-9]{2}-\w{3}\.usfm$/))
      // filenames = filenames.slice(0, 1)

      resolve()
    })

  })

  await new Promise(resolve => {

    let wordNumber = 1
    let verseNumber = 0
    let phraseNumber = 1
    let sentenceNumber = 1
    let paragraphNumber = 0

    const definitionUpdates = {}

    const exportBook = () => {

      const filename = filenames.shift()

      if(!filename) {
        resolve()
        return
      }

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
        let isVariant = false

        const putVerseInUpdates = () => {
          const loc = utils.padWithZeros(bookId, 2) + utils.padWithZeros(chapter, 3) + utils.padWithZeros(verse, 3)
          const usfmVerseContent = currentVerseContent.join("\n")

          updates.push(`INSERT INTO ugntVerses (loc, usfm) VALUES ('${loc}', '${usfmVerseContent.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')`)

          usfmVerseContent.match(/\\w.*?\\w\*|\\p|./g).forEach(wordUsfm => {

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

            if(!wordUsfm.match(/^\\w.*?\\w\*$/)) return

            const id = (wordUsfm.match(/x-id="([^"]*)"/) || [])[1]
            const lemma = (wordUsfm.match(/lemma="([^"]*)"/) || [])[1]
            const definitionId = (wordUsfm.match(/strong="([^"]*)"/) || [])[1]
            const fullParsing = (wordUsfm.match(/x-morph="([^"]*)"/) || [])[1]
            const nakedWord = utils.stripGreekAccents(((wordUsfm.match(/^\\w ([^\|]*)\|/) || [])[1] || "").toLowerCase())

            if(!id || !lemma || !definitionId || !fullParsing || !nakedWord) {
              console.log('word with missing info', wordUsfm)
              process.exit()
            }

            const pos = posMapping[fullParsing.slice(3,5)] || posMapping[fullParsing.slice(3,4)]

            if(!pos) {
              console.log('invalid morph - pos not in mapping', wordUsfm)
              process.exit()
            }

            const wordInsert = {
              id,
              bookId,
              chapter,
              verse,
              verseNumber,
              phraseNumber,
              sentenceNumber,
              paragraphNumber,
              nakedWord,
              lemma,
              fullParsing,
              pos,
              morphPos: fullParsing.slice(3,4),
              definitionId,
            }

            if(!isVariant) {
              wordInsert.wordNumber = wordNumber++
            }

            if(fullParsing.slice(4,5) !== ',') {
              wordInsert.type = fullParsing.slice(3,5)
            }

            [
              "mood",
              "aspect",
              "voice",
              "person",
              "case",
              "gender",
              "number",
              "attribute",
            ].forEach((col, idx) => {
              const morphDetail = fullParsing.slice(idx+5,idx+6)
              if(morphDetail !== ',') {
                wordInsert[col] = morphDetail
              }
            })

            const definitionInsert = {
              id: definitionId,
              lex: "",
              lexUnique: 0,
              vocal: "",
              hits: 0,
              lxx: JSON.stringify([]),
            }

            if(!definitionUpdates[definitionId]) {
              definitionUpdates[definitionId] = true
              updates.push(`
                INSERT INTO definitions (\`${Object.keys(definitionInsert).join("\`, \`")}\`)
                VALUES ('${Object.values(definitionInsert).join("', '")}')
              `)
            }

            updates.push(`
              INSERT INTO ugntWords (\`${Object.keys(wordInsert).join("\`, \`")}\`)
              VALUES ('${Object.values(wordInsert).join("', '")}')
            `)

          })

        }

        let pLine, nextChapter
        usfm.split(/\n/g).forEach(line => {

          const chapterMatch = line.match(/^\\c ([0-9]+)/)
          const verseMatch = line.match(/^\\v ([0-9]+)/)

          if(verseMatch && currentVerseContent.length > 0 && verse) {
            putVerseInUpdates()
            currentVerseContent = []
          }

          if(chapterMatch) {
            nextChapter = parseInt(chapterMatch[1], 10)
            return
          }

          if(verseMatch) {
            chapter = nextChapter
            verse = parseInt(verseMatch[1], 10)
            verseNumber++
            return
          }

          if(line.match(/^\\p/)) {
            pLine = line
          }

          if(line.match(/\\w |\\f /)) {
            pLine && currentVerseContent.push(pLine)
            pLine = undefined
            currentVerseContent.push(line)
          }

        })

        putVerseInUpdates()

        utils.doUpdatesInChunks(connection, { updates }, numRowsUpdated => {
          console.log(`  Book #${bookId} done--${numRowsUpdated} rows inserted.`)
          phraseNumber++
          sentenceNumber++
          paragraphNumber++
          exportBook()
        })

      })
    }

    exportBook()

  })

  console.log(`\nCOMPLETED\n`)
  process.exit()

})
