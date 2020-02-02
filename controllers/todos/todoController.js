const helpers = require("../../helpers");
const methods = require("./todoMethods");
module.exports = {
  create: (req, res) => {
    methods
      .create(req, helpers)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err));
  },
  get: (req, res) => {
    methods
      .get(req, helpers)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err));
  },
  edit: (req, res) => {
    methods
      .edit(req, helpers)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err));
  },
  remove: (req, res) => {
    methods
      .remove(req, helpers)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err));
  }
};
