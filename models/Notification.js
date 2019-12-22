const mongoose = require('mongoose')

let notificationModel = mongoose.Schema({
  message: {
    type: String,
    required: true
  },

  type: {
    type: String,
    default: 'info'
  },
  for: {
    type: String,
    required: true
  },
  is_read: {
    type: String,
    default: false
  },
  content: {
    type: Array | Object
  }
})

module.exports = mongoose.model('Notification', notificationModel)
