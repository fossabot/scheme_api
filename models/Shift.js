const mongoose = require('mongoose')
const shiftObj = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: Date.now
  },
  employee_type: {
    type: Number,
    required: true
  },
  is_approved: {
    type: Object,
    default: {
      admin: 0,
      user: 1
    }
  },
  start_datetime: {
    type: Date,
    required: true
  },
  end_datetime: {
    type: Date,
    required: true
  },
  // 1 (Normal), 2(Locumn), 3(Holiday)
  shift_type: {
    type: Number,
    required: true
  },
  is_pickup: {
    type: Boolean,
    default: false
  }
})
module.exports = mongoose.model('Shift', shiftObj)
