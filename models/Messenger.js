const mongoose = require('mongoose')
const messageModel = mongoose.Schema({
  editted: {
    type: Boolean,
    default: false
  },
  time: {
    type: Date,
    default: Date.now
  },
  attachments: {
    type: String
  },
  is_read: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: true
  },
  sender_id: {
    type: String,
    required: true
  },

  reciever_id: {
    type: String,
    required: true
  },
  transcript_id: {
    type: String,
    required: true
  }
})
const transcriptModel = mongoose.Schema({
  user_1: {
    type: String,
    required: true
  },
  user_2: {
    type: String,
    required: true
  },
  created_at: {
    required: true,
    type: Date
  },
  updated_at: {
    default: Date.now,
    type: Date
  }
})
module.exports = {
  message: mongoose.model('Message', messageModel),
  transcript: mongoose.model('Transcript', transcriptModel)
}
