const mongoose = require("mongoose");

const notesSchema = mongoose.Schema({
  assignedTo: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },
  attachments: {
    type: String,
    default: null
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Notes", notesSchema);
