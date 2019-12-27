const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('./../../models/User')

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '731841805904-rcgjk7g81v9l37b8dci5382siohla6n7.apps.googleusercontent.com',
      clientSecret: 'bJTsMWaSH5pyccce3uzXSz2C',
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, cb) => {
      let user = {
        email: profile.emails[0].value
      }
      return cb(user)
    }
  )
)
