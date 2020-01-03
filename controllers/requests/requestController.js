const helpers = require('./../../helpers')
const methods = require('./requestMethods')

exports.getAllRequests = (req, res) => {
  methods
    .getAllRequests(req, res)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => helpers.error(res, err))
}

exports.updateRequest = (req, res) => {
  methods
    .updateRequest(req, helpers)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}
