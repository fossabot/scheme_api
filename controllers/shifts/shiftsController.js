const methods = require('./shiftMethods')
const helpers = require('./../../helpers/helpers')
module.exports = {
  deleteShift: (req, res) => {
    methods
      .deleteShift(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  },
  createShift: (req, res) => {
    methods
      .createShift(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  },

  getAllShifts: (req, res) => {
    methods
      .getShift(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  },

  updateShift: (req, res) => {
    methods
      .updateShift(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  }
}
