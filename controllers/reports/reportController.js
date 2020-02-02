const methods = require("./reportMethods");
const helpers = require("../../helpers");

module.exports = {
  metrics: (req, res) => {
    methods
      .metrics(req, res)
      .then(response => helpers.success(res, response))
      .catch(error => helpers.error(res, error));
  },
  shifts: (req, res) => {
    methods
      .shifts(req, res)
      .then(response => helpers.success(res, response))
      .catch(error => helpers.error(res, error));
  },
  weekly: (req, res) => {
    methods
      .weekly(req, res)
      .then(response => helpers.success(res, response))
      .catch(error => helpers.error(res, error));
  }
};
