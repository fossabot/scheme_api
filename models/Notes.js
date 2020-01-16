const mongoose = require("mongoose");
const mongoNotes = mongoose.Schema({
  created_by: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  attachments: {
    type: Array,
    required: true
  }
});

module.exports = mongoose.model("Notes", mongoNotes);
