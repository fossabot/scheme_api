const mongoose = require('mongoose')

const Message = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  sent_date: {
    type: Date,
    default: Date.now
  },
  attachmenets: {
    type: String
  },
  transcript_id: {
    type: String,
    required: true
  },
  participants: {
    type: Object
    /**
     * {
     *  sender:id,
     *  reciever:id
     * }
     */
  }
})

module.exports = mongoose.model('Message', Message)
