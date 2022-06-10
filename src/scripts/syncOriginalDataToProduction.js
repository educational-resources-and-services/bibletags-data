require('dotenv').config()

const mysql = require('mysql2/promise')
const inquirer = require('inquirer')

const { equalObjs } = require('../utils')

;(async() => {

  const productionConnection = await mysql.createConnection({
    host: process.env.PRODUCTION_RDS_HOST,
    database: process.env.PRODUCTION_RDS_DATABASE,
    user: process.env.PRODUCTION_RDS_USERNAME,
    password: process.env.PRODUCTION_RDS_PASSWORD,
    multipleStatements: true,
    ssl: "Amazon RDS",
  })

  const localConnection = await mysql.createConnection({
    host: process.env.RDS_HOST || "localhost",
    database: process.env.RDS_DATABASE || 'BibleTags',
    user: process.env.RDS_USERNAME || "root",
    password: process.env.RDS_PASSWORD || "",
    multipleStatements: true,
  })

  console.log(`\nSTARTING syncOriginalDataToProduction...\n`)

  const primaryKeysByTableName = {
    definitions: [ 'id' ],
    uhbWords: [ 'id' ],
    ugntWords: [ 'id' ],
    uhbVerses: [ 'loc' ],
    uhbUnitWords: [ 'id' ],
    uhbUnitRanges: [ 'id' ],
    ugntVerses: [ 'loc' ],
    ugntUnitWords: [ 'id' ],
    ugntUnitRanges: [ 'id' ],
    lemmas: [ 'id', 'nakedLemma' ],
    partOfSpeeches: [ 'pos', 'definitionId' ],
  }

  const getEscapedColVal = val => (
    val === null
      ? 'NULL'
      : (
        typeof val === 'object'
          ? JSON.stringify(JSON.stringify(val))
          : JSON.stringify(val)
      )
  )

  const updatesByTable = {}

  for(let table in primaryKeysByTableName) {

    console.log(`Examining differences in ${table}...`)

    const primaryKeys = primaryKeysByTableName[table]
    const updates = updatesByTable[table] = []

    const getPrimaryKeyStr = row => JSON.stringify(primaryKeys.map(key => row[key]))

    const localRows = []
    const productionRows = []

    let offset = 0
    const limit = 1000

    while(true) {

      const [ [ lRows ], [ pRows ] ] = await Promise.all([
        localConnection.query(`SELECT * FROM ${table} LIMIT ${limit} OFFSET ${offset}`),
        productionConnection.query(`SELECT * FROM ${table} LIMIT ${limit} OFFSET ${offset}`),
      ])

      localRows.push(...lRows)
      productionRows.push(...pRows)

      if(lRows.length === 0 && pRows.length === 0) break
      offset += limit

    }

    const localRowsByPrimaryKeys = {}
    const productionRowsByPrimaryKeys = {}

    localRows.forEach(localRow =>  {
      localRowsByPrimaryKeys[getPrimaryKeyStr(localRow)] = localRow
    })

    productionRows.forEach(productionRow =>  {
      productionRowsByPrimaryKeys[getPrimaryKeyStr(productionRow)] = productionRow
    })

    localRows.forEach(localRow => {

      const matchingProductionRow = productionRowsByPrimaryKeys[getPrimaryKeyStr(localRow)]
      const rowKeys = Object.keys(localRow)

      if(!matchingProductionRow) {
        // INSERT
        updates.push(`
          INSERT INTO ${table} (\`${rowKeys.map(val => val.replace(/`/g, '\\`')).join("\`, \`")}\`)
          VALUES (${rowKeys.map(key => getEscapedColVal(localRow[key])).join(", ")})
        `)
      } else if(!equalObjs(localRow, matchingProductionRow)) {
        const keysWithDifferentValues = []
        for(let key in localRow) {
          if(!equalObjs(localRow[key], matchingProductionRow[key])) {
            keysWithDifferentValues.push(key)
          }
        }
        // UPDATE
        updates.push(`
          UPDATE ${table}
          SET ${keysWithDifferentValues.map(key => `\`${key.replace(/`/g, '\\`')}\`=${getEscapedColVal(localRow[key])}`).join(", ")}
          WHERE ${primaryKeys.map(key => `\`${key.replace(/`/g, '\\`')}\`=${getEscapedColVal(localRow[key])}`).join(" AND ")}
        `)
      }

    })

    productionRows.forEach(productionRow => {
      const matchingLocalRow = localRowsByPrimaryKeys[getPrimaryKeyStr(productionRow)]
      if(!matchingLocalRow) {
        // DELETE
        if([ `definitions` ].includes(table)) {
          throw `The definition row with id:${productionRow.id} needs to be deleted manually before you can run this script.`
        }
        if([ `uhbWords`, `ugntWords` ].includes(table)) {
          updates.push(`
            DELETE FROM ${table.replace(/Words/, 'TagSubmissions')}
            WHERE \`${table.replace(/Words/, 'WordId')}\`='${productionRow.id}'
          `)
        }
        updates.push(`
          DELETE FROM ${table}
          WHERE ${primaryKeys.map(key => `\`${key.replace(/`/g, '\\`')}\`=${getEscapedColVal(productionRow[key])}`).join(" AND ")}
        `)
      }
    })

  }

  for(let table in updatesByTable) {
    if(updatesByTable[table].length > 0) {
      console.log(`\n============ ${updatesByTable[table].length} UPDATES FOR ${table} ============\n\n${updatesByTable[table].map(update => update.length > 600 ? `${update.slice(0, 500)} ... ${update.slice(-100)}` : update).join(``).replace(/(^|\n) +/g, '$1')}`)
    }
  }

  if(Object.values(updatesByTable).some(updates => updates.length > 0)) {

    console.log(`\n========================\n========================\n\n`)
    const { confirm } = await inquirer.prompt([
      {
        type: `list`,
        name: `confirm`,
        message: `Do you want to execute the above changes?`,
        choices: [
          {
            name: `NO, Do not execute these changes`,
            value: false,
          },
          {
            name: `YES, execute these changes`,
            value: true,
          },
        ],
      },
    ])

    if(confirm) {

      console.log(`\n\nRUNNING UPDATES...`)

      await productionConnection.query(`
        START TRANSACTION;
        ${Object.values(updatesByTable).flat().join(';')};
        COMMIT;
      `)

      console.log(`...SUCCESSFUL!`)

    }

  }

  console.log(`\n\nCOMPLETED\n`)
  process.exit()

})()


// WHAT I NEED:

// definition - update or add (delete must happen manually)

// uhbWord - update or add or delete (delete involves first deleting related uhbTagSubmissions)
// ugntWord - update or add or delete (delete involves first deleting related ugntTagSubmissions)

// uhbVerse - replace entire table
// uhbUnitWord - replace entire table
// uhbUnitRange - replace entire table
// ugntVerse - replace entire table
// ugntUnitWord - replace entire table
// ugntUnitRange - replace entire table
// lemma - replace entire table
// partOfSpeech - replace entire table