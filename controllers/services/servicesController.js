const { success, error } = require("../../helpers");
const { gcal } = require("./servicesMethods");

module.exports = {
  initGoogleCal: (req, res) => {
    gcal(req)
      .then(response => {
        success(res, response);
      })
      .catch(err => {
        error(res, err);
      });
  }
};
