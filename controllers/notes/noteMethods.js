const Note = require("../../models/Note");
module.exports = {
  getNotes: async req => {
    try {
      const notes = await Note.find({ assignedTo: req.user._id });
      return Promise.resolve(notes);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  createNote: async req => {
    try {
      const params = req.body;
      params.assignedTo = req.user._id;
      await new Note(params).save();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  removeAllNotes: async req => {
    try {
      await Note.deleteMany({ assignedTo: req.user._id });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  },
  removeNote: async req => {
    try {
      const { id } = req.body;
      await Note.findByIdAndDelete(id);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  updateNote: async req => {
    try {
      const { id, update } = req.body;
      await Note.findByIdAndUpdate(id, ...update);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
