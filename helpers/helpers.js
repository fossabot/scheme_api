const admin = require('./admin')
const date = require('./date')
const db = require('./db')
const getters = require('./getters')

module.exports = {
  error(res, err) {
    res
      .json({
        success: false,
        err
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
