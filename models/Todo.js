const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  attachments: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: "General"
  },
  createdBy: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  },
  state: {
    // todo doing done defer ?
    type: String,
    default: "incomplete"
  },
  content: {
    type: String,
    required: true
  },
  completeDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Todo", todoSchema);
