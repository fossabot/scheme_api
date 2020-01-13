const helpers = require("./../../helpers");
const methods = require("./clientMethods");

module.exports = {
  getOneClient: (req, res) => {
    methods
      .getOneClient(req)
      .then(response => {
        helpers.success(res, response);
      })
      .catch(error => {
        helpers.error(res, error);
      });
  },
  createClient: (req, res) => {
    methods
      .createClient(req)
      .then(response => {
        helpers.success(res, response);
      })
      .catch(error => {
        helpers.error(res, error);
      });
  },

  getAllClients: (req, res) => {
    methods
      .getAllClients(req)
      .then(response => {
        helpers.success(res, response);
      })
      .catch(error => {
        helpers.error(res, error);
      });
  },

  updateClient: (req, res) => {
    methods
      .updateClient(req)
      .then(response => {
        helpers.success(res, response);
      })
      .catch(error => {
        helpers.error(res, error);
      });
  },

  deleteClient: (req, res) => {
    methods
      .deleteClient(req)
      .then(response => {
        helpers.success(res, response);
      })
      .catch(error => {
        helpers.error(res, error);
      });
  }
};
