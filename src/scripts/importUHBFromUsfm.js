require('dotenv').config()

const mysql = require('mysql2')
const fs = require('fs')
const { getPartialWordRowFromUsfmWord } = require('@bibletags/bibletags-ui-helper')

const utils = require('./utils')
const specialDefinitions = require('./specialDefinitions')

const connection = mysql.createConnection({
  host: process.env.RDS_HOST || "localhost",
  database: process.env.RDS_DATABASE || 'BibleTags',
  user: process.env.RDS_USERNAME || "root",
  password: process.env.RDS_PASSWORD || "",
  multipleStatements: true,
})

const getDefinitionInsert = definitionId => ({
  id: definitionId,
  lex: "",
  nakedLex: "",
  lexUnique: 0,
  vocal: "",
  simplifiedVocal: "",
  hits: 0,
  lxx: JSON.stringify([]),
  lemmas: JSON.stringify([]),
  forms: JSON.stringify([]),
  ...(specialDefinitions[definitionId] || {}),
})

connection.connect(async (err) => {
  if(err) throw err

  console.log(`\nSTARTING importUHBFromUsfm...`)

  const importDir = '../bibletags-usfm/usfm/uhb'
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

  // add in special definitions 

  console.log(`====================================================================================`)
  console.log(`  Add in special definitions...`)

  const numRowsUpdated = await utils.doUpdatesInChunksAsync({
    connection,
    updates: (
      ['b','l','k','m','s','c','d','i','Sn','Sp','Sd','Sh']
        .map(definitionId => {
          const { pos, gloss, ...definitionInsert } = getDefinitionInsert(definitionId)
          return [
            `
              INSERT INTO definitions (\`${Object.keys(definitionInsert).join("\`, \`")}\`)
              VALUES ('${Object.values(definitionInsert).join("', '")}')
            `,
            ...(pos.map(p => {
              const posInsert = {
                pos: p,
                definitionId,  
              }
              return `
                INSERT INTO partOfSpeeches (${Object.keys(posInsert).join(", ")})
                VALUES ('${Object.values(posInsert).join("', '")}')
              `
            })),
          ]
        })
        .flat()
    ),
  })
  console.log(`\n  ${numRowsUpdated} rows inserted.\n`)

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
      let sectionNumber = 1
      let paragraphNumber = 0

      const bookId = parseInt(filename.replace(/^([0-9]{2}).*$/, '$1'), 10)
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

          updates.push(`INSERT INTO uhbVerses (loc, usfm) VALUES ('${loc}', '${usfmVerseContent.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')`)

          usfmVerseContent.match(/\\w.*?\\w\*|\\zApparatusJson.*?\\zApparatusJson\*|\\p|./g).forEach(wordUsfm => {

            if([ 'פ', 'ס' ].includes(wordUsfm)) {
              sectionNumber++
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
                sectionNumber,
                paragraphNumber,            
                ...getPartialWordRowFromUsfmWord(usfmWord),
              }

              if(!usfmWord.isVariant) {
                wordRow.wordNumber = wordNumber++
              }

              if(wordRow.definitionId) {

                const definitionInsert = getDefinitionInsert(wordRow.definitionId)

                if(!definitionUpdates[wordRow.definitionId]) {
                  definitionUpdates[wordRow.definitionId] = true
                  updates.push(`
                    INSERT INTO definitions (\`${Object.keys(definitionInsert).join("\`, \`")}\`)
                    VALUES ('${Object.values(definitionInsert).join("', '")}')
                  `)
                }
              }

              updates.push(`
                INSERT INTO uhbWords (\`${Object.keys(wordRow).join("\`, \`")}\`)
                VALUES ('${Object.values(wordRow).join("', '")}')
              `)

            }

            if(/^\\zApparatusJson/.test(wordUsfm)) {

              const apparatus = JSON.parse((wordUsfm.match(/\\zApparatusJson (.*?)\\zApparatusJson\*/) || [])[1])
              apparatus.words.filter(word => typeof word === 'object').forEach(word => handleWord({ ...word, isVariant: true }))

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