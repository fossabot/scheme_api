const helpers = require("../../helpers");
const Task = require("../../models/Task");
module.exports = {
  createTasks: async req => {
    try {
      
      const { content, assignedTo, category, attachments } = req.body;
      
      assignedTo ? (assignedTo = req.user._id) : assignedTo;
      
      // Create notification for the user if they are not the assignee

      await new Task.save({
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
  getTasks: async req => {

    try {
      let tasks = await Task.find({ assignedTo: req.user._id });

    
      return Promise.resolve(tasks);

    } catch (error) {

      return Promise.reject(error);
    }
  },
  editTasks: async req => {
    try {
      const { id, update } = req.body;
      let task = await Task.findByIdAndUpdate({ _id: id }, { ...update });
      return Promise.resolve(task);
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
