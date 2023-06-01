const fetch = require('node-fetch')

const pingToKeepAlive = async () => {
  if(!process.env.DO_PING) return
  console.log('pingToKeepAlive...')
  await fetch(`https://data.bibletags.org`)
  console.log('pingToKeepAlive...success')
}

module.exports = pingToKeepAlive