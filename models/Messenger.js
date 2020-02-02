const mongoose = require("mongoose");
const messageModel = mongoose.Schema({
  editted: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  attachments: {
    type: Array
  },
  isRead: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: true
  },
  senderID: {
    type: String,
    required: true
  },

  recieverID: {
    type: String,
    required: true
  },
  transcriptID: {
    type: String,
    required: true
  }
});
const transcriptModel = mongoose.Schema({
  userOne: {
    type: String,
    required: true
  },
  userTwo: {
    type: String,
    required: true
  },
  dateCreated: {
    required: true,
    type: Date
  },
  dateUpdated: {
    default: Date.now,
    type: Date
  }
});
module.exports = {
  message: mongoose.model("Message", messageModel),
  transcript: mongoose.model("Transcript", transcriptModel)
};
