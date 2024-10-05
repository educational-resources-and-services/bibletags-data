'use strict'

require('dotenv').config()
require('./src/setNonSecretEnv')()
const serverless = require("serverless-http")
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const app = express()
const { authenticate, setUpSessionSyncAuthRoutes } = require('session-sync-auth-site')
const compression = require('compression')

const { connectionObj, setUpConnection } = require('./src/db/connect')
const { schema, root } = require('./src/schema')
const { authenticateViaEmbeddingApp, doFakeAuthIfTesting, doI18nSetup } = require('./src/utils')
const exampleApi = require('./src/apis/example')

// Middleware
app.use(async (req, res, next) => {
  // Connect to DB if not already connected
  if(global.connection) {
    try {
      await connection.query(`SELECT 1`)  // test the connection
    } catch(err) {
      console.error(`Connection was present, but not working. Attempting to delete and re-establish it.`, err)
      delete global.connection
    }
  }
  if(!global.connection) {
    console.log('Establishing DB connection...')
    setUpConnection()
    await global.connection.authenticate()
    console.log('...DB connection established.')
  }
  next()
})
app.use(
  [
    "/apis/example",
  ],
  bodyParser.raw({ type: 'application/json' }),
)
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors({ origin: true }))
app.use(doI18nSetup)
app.use(authenticate({
  connectionObj,
  userTableColNameMap: {
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    language: 'languageId',
  },
}))
app.use(authenticateViaEmbeddingApp())
app.use(compression())

if(process.env.LOCAL) {
  app.use(doFakeAuthIfTesting())
}

// Auth
setUpSessionSyncAuthRoutes({
  app,
  siteId: process.env.AUTH_SITE_ID,
  authDomain: process.env.AUTH_DOMAIN,
  protocol: process.env.AUTH_PROTOCOL || 'https',
  jwtSecret: process.env.AUTH_JWT_SECRET,
})

// GraphQL
const runGraphql = graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: !!process.env.LOCAL,
})
app.use('/graphql', async (req, res, next) => {

  // handle batch queries
  if(req.body instanceof Array) {
    res.origSend = res.send
    const origReqBody = req.body
    const responseBodies = []

    for(let graphqlQuery of origReqBody) {
      await new Promise(resolve => {
        res.send = body => {
          responseBodies.push(body)
          resolve()
        }
        req.body = graphqlQuery
        runGraphql(req, res, next)
      })
    }
    res.origSend(`[${responseBodies.join(',')}]`)
    return
  }

  runGraphql(req, res, next)

})

// Webhooks and APIs
app.use("/apis/example", exampleApi())

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('Internal Serverless Error')
})

// Local listener
if(!!process.env.LOCAL) {
  app.listen(8082, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:8082')
  })
}

module.exports.handler = serverless(app)