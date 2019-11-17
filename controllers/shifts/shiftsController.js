const methods = require('./shiftMethods')
module.exports = helpers => {
  const pickUpShift = (req, res) => {
    methods
      .pickupShift(req, helpers)
      .then(response => {
        helpers.success(res, { extras: response })
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }
  const allRequests = (req, res) => {
    methods
      .returnAllRequests(req, helpers)
      .then(response => {
        helpers.success(res, { extras: response })
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }

  const approveShift = (req, res) => {
    methods
      .approve(req, res)
      .then(response => {
        helpers.success(res, { extras: response })
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }

  const createShift = (req, res) => {
    methods
      .createShift(helpers, req, res)
      .then(response => {
        helpers.success(res, { extras: response })
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }

  const getAllShifts = (req, res) => {
    methods
      .getShifts(req, 'all')
      .then(response => {
        helpers.success(res, { extras: response })
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }

  const updateShift = (req, res) => {
    methods
      .update(req, res, helpers)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(error => {
        helpers.error(res, error)
      })
  }

  const dropShift = (req, res) => {
    methods
      .dropShift(req, res, helpers)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }

  return {
    getAllShifts: getAllShifts,
    createShift: createShift,
    updateShift: updateShift,
    dropShift: dropShift,
    approveShift: approveShift,
    allRequests: allRequests,
    pickUpShift: pickUpShift
  }
}
