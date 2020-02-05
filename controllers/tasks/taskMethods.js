const helpers = require("../../helpers");
const Task = require("../../models/Task");
module.exports = {
  createTasks: async req => {
    try {
      let { content, assignedTo, category, completeDate } = req.body;
      assignedTo ? assignedTo : (assignedTo = [req.user._id]);
      // Create notification for the user if they are not the assignee
      await new Task({
        category,
        content,
        assignedTo,
        completeDate,
        createdBy: req.user._id
      }).save();

      return Promise.resolve("Task successfully created");
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getTasks: async req => {
    try {
      let tasks = await Task.find()
        .where(req.user._id)
        .in(["assignedTo"])
        .or([{ createdBy: req.user._id }]);

      return Promise.resolve(tasks);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  editTasks: async req => {
    try {
      const { _id, update } = req.body;
      let task = await Task.findByIdAndUpdate({ _id }, { ...update });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  removeTasks: async req => {
    const { id } = req.body;
    try {
      await Task.findOneAndDelete({ _id: id });
      return Promise.resolve("Task successfully removed.");
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
