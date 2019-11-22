const helpers = require('./../../helpers/helpers')
const methods = require('./requestMethods')

exports.getAllRequests = (req, res) => {
  methods
    .getAllRequests(req, res)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => helpers.error(res, err))
}

exports.approveRequest = (req, res) => {
  methods
    .approveRequest(req, helpers)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}
exports.declineRequest = (req, res) => {
  methods
    .declineRequest(req, helpers)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}
