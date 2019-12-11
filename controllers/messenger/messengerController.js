const methods = require('./messengerMethods')
const helpers = require('./../../helpers/helpers')
exports.getAll = (req, res) => {
  methods
    .getAll(req)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}
