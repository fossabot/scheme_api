const Template = require("../../models/Template");
module.exports = {
  update: async req => {
    try {
      const params = req.body;
      const id = params.id;
      const updateContent = params.update;
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
