const express = require('express')
const router = express.Router()
const passport = require('passport')
const helpers = require('./../helpers/helpers')
const methods = require('./../controllers/users/userMethods')
require('./../controllers/service/google')
require('./../controllers/service/facebook')

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email']
  })
)

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', async (user, err) => {
    if (err) {
      return helpers.error(res, err)
    }

    try {
      req.body = user
      let loggedInUser = await methods.login(req, helpers, true)
      helpers.success(res, loggedInUser)
    } catch (err) {
      return helpers.error(res, err)
    }
  })(req, res, next)
})

module.exports = router
