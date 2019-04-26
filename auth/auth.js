const session = require('express-session');
const RedisStore = require('connect-redis')(session);
// const csrf = require('lusca').csrf()
const passportStrategies = require('./passportStrategies')

const redisOptions = {
  host: process.env.REDIS_HOSTNAME,
  port: process.env.REDIS_PORT
}

const fileStoreOptions = {
}

// These wrapper functions useful if I ever want to do some after login/logout
const fullLogIn = ({ res, req }) => (user, callback) => {
  req.logIn(user, err => {
    callback(err)
  })
}

const fullLogOut = ({ res, req }) => () => {
  req.logout()
}

module.exports = ({ server, getConnection, dev, authBasePath }) => {

  const getModels = () => getConnection().models
  const models = getModels()

  if (server === null) {
    throw new Error('server option must be an express server instance')
  }

  if (models === null) {
    throw new Error('models required')
  }

  const FileStore = dev ? require('session-file-store')(session) : null

  // setup auth middleware
  server.use(session({
    store: dev ? new FileStore(fileStoreOptions) : new RedisStore(redisOptions),
    secret: process.env.SESSION_SECRET || 'secret',
    saveUninitialized: false,
    resave: false,
    rolling: true,  // age of the session is lengthened upon each user visit
    httpOnly: true,
    cookie : { maxAge: parseInt(process.env.SESSION_MAXAGE) || 1000*60*60*24*30 }, // configure when sessions expires
  }))
  // server.use(csrf)
  // server.use(passport.initialize())
  // server.use(passport.session())

  server.use((req, res, next) => {
    req.fullLogIn = fullLogIn({ req, res })
    req.fullLogOut = fullLogOut({ req, res })
    next()
  })

  passportStrategies.configure({ server, getModels, authBasePath })

}