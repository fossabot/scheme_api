const mongoose = require('mongoose')
const messageModel = mongoose.Schema({
  sender: {
    type: String
  },
  time: {
    type: Date,
    default: Date.now
  },
  attachments: {
    type: String
  },
  is_read: {
    type: Boolean
  },
  content: {
    type: String,
    required: true
  },
  transcript: {
    type: Object
    // {
    //     id:,
    //     sender:"",
    //     reciever:""
    // }
  }
})
module.exports = mongoose.model('Message', messageModel)
