const mongoose = require('mongoose')

const Message = mongoose.Schema({
  message_content: {
    type: String,
    required: true
  },
  sent_date: {
    type: Date,
    default: Date.now
  },
  message_attachments: {
    type: String
  },
  sender: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  is_read: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Message', Message)
