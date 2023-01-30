require('dotenv').config()

const mysql = require('mysql2/promise')
const fs = require('fs').promises
const TurndownService = require('turndown')

;(async() => {

  const connection = await mysql.createConnection({
    host: process.env.RDS_HOST || "localhost",
    database: process.env.RDS_DATABASE || 'BibleTags',
    user: process.env.RDS_USERNAME || "root",
    password: process.env.RDS_PASSWORD || "",
    multipleStatements: true,
  })

  console.log(`\nSTARTING createInitialEngLexEntry...`)

  const getHebrewStrongs = id => {
    if(!/^H/.test(id)) return id
    const endDigit = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
    }[id.slice(-1)] || 0
    return `H${`000${id.replace(/[^0-9]/g, '')}`.slice(-4)}${endDigit}`
  }

  const getGreekStrongs = id => {
    let endDigit
    if(!/\+/.test(id)) endDigit = 0
    if(/\+1/.test(id)) endDigit = 5
    if(endDigit === undefined) return ``
    return `G${`000${id.slice(1).replace(/\+.*$/, '')}`.slice(-4)}${endDigit}`
  }

  const getStrongs = id => (
    /^G/.test(id)
      ? getGreekStrongs(id)
      : getHebrewStrongs(id)
  )

  const adjustHtml = str => {
    const adjustedStr = (
      str
      .replace(/ data-(?:pron|xlit|root)="[^"]+"/g, '')
      .replace(/ class="(?:lang-[^"]+|gw|s1|s2)"/g, '')
      .replace(/<b data-stgs="([^"]+)">([^<]*)<\/b>/g, (match, strongs, word) => (
        `<a_href="#search=%23${getStrongs(strongs)}">${word || `?`}</a>`
      ))
    )

    if(/<[^> ]* /.test(adjustedStr)) {
      throw `Something still to replace: ${adjustedStr}`
    }

    return (
      adjustedStr
        .replace(/<a_href/g, '<a href')
        .replace(/\n +/g, '\n')
        .replace(/^\n+|\n+$/g, '')
    )
  }

  ///// PREP WORK /////

  const [[ hasStrongs ]] = await connection.query(`SHOW TABLES LIKE 'strongs'`)

  if(!hasStrongs) {
    const sqlImport = (await fs.readFile(`src/data/strongs.sql`)).toString()
    await connection.query(sqlImport)
  }

  const [[ hasThayers ]] = await connection.query(`SHOW TABLES LIKE 'thayers'`)

  if(!hasThayers) {
    const sqlImport = (await fs.readFile(`src/data/thayers.sql`)).toString()
    await connection.query(sqlImport)
  }

  ///// OT /////

  let [ aramaicDefinitionIdRows ] = await connection.query(`SELECT DISTINCT definitionId FROM uhbWords WHERE isAramaic=1`)
  const aramaicDefinitionIds = aramaicDefinitionIdRows.map(({ definitionId }) => definitionId)
  aramaicDefinitionIdRows = null
  const [ bdbRows ] = await connection.query(`SELECT * FROM bdb`)

  await Promise.all(bdbRows.map(async ({ id, word, def, use, src, bdb, root: rootBeforeChanges }) => {
    const strongs = getStrongs(id)

    const [[ languageSpecificDefinition ]] = await connection.query(`SELECT id FROM languageSpecificDefinitions WHERE definitionId='${strongs}' AND languageId='eng'`)

    if(languageSpecificDefinition) {

      let root
      if(rootBeforeChanges) {
        root = [
          rootBeforeChanges.replace(/[^א-ששׁשׂ]/g, ''),
          getStrongs((rootBeforeChanges.match(/data-stgs="([^"]+)"/) || [])[1] || ``),
        ]
        if(!root[1]) root.pop()
        if(!root[0]) {
          root = null
        }
      }

      const turndownService = new TurndownService({
        headingStyle: 'atx',
        emDelimiter: '*',
        bulletListMarker: '-',
      })

      // const markdown = turndownService.turndown(adjustHtml(`
      //   ${(def || src || use) ? `<h1>Strong’s Concordance</h1>` : ``}
      //   ${def ? `<p><b>Definition:</b> ${def}</p>` : ``}
      //   ${src ? `<p><b>Source:</b> ${src}</p>` : ``}
      //   ${use ? `<p><b>Usage:</b> ${use}</p>` : ``}
      //   ${bdb ? `<h1>Brown-Driver-Briggs Lexicon</h1><p>${bdb}</p>` : ``}
      // `))

      const alts = [
        ...(!(def || src || use) ? [] : [{
          // editorIds: [ userId1, userId2 ]  // when this is not present, than only admins can edit
          title: "Strong’s Concordance",
          md: turndownService.turndown(adjustHtml(`
            ${def ? `<p><b>Definition:</b> ${def}</p>` : ``}
            ${src ? `<p><b>Source:</b> ${src}</p>` : ``}
            ${use ? `<p><b>Usage:</b> ${use}</p>` : ``}
          `)),
        }]),
        ...(!bdb ? [] : [{
          title: "Brown-Driver-Briggs Lexicon",
          md: turndownService.turndown(adjustHtml(`<p>${bdb}</p>`)),
        }]),
      ]

      const lexEntry = {
        ...(root ? { root } : {}),
        ...(aramaicDefinitionIds.includes(strongs) ? { isAramaic: true } : {}),
        alts,
      }
      await connection.query(
        `
          UPDATE languageSpecificDefinitions
          SET lexEntry = ?
          WHERE definitionId='${strongs}' AND languageId='eng'
        `,
        [ JSON.stringify(lexEntry) ]
      )
    } else {
      console.log(`Didnt find: ${strongs} | ${id} | ${word}`)
    }

  }))


  ///// NT /////

  const [ thayersRows ] = await connection.query(`SELECT * FROM thayers`)

  await Promise.all(thayersRows.map(async ({ id, word, content }) => {
    const [[ strongsRow ]] = await connection.query(`SELECT * FROM strongs WHERE id="${id}"`)
    const { def } = strongsRow || {}
    const [[ dodsonRow ]] = await connection.query(`SELECT * FROM dodson WHERE id="${id}"`)
    const { src, def: dodsonDef } = dodsonRow || {}

    const strongs = getStrongs(id)

    const [[ languageSpecificDefinition ]] = await connection.query(`SELECT id FROM languageSpecificDefinitions WHERE definitionId='${strongs}' AND languageId='eng'`)

    if(languageSpecificDefinition) {

      const turndownService = new TurndownService({
        headingStyle: 'atx',
        emDelimiter: '*',
        bulletListMarker: '-',
      })

      // const markdown = turndownService.turndown(adjustHtml(`
      //   ${(def || src) ? `<h1>Strong’s Concordance</h1>` : ``}
      //   ${def ? `<p><b>Definition:</b> ${def}</p>` : ``}
      //   ${src ? `<p><b>Source:</b> ${src}</p>` : ``}
      //   ${dodsonDef ? `<h1>Dodson Greek-English Lexicon</h1><p>${dodsonDef}</p>` : ``}
      //   ${content ? `<h1>Thayer’s Greek Lexicon</h1><p>${content}</p>` : ``}
      // `))

      const alts = [
        ...(!(def || src) ? [] : [{
          // editorIds: [ userId1, userId2 ]  // when this is not present, than only admins can edit
          title: "Strong’s Concordance",
          md: turndownService.turndown(adjustHtml(`
            ${def ? `<p><b>Definition:</b> ${def}</p>` : ``}
            ${src ? `<p><b>Source:</b> ${src}</p>` : ``}
          `)),
        }]),
        ...(!content ? [] : [{
          title: "Thayer’s Greek Lexicon",
          md: turndownService.turndown(adjustHtml(`<p>${content}</p>`)),
        }]),
        ...(!dodsonDef ? [] : [{
          title: "Dodson Greek-English Lexicon",
          md: turndownService.turndown(adjustHtml(`<p>${dodsonDef}</p>`)),
        }]),
      ]

      const lexEntry = {
        alts,
      }
      await connection.query(
        `
          UPDATE languageSpecificDefinitions
          SET lexEntry = ?
          WHERE definitionId='${strongs}' AND languageId='eng'
        `,
        [ JSON.stringify(lexEntry) ]
      )
    } else {
      console.log(`Didnt find: ${strongs} | ${id} | ${word}`)
    }

  }))

  console.log(`\nCOMPLETED\n`)
  process.exit()

})()

