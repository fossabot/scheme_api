const mongoose = require("mongoose");

// 1 (admin), 2(Normal), 3(Locumn)

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  phone_number: {
    type: String
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
    required: true
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
    required: true
  },

  gender: {
    type: String,
    required: true
  },
  date_of_birth: {
    type: Date,
    default: new Date(+0)
  },
  admin_gen: {
    type: Boolean,
    default: false
  },
  settings: {
    type: Object,
    default: {
      general: {
        live_schedule: true,
        live_notifications: true,
        live_dashboard: true,
        sounds: true
      },
      colour_settings: {
        accent: "#2f74eb"
      }
    },
    required: false
  }
});
module.exports = mongoose.model("User", userSchema);
