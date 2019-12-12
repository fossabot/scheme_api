const methods = require('./shiftMethods')
const helpers = require('./../../helpers/helpers')
module.exports = {
  createShift: (req, res) => {
    methods
      .createShift(helpers, req, res)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  },

  getAllShifts: (req, res) => {
    methods
      .get(req, 'all')
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  },

  updateShift: (req, res) => {
    methods
      .update(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  }
}
