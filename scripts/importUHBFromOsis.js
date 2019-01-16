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

const noSpaceBeforeWordIds = [
  '1391p',
  '13B6v',
  '14Cjb',
  '143UC',
  '14s8J',
  '147rA',
  '12vw5',
  '15SP9',
  '23q1v',
  '24ATv',
  '19T7s',
  '22fZr',
]

// same as in bibletags-widget/src/utils/helperFunctions.js
const getMainWordPartIndex = wordParts => {
  if(!wordParts) return null

  for(let idx = wordParts.length - 1; idx >= 0; idx--) {
    if(!wordParts[idx].match(/^S/)) {
      return idx
    }
  }
}

connection.connect(async (err) => {
  if(err) throw err

  console.log(`\nSTARTING`)

  const bookURIsByBookId = {}
  const importDir = '../../morphhb/wlc'

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
    let wordNumber = 1
    let verseNumber = 0
    let sectionNumber = 1

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

              verseNumber++

              const osisIDParts = verse['@'].osisID.split('.')
              const loc = utils.padWithZeros(bookId, 2) + utils.padWithZeros(osisIDParts[1], 3) + utils.padWithZeros(osisIDParts[2], 3)

              let verseUsfm = ""

              verse.group.forEach(wordOrSomethingElse => {
                if(wordOrSomethingElse['='] == 'w') {

                  let word = wordOrSomethingElse['#'] || ''
                  ;(wordOrSomethingElse.group || []).forEach(wordPart => {
                    word += wordPart['#'] || wordPart
                  })
                  word = word.replace(/\//g, '​')

                  const strongs = wordOrSomethingElse['@'].lemma
                    .replace(/\+/g, '')  // TODO: this will need to be handled differently once we decide how to do multi-word lemmas
                    .replace(/\//g, ':')
                    .replace(/([0-9]+)/, match => ('H' + utils.padWithZeros(match, 5)))
                    .replace(/ ([a-z])$/, '$1')

                  const strongsParts = strongs.split(':')
                  if(!strongsParts[strongsParts.length - 1].match(/^(?:He,|Ar,)/)) {
                    strongsParts.push("")
                  }
                  let strongsWithoutPrefixes = strongsParts.pop()

                  // change ילך lemma to הלך
                  if(strongsWithoutPrefixes === "H03212") {
                    strongsWithoutPrefixes = "H01980"
                  }

                  // change format of strongs
                  strongsWithoutPrefixes = strongsWithoutPrefixes
                    .replace(/^H0*/g, 'H')
                    .replace(/a$/g, '.2')
                    .replace(/b$/g, '.4')
                    .replace(/c$/g, '.6')
                    .replace(/d$/g, '.7')
                    .replace(/e$/g, '.8')
                    .replace(/f$/g, '.9')
 
                  if(strongsWithoutPrefixes && !strongsWithoutPrefixes.match(/^H[0-9\.]+$/)) {
                    console.log(`UNEXPECTED STRONGS: ${strongs}`)
                    process.exit()
                  }

                  const id = wordOrSomethingElse['@'].id

                  const strongsPrefixes = strongsParts.join('')
                  const strongsWithPrefixes = (strongsPrefixes ? strongsPrefixes + ':' : '') + strongsWithoutPrefixes

                  const morph = wordOrSomethingElse['@'].morph
                    .replace(/^H/, 'He,')
                    .replace(/^A/, 'Ar,')
                    .replace(/\//g, ':')

                  const morphParts = morph.substr(3).split(':')

                  verseUsfm += 
                    (verseUsfm.substr(-1) === '־' || noSpaceBeforeWordIds.includes(id) ? `` : `\\n`)
                     + `\\\\w ${word}|strong="${strongsWithPrefixes}"${morph ? ` x-morph="${morph}"` : ``}${id ? ` x-id="${id}"` : ``} \\\\w*`

                  const mainPartMorphLetters = morphParts[getMainWordPartIndex(morphParts)].split('')
                  const pos = mainPartMorphLetters[0]
                  const isAramaic = morph.match(/^Ar,/) ? 1 : 0

                  const wordInsert = {
                    id,
                    bookId,
                    chapter: osisIDParts[1],
                    verse: osisIDParts[2],
                    verseNumber,
                    sectionNumber,
                    nakedWord: word.replace(),
                    lemma: "",  // TODO: set in def and pos building script
                    fullParsing: morph,
                    isAramaic,
                    b: strongsPrefixes.match(/b/) ? 1 : 0,
                    l: strongsPrefixes.match(/l/) ? 1 : 0,
                    k: strongsPrefixes.match(/k/) ? 1 : 0,
                    m: strongsPrefixes.match(/m/) ? 1 : 0,
                    sh: strongsPrefixes.match(/s/) ? 1 : 0,
                    v: strongsPrefixes.match(/c/) ? 1 : 0,
                    h1: morph.match(/^(?:He,|Ar,)(?:[^:]*:)*Td/) ? 1 : 0,
                    h2: morph.match(/^(?:He,|Ar,)(?:[^:]*:)*Rd/) ? 1 : 0,
                    h3: morph.match(/^(?:He,|Ar,)(?:[^:]*:)*Ti/) ? 1 : 0,
                    pos: pos,
                    h4: morph.match(/^(?:He,|Ar,)(?:[^:]*:)*Sd/) ? 1 : 0,
                    h5: morph.match(/^(?:He,|Ar,)(?:[^:]*:)*Sh/) ? 1 : 0,
                    n: morph.match(/^(?:He,|Ar,)(?:[^:]*:)*Sn/) ? 1 : 0,
                  }

                  if(true) {  // TODO: !qere
                    wordInsert.wordNumber = wordNumber++
                  }

                  switch(pos) {
                    case 'A':
                    case 'N':
                      if(mainPartMorphLetters.length > 2) {
                        if(mainPartMorphLetters.slice(1,4).join("") !== 'xxx') {
                          wordInsert.gender = mainPartMorphLetters[2]
                          wordInsert.number = mainPartMorphLetters[3]
                        }
                        wordInsert.state = mainPartMorphLetters[4]
                      }
                      
                    case 'R':
                    case 'T':
                      const type = pos + mainPartMorphLetters[1]
                      if(
                        mainPartMorphLetters[1]
                        && mainPartMorphLetters.slice(1,4).join("") !== 'xxx'
                        && !['Aa','Nc'].includes(type)
                      ) {
                        wordInsert.type = type
                      }
                      break

                    case 'P':
                      wordInsert.type = pos + mainPartMorphLetters[1]
                      if(mainPartMorphLetters[1] === 'f' && mainPartMorphLetters.length > 2) {
                        const person = mainPartMorphLetters[2]
                        if(!['x'].includes(person)) {
                          wordInsert.person = person
                        }
                        wordInsert.gender = mainPartMorphLetters[3]
                        wordInsert.number = mainPartMorphLetters[4]
                      }
                      break

                    case 'V':
                      wordInsert.stem = (isAramaic ? 'A' : 'H') + mainPartMorphLetters[1]
                      wordInsert.aspect = mainPartMorphLetters[2]
                      if(['r','s'].includes(mainPartMorphLetters[2])) {
                        wordInsert.gender = mainPartMorphLetters[3]
                        wordInsert.number = mainPartMorphLetters[4]
                        wordInsert.state = mainPartMorphLetters[5]
                      } else if(['a','c'].includes(mainPartMorphLetters[2])) {
                        // nothing more to do
                      } else {
                        wordInsert.person = mainPartMorphLetters[3]
                        wordInsert.gender = mainPartMorphLetters[4]
                        wordInsert.number = mainPartMorphLetters[5]
                      }
                      break
                  }

                  ;(morph.match(/:Sp([^:]*)/g) || []).forEach(suffixMorph => {
                      wordInsert.suffixPerson = suffixMorph.substr(3,1)
                      wordInsert.suffixGender = suffixMorph.substr(4,1)
                      wordInsert.suffixNumber = suffixMorph.substr(5,1)
                  })

                  if(strongsWithoutPrefixes) {
                    wordInsert.definitionId = strongsWithoutPrefixes
  
                    const definitionInsert = {
                      id: strongsWithoutPrefixes,
                      lex: "",
                      lexUnique: 0,
                      vocal: "",
                      hits: 0,
                      lxx: JSON.stringify([]),
                    }
        
                    updates.push(`
                      INSERT INTO definitions (\`${Object.keys(definitionInsert).join("\`, \`")}\`)
                      SELECT * FROM (SELECT ${Object.values(definitionInsert).map((val, idx) => `'${val}' as t${idx}`).join(", ")}) AS tmp
                      WHERE NOT EXISTS (
                          SELECT id FROM definitions WHERE id='${definitionId}'
                      ) LIMIT 1
                    `)
                  }

                  updates.push(`
                    INSERT INTO uhbWords (${Object.keys(wordInsert).join(", ")})
                    VALUES ('${Object.values(wordInsert).join("', '")}')
                  `)


                } else if(wordOrSomethingElse['='] == 'seg') {
                  verseUsfm += wordOrSomethingElse['#'].trim()

                  if(wordOrSomethingElse['#'].match(/[ספ]/)) {
                    sectionNumber++
                  }

                } else if(wordOrSomethingElse['='] == 'note') {
                  // TODO

                } else {
                  console.log(`UNEXPECTED TAG: ${JSON.stringify(wordOrSomethingElse)}`)
                  process.exit()
                }

              })
              
              updates.push(`INSERT INTO uhbVerses (loc, usfm) VALUES ('${loc}', '${verseUsfm.replace(/^\\n/, '')}')`)

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
