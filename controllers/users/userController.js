const methods = require("./userMethods");
const helpers = require("./../../helpers");
module.exports = {
  registerMultiple: (req, res) => {
    methods
      .registerMultiple(req, helpers)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err));
  },
  forgotPassword: (req, res) => {
    methods
      .forgotPassword(req, helpers)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err));
  },
  updateNewEmployee: (req, res) => {
    methods
      .updateNewEmployee(req, helpers)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err));
  },

  verifyUser: (req, res) => {
    methods
      .verifyUser(req, helpers)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err));
  },

  getAllUsers: (req, res) => {
    methods
      .getAllUsers(req, res, helpers)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err));
  },

  login: (req, res) => {
    methods
      .login(req)
      .then(response => helpers.success(res, response))
      .catch(error => helpers.error(res, error));
  },

  logOut: (req, res) => {
    methods
      .logOut(req, res)
      .then(response => {
        helpers.success(res, response);
      })
      .catch(error => {
        helpers.error(res, error);
      });
  },

  register: (req, res) => {
    methods
      .register(req, helpers)
      .then(response => {
        res.header("Authorisation", response.token);
        helpers.success(res, response);
      })
      .catch(error => helpers.error(res, error));
  },

  updateUser: (req, res) => {
    methods
      .updateUser(req, res)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err));
  },
  removeUser: (req, res) => {
    methods
      .removeUser(req)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err));
  }
};
