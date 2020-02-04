const { success, error } = require("../../helpers");
const {
  getNotes,
  createNote,
  removeNote,
  updateNote,
  removeAllNotes
} = require("./noteMethods");
module.exports = {
  get(req, res) {
    getNotes(req)
      .then(response => {
        success(res, response);
      })
      .catch(err => {
        error(res, err);
      });
  },
  create(req, res) {
    createNote(req)
      .then(response => {
        success(res, response);
      })
      .catch(err => {
        error(res, err);
      });
  },
  remove(req, res) {
    removeNote(req)
      .then(response => {
        success(res, response);
      })
      .catch(err => {
        error(res, err);
      });
  },
  removeAll(req, res) {
    removeAllNotes(req)
      .then(response => {
        success(res, response);
      })
      .catch(err => {
        error(res, err);
      });
  },
  update(req, res) {
    updateNote(req)
      .then(response => {
        success(res, response);
      })
      .catch(err => {
        error(res, err);
      });
  }
};
