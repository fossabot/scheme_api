const Template = require("../../models/Template");
module.exports = {
  delete: async req => {
    try {
      const { id } = req.body;
      await Template.deleteOne({ _id: id });
      return Promise.resolve("Tmeplate successfully deleted");
    } catch (error) {
      return Promise.reject(error);
    }
  },
  create: async req => {
    // Create template
    try {
      const { name, content } = req.body;
      let foundTemplate = await Template.findOne({ name });
      if (foundTemplate) {
        return Promise.reject(
          "Template already exists with that name, please enter another name"
        );
      }
      await new Template({ name, content, assigned_to: req.user._id }).save();
      return Promise.resolve("Template successfully saved");
    } catch (error) {
      return Promise.reject(error);
    }
  },
  update: async req => {
    try {
      const { id, update } = req.body;
      await Template.updateOne({ _id: id }, updateContent);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getTemplates: async req => {
    try {
      let templates = await Template.find(
        { assigned_to: req.user._id },
        "name content date_created"
      );
      return Promise.resolve(templates);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
