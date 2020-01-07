const mongoose = require("mongoose");
let mongooseTemplate = mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: `shift schedule ${Date.now}`
  },
  content: {
    type: Array,
    required: true
  },
  assigned_to: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Template", mongooseTemplate);
