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
