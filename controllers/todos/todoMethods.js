const helpers = require("../../helpers");
const Todo = require("../../models/Todo");
module.exports = {
  create: async req => {
    try {
      const { content, assignedTo, category, attachments } = req.body;
      // Create notification for the user if they are not the assignee

      await new Todo.save({
        category,
        attachments,
        content,
        assignedTo,
        createdBy: req.user._id
      });
    } catch (error) {
      return new Promise.reject(error);
    }
  },
  get: async req => {
    try {
      let todos = await Todo.find({ assignedTo: req.user._id });

      return Promise.resolve(todos);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  edit: async req => {
    try {
      const { id, update } = req.body;
      let todo = await Todo.findByIdAndUpdate({ _id: id }, { ...update });
      return Promise.resolve(todo);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  remove: async req => {
    const { id } = req.body;
    try {
      await Todo.findOneAndDelete({ _id: id });
      return Promise.resolve("Todo successfully removed.");
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
