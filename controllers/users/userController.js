const methods = require('./userMethods')
const helpers = require('./../../helpers/helpers')

exports.upgradePermissions = (req, res) => {
  methods
    .updatePermissions(req, res)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}
exports.getUser = (req, res) => {
  methods
    .getOneUser(req, helpers)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}

exports.getUsers = (req, res) => {
  methods
    .getAllUsers()
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}

exports.login = (req, res) => {
  methods
    .login(req, helpers)
    .then(response => {
      res.header('Authorisation', helpers.admin.sign(response))
      helpers.success(res, response)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}

exports.logOut = (req, res, helpers) => {
  methods
    .logOut(req, res)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}

exports.register = (req, res) => {
  methods
    .register(req, helpers)
    .then(response => {
      res.header('Authorisation', helpers.admin.sign(response.user))
      helpers.success(res, response.message)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}

exports.updateUser = (req, res) => {
  methods
    .updateUser(req, res)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}
exports.removeUser = (req, res) => {
  methods
    .removeUser(req)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}
