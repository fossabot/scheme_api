
const {success,error} = require("../../helpers");

const {createTasks,getTasks,editTasks,removeTasks} = require("./taskMethods");

module.exports = {
  create: (req, res) => {
    
      createTasks(req)
      .then(response => success(res, response))
      .catch(err => error(res, err));
  },
  get: (req, res) => {
    
      getTasks(req)
      .then(response => success(res, response))
      .catch(err => error(res, err));
  },
  edit: (req, res) => {
  editTasks(req)
      .then(response => success(res, response))
      .catch(err => error(res, err));
  },
  remove: (req, res) => {
    
      removeTasks(req)
      .then(response => success(res, response))
      .catch(err => error(res, err));
  }
};
