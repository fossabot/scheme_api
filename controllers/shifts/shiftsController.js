const methods = require('./shiftMethods')
const helpers = require('./../../helpers/helpers')

exports.pickUpShift = (req, res) => {
  methods
    .pickupShift(req, helpers)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}
exports.allRequests = (req, res) => {
  methods
    .returnAllRequests(req, helpers)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}

exports.approveShift = (req, res) => {
  methods
    .approve(req, res)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}

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

exports.dropShift = (req, res) => {
  methods
    .dropShift(req, res, helpers)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}
