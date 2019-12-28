const jwt = require('jsonwebtoken')
const helpers = require('./../helpers/helpers')
const isRouteAllowed = (req, res, next) => {
  const token = req.header('authorisation')
  if (!token) {
    helpers.error(res, 'No token detected')
  } else {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        if (err.name == 'TokenExpiredError') {
          helpers.error(res, {
            msg: 'Token expired, please refresh by relogging in',
            tokenExpired: true
          })
        }
        helpers.error(res, err)
        return
      } else {
        req.user = decoded
        req.isAdmin = req.user.employee_type == 1
        next()
      }
    })
  }
}
module.exports = isRouteAllowed
