const jwt = require('jsonwebtoken')

const isRouteAllowed = (req, res, next) => {
  const token = req.header('Authorisation')
  if (!token) {
    res.json({ message: 'No token detected' })
  } else {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded
        next()
      }
    })
  }
}
module.exports = isRouteAllowed
