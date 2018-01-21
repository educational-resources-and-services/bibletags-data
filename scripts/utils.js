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
      "Ruth": "8",
      "1Sam": "9",
      "2Sam": "10",
      "1Kgs": "11",
      "2Kgs": "12",
      "1Chr": "13",
      "2Chr": "14",
      "Ezra": "15",
      "Neh": "16",
      "Esth": "17",
      "Job": "18",
      "Ps": "19",
      "Prov": "20",
      "Eccl": "21",
      "Song": "22",
      "Isa": "23",
      "Jer": "24",
      "Lam": "25",
      "Ezek": "26",
      "Dan": "27",
      "Hos": "28",
      "Joel": "29",
      "Amos": "30",
      "Obad": "31",
      "Jonah": "32",
      "Mic": "33",
      "Nah": "34",
      "Hab": "35",
      "Zeph": "36",
      "Hag": "37",
      "Zech": "38",
      "Mal": "39",
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
  