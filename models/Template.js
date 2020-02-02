const mongoose = require("mongoose");

let mongooseTemplate = mongoose.Schema({
  name: {
    type: String,
    default: `template ${Date.now}`
  },
  content: {
    type: Array,
    required: true
  },
  assignedTo: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Template", mongooseTemplate);
