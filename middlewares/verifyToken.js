const jwt = require('jsonwebtoken')
const helpers = require('./../helpers/helpers')
const isRouteAllowed = (req, res, next) => {
  const token = req.header('authorisation')
  if (!token) {
    helpers.error(res, 'No token detected')
  } else {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        helpers.error(res, err)
        return
      } else {
        req.user = decoded
        next()
      }
    })
  }
}
module.exports = isRouteAllowed
