const { filteredReports, weekly, shifts, metrics } = require("./reportMethods");
const { success, error } = require("../../helpers");

module.exports = {
  getfilteredReports: (req, res) => {
    filteredReports(req)
      .then(response => {
        success(res, response);
      })
      .catch(err => {
        error(res, err);
      });
  },
  getMetrics: (req, res) => {
    metrics(req, res)
      .then(response => success(res, response))
      .catch(err => error(res, err));
  },
  getShifts: (req, res) => {
    shifts(req, res)
      .then(response => success(res, response))
      .catch(err => error(res, err));
  },
  getWeekly: (req, res) => {
    weekly(req, res)
      .then(response => success(res, response))
      .catch(err => error(res, err));
  }
};
