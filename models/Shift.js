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
  repeat_days: {
    type: Object
    // default: {
    //   repeat_days: [1, 5],
    //   reapeat_for: 1
    // }
  }
})
module.exports = mongoose.model('Shift', shiftObj)
