require('dotenv').config()

const mysql = require('mysql2')
const fs = require('fs')
const { getMainWordPartIndex, stripHebrewVowelsEtc } = require('@bibletags/bibletags-ui-helper')

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
      // filenames = filenames.slice(25)

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

            const handleWord = ({ w, id, lemma, strong, morph, isVariant }) => {

              const definitionId = (strong.match(/H[0-9]{5}/) || [])[0]
              const prefixParts = (strong.match(/[^"H]*/) || [])[0].split(':').filter(Boolean)
              const form = stripHebrewVowelsEtc(w)
              const isAramaic = /^Ar,/.test(morph) ? 1 : 0

              if(!id || !morph || !form || (!!definitionId !== !!lemma)) {
                console.log('word with missing info', wordUsfm)
                process.exit()
              }

              morphParts = morph.slice(3).split(':')
              mainPartIdx = getMainWordPartIndex(morphParts)
              const mainPartMorph = morphParts[mainPartIdx]
              const pos = mainPartMorph[0]
              const [ suffixMorph ] = morph.match(/:Sp([^:]*)/g) || []

              const wordInsert = {
                id,
                bookId,
                chapter,
                verse,
                verseNumber,
                sectionNumber,
                paragraphNumber,
                form,
                lemma,
                fullParsing: morph,
                isAramaic,
                b: prefixParts.includes("b") ? 1 : 0,
                l: prefixParts.includes("l") ? 1 : 0,
                k: prefixParts.includes("k") ? 1 : 0,
                m: prefixParts.includes("m") ? 1 : 0,
                sh: prefixParts.includes("s") ? 1 : 0,
                v: prefixParts.includes("c") ? 1 : 0,
                h1: /^(?:He,|Ar,)(?:[^:]*:)*Td/.test(morph) ? 1 : 0,
                h2: /^(?:He,|Ar,)(?:[^:]*:)*Rd/.test(morph) ? 1 : 0,
                h3: /^(?:He,|Ar,)(?:[^:]*:)*Ti/.test(morph) ? 1 : 0,
                pos,
                h4: /^(?:He,|Ar,)(?:[^:]*:)*Sd/.test(morph) ? 1 : 0,
                h5: /^(?:He,|Ar,)(?:[^:]*:)*Sh/.test(morph) ? 1 : 0,
                n: /^(?:He,|Ar,)(?:[^:]*:)*Sn/.test(morph) ? 1 : 0,
              }

              if(!isVariant) {
                wordInsert.wordNumber = wordNumber++
              }

              switch(pos) {
                case 'A':
                case 'N':
                  if(mainPartMorph.length > 2) {
                    if(mainPartMorph.slice(1,4) !== 'xxx') {
                      wordInsert.gender = mainPartMorph[2]
                      wordInsert.number = mainPartMorph[3]
                    }
                    wordInsert.state = mainPartMorph[4]
                  }
                  
                case 'R':
                case 'T':
                  const type = pos + mainPartMorph[1]
                  if(
                    mainPartMorph[1]
                    && mainPartMorph.slice(1,4) !== 'xxx'
                    && !['Aa','Nc'].includes(type)
                  ) {
                    wordInsert.type = type
                  }
                  break

                case 'P':
                  wordInsert.type = pos + mainPartMorph[1]
                  if(mainPartMorph[1] === 'f' && mainPartMorph.length > 2) {
                    const person = mainPartMorph[2]
                    if(!['x'].includes(person)) {
                      wordInsert.person = person
                    }
                    wordInsert.gender = mainPartMorph[3]
                    wordInsert.number = mainPartMorph[4]
                  }
                  break

                case 'V':
                  wordInsert.stem = (isAramaic ? 'A' : 'H') + mainPartMorph[1]
                  wordInsert.aspect = mainPartMorph[2]
                  if(['r','s'].includes(mainPartMorph[2])) {
                    wordInsert.gender = mainPartMorph[3]
                    wordInsert.number = mainPartMorph[4]
                    wordInsert.state = mainPartMorph[5]
                  } else if(['a','c'].includes(mainPartMorph[2])) {
                    // nothing more to do
                  } else {
                    wordInsert.person = mainPartMorph[3]
                    wordInsert.gender = mainPartMorph[4]
                    wordInsert.number = mainPartMorph[5]
                  }
                  break
              }

              if(wordInsert.number === 'x') {
                wordInsert.number = 's'  // see 1 Kings 12:12
              }

              // if(![ undefined, 'p', 'q', 'i', 'w', 'h', 'j', 'v', 'r', 's', 'a', 'c' ].includes(wordInsert.aspect)) console.log('>>>', morph)
              // if(![ undefined, 's', 'p', 'd' ].includes(wordInsert.number)) console.log('>>>', morph)
              // if(![ undefined, 'Ac', 'Ao', 'Ng', 'Np', 'Pd', 'Pf', 'Pi', 'Pp', 'Pr', 'Rd', 'Ta', 'Td', 'Te', 'Ti', 'Tj', 'Tm', 'Tn', 'To', 'Tr' ].includes(wordInsert.type)) console.log('>>>', morph)

              if(suffixMorph) {
                wordInsert.suffixPerson = suffixMorph.slice(3,4)
                wordInsert.suffixGender = suffixMorph.slice(4,5)
                wordInsert.suffixNumber = suffixMorph.slice(5,6)
              }

              if(definitionId) {
                wordInsert.definitionId = definitionId

                const definitionInsert = {
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
                }

                if(!definitionUpdates[definitionId]) {
                  definitionUpdates[definitionId] = true
                  updates.push(`
                    INSERT INTO definitions (\`${Object.keys(definitionInsert).join("\`, \`")}\`)
                    VALUES ('${Object.values(definitionInsert).join("', '")}')
                  `)
                }
              }

              updates.push(`
                INSERT INTO uhbWords (\`${Object.keys(wordInsert).join("\`, \`")}\`)
                VALUES ('${Object.values(wordInsert).join("', '")}')
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

          if(line.match(/\\w |\\f |\\zApparatusJson /)) {
            pLine && currentVerseContent.push(pLine)
            pLine = undefined
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