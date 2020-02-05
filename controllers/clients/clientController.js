const { success, error } = require("./../../helpers");
const {
  getOneClient,
  getAllClients,
  createClient,
  updateClient,
  deleteClient
} = require("./clientMethods");

module.exports = {
  getOne: (req, res) => {
    getOneClient(req)
      .then(response => {
        success(res, response);
      })
      .catch(err => {
        error(res, err);
      });
  },
  create: (req, res) => {
    createClient(req)
      .then(response => {
        success(res, response);
      })
      .catch(err => {
        error(res, err);
      });
  },

  get: (req, res) => {
    getAllClients(req)
      .then(response => {
        success(res, response);
      })
      .catch(err => {
        error(res, err);
      });
  },

  update: (req, res) => {
    updateClient(req)
      .then(response => {
        success(res, response);
      })
      .catch(err => {
        error(res, err);
      });
  },

  delete: (req, res) => {
    deleteClient(req)
      .then(response => {
        success(res, response);
      })
      .catch(err => {
        error(res, err);
      });
  }
};
