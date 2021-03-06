const methods = require("./templateMethods");
const helpers = require("../../helpers");
module.exports = {
  delete: (req, res) => {
    methods
      .delete(req)
      .then(response => helpers.success(res, response))
      .catch(error => helpers.error(res, error));
  },
  create: (req, res) => {
    methods
      .create(req)
      .then(response => helpers.success(res, response))
      .catch(error => helpers.error(res, error));
  },
  update: (req, res) => {
    methods
      .update(req)
      .then(response => helpers.success(res, response))
      .catch(error => helpers.error(res, error));
  },
  getTemplates: (req, res) => {
    methods
      .getTemplates(req)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err));
  }
};
