require('dotenv').config()
require('console-stamp')(console, {
  metadata: () => ('[' + Math.round(process.memoryUsage().rss / 1000000) + 'MB]'),
  colors: {
    stamp: 'yellow',
    label: 'white',
    metadata: 'green'
  },
})

const express = require('express')

const dev = process.env.NODE_ENV === 'development'
const staging = process.env.NODE_ENV === 'staging'
const bodyParser = require('body-parser')

const { createConnection, nullLikeDate } = require('./db/setupDataModel')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const schema = require('./graphql/schema')

const port = parseInt(process.env.PORT, 10) || process.env.PORT || 8081

let connection = createConnection()
let reestablishingConnection = false

connection.sync().then(() => {
  console.log('Connection has been established successfully.')

  const server = express()

  // force HTTPS and strip www
  server.use('*', function(req, res, next) {  
    if(!req.secure && req.headers['x-forwarded-proto'] !== 'https' && process.env.REQUIRE_HTTPS) {
      var secureUrl = "https://" + req.headers.host + req.url 
      res.redirect(secureUrl)
    } else if(req.headers.host.match(/^www\./)) {
      var noWWWUrl = "https://" + req.headers.host.replace(/^www\./, '') + req.url 
      res.redirect(noWWWUrl)
    } else {
      next()
    }
  })

  //stop blacklisted ips
  server.use((req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress || 'unknown'
    if(process.env.BLACKLISTED_IPS && process.env.BLACKLISTED_IPS.indexOf(ip) != -1) {
      console.error(`[${new Date().toDateString()}] Rejected request from IP address: ${ip}`)
      return res.status(403).send('You have been blacklisted. Please contact us if you feel this is a mistake.')
    }
    next()
  })

  //ensure database is up and running
  server.use((req, res, next) => {
    connection.authenticate()
      .then(() => {
        next()
      })
      .catch(err => {
        if(reestablishingConnection) {
          console.log("DB connection was lost. Connection is being re-established on another thread. Failing.")
          return res.status(503).send('Server temporarily unavailable.')
        }
        console.log("DB connection was lost. Trying to re-establish it...")
        reestablishingConnection = true
        connection = createConnection()
        connection.sync().then(() => {
          console.log("DB connection re-established.")
          next()
        }).catch(() => {
          reestablishingConnection = false
          throw new Error('DB connection could not be re-established.')
        })
      })
  })

  // take care of general middleware
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }))

  // allow cors
  server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", dev ? "*" : (staging ? "https://cdn.staging.bibletags.org" : "https://cdn.bibletags.org"))
    res.header("Access-Control-Allow-Headers", "*")
    res.header('Access-Control-Allow-Methods', "*")

    if(req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }

    next()
  })

  // graphql middleware
  server.use(bodyParser.text({ type: 'application/graphql' }))
  server.use((req, res, next) => {
    if (req.is('application/graphql')) {
      req.body = { query: req.body }
    }
    next()
  })

  if(dev) {
    server.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql',
    }))
  }

  server.use('/graphql', graphqlExpress(req => ({
    schema: schema({ connection, nullLikeDate }),
    context: { req },
  })))

  server.listen(port, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:' + port)
  })

})
