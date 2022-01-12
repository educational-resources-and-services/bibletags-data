const passport = require('passport')

exports.configure = ({ server, getModels, authBasePath } = {}) => {

  const User = getModels().user
  
  if (server === null) {
    throw new Error('server option must be an express server instance')
  }

  if (User === null) {
    throw new Error('user option must be a User model')
  }

  const getUserFromProfile = (profile) => {
    return {
      email: profile.emails && profile.emails[0] && profile.emails[0].value,
    }
  }

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  })

  passport.deserializeUser(function(userId, done) {
    const User = getModels().user
    User.findById(userId).then(user => {
      done(null, user && {
        id: user.id,
        email: user.email,
        facebook: Boolean(user.facebook),
        google: Boolean(user.google),
      })
    })
  })

  const providers = [
    {
      providerName: 'facebook',
      providerOptions: {
        scope: ['email', 'public_profile'],
      },
      Strategy: require('passport-facebook').Strategy,
      strategyOptions: {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        profileFields: ['id', 'displayName', 'email', 'link'],
      },
    },
    {
      providerName: 'google',
      providerOptions: {
        scope: ['profile', 'email'],
      },
      Strategy: require('passport-google-oauth20').Strategy,
      strategyOptions: {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      },
    },
  ]

  providers.forEach(({ providerName, Strategy, strategyOptions }) => {
    if(strategyOptions.clientID && strategyOptions.clientSecret) {

      strategyOptions.callbackURL = 'https://api.bibletags.org' + authBasePath + '/oauth/' + providerName + '/callback'
      strategyOptions.passReqToCallback = true

      passport.use(providerName, new Strategy(strategyOptions, (req, accessToken, refreshToken, profile, next) => {
        try {
          // Normalize the profile into user object fields
          const userProfile = getUserFromProfile(profile)
          
          if(!userProfile.email) {
            // TODO: I need to count it as a non-login if they reject some of the necessary info
            return next(new Error('invalid oAuth response'))
          }

          const User = getModels().user

          // See if we have this oAuth account in the database associated with a user
          User.findOne({ where: { [providerName]: profile.id } }).then((user) => {
            if(req.user) {
              // If the current session is logged in

              // If the oAuth account is not linked to another account, link it and exit
              if(!user) {
                return User.findById(req.user.id).then((user) => {
                  if(!user) {
                    return next(new Error('Could not find current user in database.'))
                  }

                  user[providerName] = profile.id
                  user.save().then(() => {
                    return next(null, user)
                  })
                })
              }

              // If oAuth account already linked to the current user return okay
              if(req.user.id === user.id) {
                return next(null, user)
              }

              // If the oAuth account is already linked to different account, exit with error
              if(req.user.id !== user.id) {
                return next(null, false, {message: 'associated with another login'}) //This account is already associated with another login.
              }

            } else {
              // If the current session is not logged in

              // If we have the oAuth account in the db then let them log in as that user
              if(user) {
                return next(null, user)
              }

              // If we don't have the oAuth account in the db, check to see if an account with the
              // same email address as the one associated with their oAuth acccount exists in the db
              User.findOne({ where: { email: userProfile.email } }).then(user => {
                // If we already have an account associated with that email address in the databases, the user
                // should log in with that account instead (to prevent them creating two accounts by mistake)
                // Note: Automatically linking them here could expose a potential security exploit allowing someone
                // to pre-register or create an account elsewhere for another users email address, so don't do that.
                if(user) {
                  return next(null, false, {message: 'first log in via email'}) //An account already exists with this email. In order to connect your ' + providerName + ' account, you first must log in through email.
                }

                // If account does not exist, create one for them and log the user in
                return User.create({
                  email: userProfile.email,
                  [providerName]: profile.id,
                }).then(user => {
                  return next(null, user)
                })
              })
            }
          })
        } catch (err) {
          next(err)
        }
      }))
    }
  })

  // Initialise Passport
  server.use(passport.initialize())
  server.use(passport.session())

  // Add routes for each provider
  providers.forEach(({ providerName, providerOptions }) => {
    
    // Route to start login
    server.get(authBasePath + '/oauth/' + providerName, (req, res, next) => {
      passport.authenticate(providerName, providerOptions)(req, res, next);
    })

    // Route to call back to after logging in
    server.get(authBasePath + '/oauth/' + providerName + '/callback', (req, res, next) => {
      passport.authenticate(providerName, (err, user, info) => {
        if(err) return next(err)

        if(user) {
          req.fullLogIn(user, err => {
            if(err) return next(err)
            req.session.save(() => {
              return res.redirect('/account')
            })
          })

        } else {
          return res.redirect(`/login?error=${encodeURIComponent(info.message || '')}`)
        }

      })(req, res, next);
    })

    // Route to post to unlink accounts
    server.post(authBasePath + '/oauth/' + providerName + '/unlink', (req, res, next) => {
      if(!req.user) {
        next(new Error('Not logged in'))
      }

      const User = getModels().user
      
      // Lookup user
      User.findById(req.user.id).then((user) => {
        if(!user) {
          next(new Error('Unable to look up account for current user'))
        }

        // Remove connection between user account and oauth provider
        user[providerName] = null
        user.save().then(() => {
          return res.redirect('/account')
        })
      })
    })
  })

  // A catch all for providers that are not configured
  server.get(authBasePath + '/oauth/:provider', (req, res) => {
    res.redirect(authBasePath + '/not-configured')
  })

  return passport
} 