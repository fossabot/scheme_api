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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
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
  },
  flag: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('Shift', shiftObj)
