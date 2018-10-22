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

  const bookURIsByBookId = {}
  // const importDir = '../morphhb/wlc'
  const importDir = '../morphhb-parsing/morphhb-scripts/morphhb'

  await new Promise(resolve => {

    fs.readdir(importDir, (err, filenames) => {
      if(err) { 
        console.log(err)
        process.exit()
      }              

      filenames = filenames.filter(filename => filename.match(/^\w/) && !['VerseMap.xml'].includes(filename))

      filenames.forEach(filename => {
        const bookId = utils.getBibleBookIdByAbbr(filename.replace(/\..*$/, ''))
        bookURIsByBookId[bookId] = filename
      })

      resolve()
      
    })

  })

  await new Promise(resolve => {

    const parser = new xml2js.Parser({
      explicitChildren: true,
      preserveChildrenOrder: true,
    })

    let bookId = 1

    const exportBook = () => {

      if(bookId > 39) {
        resolve()
        return
      }

      fs.readFile(`${importDir}/${bookURIsByBookId[bookId]}`, 'utf-8', (err, xml) => {
        console.log(`====================================================================================`)
        console.log(`  Began ${bookURIsByBookId[bookId]}...`)

        if(err) { 
          console.log(err)
          process.exit()
        }

        parser.parseString(xml, function (err, jsonObj) {

          const convertObj = obj => {
            const newObj = {
              "=": obj["#name"]
            }
            if(obj["$"]) {
              newObj["@"] = obj["$"]
            }
            if(obj["$$"] && obj["_"]) {

              const complexWordBreakupMap = {
                "גָּח֜ן": ["גָּח֜", "ן"],
                "מִשְׁפָּטָ֖/": ["מִשְׁפָּטָ֖/", ""],
                "שְׁמַ֖": ["שְׁמַ֖", ""],
                "אֶחָֽ": ["אֶחָֽ", ""],
                "מְשֶּׁ֜ה": ["מְ", "שֶּׁ֜ה"],
                "אֹ֖רֶ": ["אֹ֖רֶ", ""],
                "וּ/נְבֽוּשַׁזְבָּ": ["וּ/נְבֽוּשַׁזְבָּ", ""],
                "מִ/יָּ֑ר": ["מִ/יָּ֑", "ר"],
                "וְ֝/נִרְגָּ֗": ["וְ֝/נִרְגָּ֗", ""],
                "רְשָׁים": ["רְשָׁ", "ים"],
                "מֵ/רְשָׁים": ["מֵ/רְשָׁ", "ים"],
              }

              Object.keys(complexWordBreakupMap).some(word => {
                if(obj["_"] == word) {
                  newObj["group"] = [
                    complexWordBreakupMap[word][0],
                    {
                      "=": obj["$$"][0]["#name"],
                      "@": obj["$$"][0]["$"],
                      "#": obj["$$"][0]["_"],
                    },
                    complexWordBreakupMap[word][1],
                  ]
                  return true
                }
              })
              // console.log(obj)
            } else if(obj["$$"]) {
              newObj["group"] = obj["$$"].map(child => convertObj(child))
            } else if(obj["_"]) {
              newObj["#"] = obj["_"]
            }

            return newObj
          }
                  
          jsonObj.osis = convertObj(jsonObj.osis)

          // put in the new data

          const updates = []

          jsonObj.osis.group[0].group[1].group.forEach(chapter => {
            if(chapter['='] != 'chapter') {
              console.log(`UNEXPECTED TAG: ${JSON.stringify(chapter)}`)
              process.exit()
            }
            chapter.group.forEach(verse => {

              if(verse['='] != 'verse') {
                console.log(`UNEXPECTED TAG: ${JSON.stringify(verse)}`)
                process.exit()
              }

              const wordInserts = []
              const osisIDParts = verse['@'].osisID.split('.')
              const verseId = utils.padWithZeros(bookId, 2) + utils.padWithZeros(osisIDParts[1], 3) + utils.padWithZeros(osisIDParts[2], 3)

              let verseUsfm = ""
              let number = 0

              verse.group.forEach(wordOrSomethingElse => {
                if(wordOrSomethingElse['='] == 'w') {

                  ++number

                  let word = wordOrSomethingElse['#'] || ''
                  ;(wordOrSomethingElse.group || []).forEach(wordPart => {
                    word += wordPart['#'] || wordPart
                  })

                  const strongs = wordOrSomethingElse['@'].lemma
                    .replace(/\+/g, '')  // TODO: this will need to be handled differently once we decide how to do multi-word lemmas
                    .replace(/\//g, ':')
                    .replace(/([0-9]+)/, match => ('H' + utils.padWithZeros(match, 5)))
                    .replace(/ ([a-z])$/, '$1')

                  const strongsParts = strongs.split(':')
                  if(!strongsParts[strongsParts.length - 1].match(/^[HA]/)) {
                    strongsParts.push("")
                  }
                  let strongsWithoutPrefixes = strongsParts.pop()

                  // change ילך lemma to הלך
                  if(strongsWithoutPrefixes === "H03212") {
                    strongsWithoutPrefixes = "H01980"
                  }

                  const strongsPrefixes = strongsParts.join('')
                  const strongsWithPrefixes = (strongsPrefixes ? strongsPrefixes + ':' : '') + strongsWithoutPrefixes

                  const morph = wordOrSomethingElse['@'].morph

                  verseUsfm += (
                    morph
                      ? `\\n\\\\w ${word}|strong="${strongsWithPrefixes}" x-morph="${morph}" \\\\w*`
                      : `\\n\\\\w ${word}|strong="${strongsWithPrefixes}" \\\\w*`
                  )

                  wordInserts.push({
                    bookId,
                    chapter: osisIDParts[1],
                    verse: osisIDParts[2],
                    number,
                    qere: 0,
                    word,
                    strongs: strongsWithoutPrefixes,
                    prefix: strongsPrefixes,
                    morph,
                    append: "",
                  })
                  
                } else if(wordOrSomethingElse['='] == 'seg') {
                  verseUsfm += wordOrSomethingElse['#'].trim()

                  wordInserts[wordInserts.length - 1].append += wordOrSomethingElse['#'].trim() 

                } else if(wordOrSomethingElse['='] == 'note') {
                  // TODO

                } else {
                  console.log(`UNEXPECTED TAG: ${JSON.stringify(wordOrSomethingElse)}`)
                  process.exit()
                }

              })
              
              updates.push(`INSERT INTO oshbVerses (id, usfm) VALUES ('${verseId}', '${verseUsfm.replace(/^\\n/, '')}')`)

              wordInserts.forEach(wordInsert => {
                updates.push(`INSERT INTO oshbWords (${Object.keys(wordInsert).join(", ")}) VALUES ('${Object.values(wordInsert).join("', '")}')`)
              })

            })
          })

          utils.doUpdatesInChunks(connection, { updates }, numRowsUpdated => {
            console.log(`  Book #${bookId} done--${numRowsUpdated} rows inserted.`)
            bookId++ && exportBook()
          })

        })
      })
    }
          
    exportBook()
                
  })

  console.log(`\nCOMPLETED\n`)
  process.exit()

})
