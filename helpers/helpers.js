const admin = require('./admin')
const date = require('./date')
const db = require('./db')
const getters = require('./getters')
const socket = require('./socket')
let responseObj = {
  success: {
    success: true,
    content: ''
  },
  error: {
    error: true,
    content: ''
  }
}

module.exports = {
  error(res, err) {
    console.log(err)

    responseObj.error.content = err.hasOwnProperty('message')
      ? err.message
      : err

    res.json(responseObj.error).end()
  },
  success(res, success) {
    responseObj.success.content = success

    res.json(responseObj.success).end()
  },
  validate(req, res, key) {
    const params = req.body
    if (!params[key]) {
      this.error(res, 'Missing paramter please try again')
      return false
    } else {
      return true
    }
  },
  admin,
  date,
  db,
  getters,
  socket
}
