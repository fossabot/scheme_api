const admin = require('./admin')
const date = require('./date')
const db = require('./db')
const getters = require('./getters')
const socket = require('./socket')
let responseObj = {
  success: {
    success: true,
    message: ''
  },
  error: {
    error: true,
    message: ''
  }
}

module.exports = {
  error(res, err) {
    console.log(err)
    const conditions = typeof err == 'object' && err.hasOwnProperty('message')
    if (conditions) {
      responseObj.error.message = err.message
    } else if (typeof err == 'string') {
      responseObj.error.message = err
    }

    res.json(responseObj.error).end()
  },
  success(res, success) {
    const conditions =
      typeof success == 'object' && success.hasOwnProperty('message')
    if (conditions) {
      responseObj.success.message = success.message
    } else if (typeof success == 'string') {
      responseObj.success.message = success
    }
    res.json(responseObj.success).end()
  },
  admin,
  date,
  db,
  getters,
  socket
}