// HEBREW
//   alt lex
//     X All lemmas (when 2+)
//     X root (what to do when the root )
//     X Strongs
//       X source
//       X use
//       X def
//     X if(isAramaic) put in 
//     X BDB entry

// GREEK
//   alt lex
//     X All lemmas (when 2+)
//     X Strongs
//       X source (dodson: src)
//       X def
//     X Dodson
//       X def
//     X Thayers entry

// - markdown
// - Mark vs refs!
// - Make Hebrew and Greek words mentioned clickable
// - include words not in Bible? (think LXX and when they are referenced)
// - rel from BDB and Dodson as a start to working through these
// - do I show where there are multiple lemmas for a word?

// MISSING:
// 178	or	[]	[]	null	2022-01-01 00:02:58.000	2022-01-01 00:02:58.000	eng	H01761	NULL
// 1208	Baal	[]	[]	null	2022-01-01 00:20:08.000	2022-01-01 00:20:08.000	eng	H11681	NULL
// 2673	leaven	[]	[]	null	2022-01-01 00:44:33.000	2022-01-01 00:44:33.000	eng	H25571	NULL
// 3806	complete	[]	[]	null	2022-01-01 01:03:26.000	2022-01-01 01:03:26.000	eng	H36351	NULL
// 11554	raiment, clothing	[]	[]	null	2022-01-01 03:12:34.000	2022-01-01 03:12:34.000	eng	G24410	NULL
// 13140	more wicked	[]	[]	null	2022-01-01 03:39:00.000	2022-01-01 03:39:00.000	eng	G41910	NULL
// 13157	farther, beyond	[]	[]	null	2022-01-01 03:39:17.000	2022-01-01 03:39:17.000	eng	G42080	NULL
// 13327	formerly, before	[]	[]	null	2022-01-01 03:42:07.000	2022-01-01 03:42:07.000	eng	G43860	NULL
// 13636	more diligently	[]	[]	null	2022-01-01 03:47:16.000	2022-01-01 03:47:16.000	eng	G47060	NULL
// 13637	more prompt, more earnest	[]	[]	null	2022-01-01 03:47:17.000	2022-01-01 03:47:17.000	eng	G47070	NULL