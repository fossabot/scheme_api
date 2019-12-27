const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('./../../models/User')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
