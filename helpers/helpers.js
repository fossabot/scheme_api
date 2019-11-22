const admin = require('./admin')
const date = require('./date')
const db = require('./db')
const getters = require('./getters')

module.exports = {
  error(res, err) {
    let error
    if (typeof err == 'object' && err.hasOwnProperty('message')) {
      error = err
    } else if (typeof err == 'string') {
      error = { message: err }
    }

    console.error(err)
    res
      .json({
        success: false,
        error
      })
      .end()
  },
  success(res, success) {
    res
      .json({
        success: true,
        success
      })
      .end()
  },
  admin,
  date,
  db,
  getters
}
