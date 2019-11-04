const mongoose = require('mongoose')

let requestObj = new mongoose.Schema({
  date_created: {
    type: Date,
    default: Date.now
  },
  is_read: {
    type: Boolean,
    default: false
  },
  is_approved: {
    type: Object,
    default: {
      admin: 0,
      employee: 0
    }
  },
  // 1 creating new shift 2 Editting shift 3 holiday 4 editting holiday
  request_type: {
    type: String,
    default: 1
  },
  shift_id: {
    type: String,
    default: 'New Shift'
  },
  participants: {
    type: Object,
    required: true
  }
})

module.exports = mongoose.model('Request', requestObj)
