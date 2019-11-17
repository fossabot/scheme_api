const admin = require('./admin')
const date = require('./date')
const db = require('./db')
const getters = require('./getters')

module.exports = () => {
  function error(res, err) {
    res
      .json({
        success: false,
        message: err['message'],
        code: !err['code'] ? 101 : err['code']
      })
      .end()
  }
  function success(res, obj) {
    res
      .json({
        success: true,
        ...obj
      })
      .end()
  }

  return {
    error: error,
    date: date,
    db: db,
    success: success,
    admin: admin,
    get: getters
  }
}
