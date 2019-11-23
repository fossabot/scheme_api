const admin = require('./admin')
const date = require('./date')
const db = require('./db')
const getters = require('./getters')
const socket = require('./socket')
let responseObj = {
  success: {
    success: true,
    message: '',
    content: ''
  },
  error: {
    error: true,
    message: '',
    content: ''
  }
}

module.exports = {
  error(res, err) {
    console.log(err)
    const conditions =
      typeof err == 'object' ||
      (typeof err == 'array' && err.hasOwnProperty('message'))
    if (conditions) {
      responseObj.error.message = err.message
    } else if (typeof err == 'string') {
      responseObj.error.message = err
    }

    res.json(responseObj.error).end()
  },
  success(res, success) {
    const conditions =
      typeof success == 'object' ||
      (typeof success == 'array' && success.hasOwnProperty('message'))
    if (conditions) {
      responseObj.success.message = success.message
      responseObj.success.content = success
    } else if (typeof success == 'string') {
      responseObj.success.message = success
    }
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
