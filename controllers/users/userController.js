const userData = require('./../../db/users')
const LocalStrategy = require('passport-local').Strategy

module.exports = (fs, helpers, passport) => {
  const login = (req, res) => {
    if (!req.body['email']) {
      helpers.createError(req, res, {
        message:
          'Failed to login, please enter your email or password please ?',
        code: 1010
      })
    }
    res.json({
      user: userManagement.getUser(req),
      type: 'success'
    })
    // return passport.authenticate(
    //   'local',
    //   { session: false },
    //   (err, passportUser, info) => {
    //     if (err) {
    //       return next(err)
    //     }
    //     if (passportUser) {
    //       const user = passportUser
    //       // user.token = passportUser.generateJWT();
    //       return res.json({ user: user })
    //     }

    //     return res.json({ status: 400 })
    //   }
    // )(req, res, next)
    // userManagement.initPassport(passport)
  }
  const getUserInfo = (req, res) => {}
  const register = (req, res) => {}

  let userManagement = {
    // forgotPassword: function(req, res) {},
    // forgotEmail: function(req, res) {},
    getUser: function(req) {
      return req.body.email
        ? userData.users.find(user => user.email == req.body.email)
        : ''
    },
    initPassport: function(passport) {
      passport.use('local', { user: 'user' }, (user, done) => {
        let authUser = this.getUser(req)
        if (user != '') {
          return done(null, authUser)
        } else {
          return done(null, { message: 'Error' })
        }
      })
    }
  }
  return {
    login: login,
    register: register,
    getUserInfo: getUserInfo
  }
}
