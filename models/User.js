const mongoose = require('mongoose')
// 1 (admin), 2(Normal), 3(Locumn)

const userObj = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 5
  },
  email: {
    type: String,
    required: true,
    max: 255
  },
  employee_type: {
    type: Number,
    required: true,
    default: 1,
    max: 3
  },
  password: {
    type: String,
    max: 1025,
    required: true,
    min: 6
  },
  registered_date: {
    type: Date,
    default: Date.now
  },
  is_online: {
    type: Boolean,
    default: false
  },
  is_admin: {
    type: Boolean,
    default: false
  }
})
module.exports = mongoose.model('User', userObj)
