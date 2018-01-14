const utils = {

  getBibleBookIdByAbbr: (abbr) => {
    
    return {
      "Gen": "1",
      "Exod": "2",
      "Lev": "3",
      "Num": "4",
      "Deut": "5",
      "Josh": "6",
      "Judg": "7",
      "1Sam": "8",
      "2Sam": "9",
      "1Kgs": "10",
      "2Kgs": "11",
      "Isa": "12",
      "Jer": "13",
      "Ezek": "14",
      "Hos": "15",
      "Joel": "16",
      "Amos": "17",
      "Obad": "18",
      "Jonah": "19",
      "Mic": "20",
      "Nah": "21",
      "Hab": "22",
      "Zeph": "23",
      "Hag": "24",
      "Zech": "25",
      "Mal": "26",
      "Ps": "27",
      "Prov": "28",
      "Job": "29",
      "Song": "30",
      "Ruth": "31",
      "Lam": "32",
      "Eccl": "33",
      "Esth": "34",
      "Dan": "35",
      "Ezra": "36",
      "Neh": "37",
      "1Chr": "38",
      "2Chr": "39",
    }[abbr]

  },

  doUpdatesInChunks: (connection, { updates, resultCallback }, done) => {
    updates = [...updates]
    let totalRowsUpdated = 0
    let index = 0

    const doNextChunkOfUpdates = () => {

      if(updates.length > 0) {
        const updatesChunk = updates.splice(0, 100)

        connection.query(updatesChunk.join(';'), (err, result) => {
          if(err) throw err

          if(!(result instanceof Array)) result = [result]

          result.forEach(updateResult => {
            totalRowsUpdated += updateResult.affectedRows
            if(resultCallback) resultCallback(updateResult, index++)
          })

          doNextChunkOfUpdates()
          
        })

      } else {
        done(totalRowsUpdated)

      }
    }

    doNextChunkOfUpdates()

  },

  doUpdatesInChunksAsync: ({ connection, updates }) => {
    return new Promise(resolve => {
      utils.doUpdatesInChunks(connection, { updates }, numRowsUpdated => {
        resolve(numRowsUpdated)
      })
    })
  },
  
  queryAsync: ({ connection, statement }) => {
    return new Promise(resolve => {
      connection.query(statement, (err, result) => {
        if(err) throw err
        resolve(result)
      })
    })
  },

  padWithZeros: (num, desiredNumDigits) => {
    return ('000000000000000000000000' + num).substr(desiredNumDigits*-1)
  },
 
  lengthInUtf8Bytes: str => {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
  },

}
  
module.exports = utils
  