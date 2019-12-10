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

exports.getAllClients = (req, res) => {
  methods
    .getAllClients(req)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}

exports.updateClient = (req, res) => {
  methods
    .updateClient(req)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}

exports.deleteClient = (req, res) => {
  methods
    .deleteClient(req)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}
