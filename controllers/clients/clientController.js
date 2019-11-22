const helpers = require('./../../helpers/helpers')
const methods = require('./clientMethods')
exports.createClient = (req, res) => {
  methods
    .createClient(req)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}
