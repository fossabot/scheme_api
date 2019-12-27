const mongoose = require('mongoose')
// 1 (admin), 2(Normal), 3(Locumn)

const userSchema = new mongoose.Schema({
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
  phone_number: {
    type: Number
  },
  address: {
    type: Object
  },
  employee_type: {
    type: Number,
    required: true,
    default: 2
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
  client_id: {
    type: String,
    max: 1024,
    required: false
  },

  gender: {
    type: String,
    required: true
  },
  date_of_birth: {
    required: true,
    type: Date
  },
  admin_gen: {
    type: Boolean,
    default: false
  },
  preferences: {
    type: Object,
    default: {
      general: {
        live_schedule: false,
        live_notifications: false,
        live_dashboard: false,
        notifications: false
      }
    },
    required: false
  }
})
module.exports = mongoose.model('User', userSchema)
