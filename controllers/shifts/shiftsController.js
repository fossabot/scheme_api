const methods = require('./shiftMethods')
const helpers = require('./../../helpers/helpers')

exports.createShift = (req, res) => {
  methods
    .createShift(helpers, req, res)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}

exports.getAllShifts = (req, res) => {
  methods
    .getShifts(req, 'all')
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}

exports.updateShift = (req, res) => {
  methods
    .update(req)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}
