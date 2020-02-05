const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  dueDate: {
    type: Date,
    default: null,
  },
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
    type: Array,
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
    /**
     * content:{
     * titlk}
     */
    required: true
  },
  completeDate: {
    type: Date,
    default:null
  }
});

module.exports = mongoose.model("Todo", taskSchema);