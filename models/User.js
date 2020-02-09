const mongoose = require("mongoose");

// 1 (admin), 2(Normal), 3(Locumn)

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  gcalToken: {
    type: Object,
    default: null
  },

  email: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  phoneNumber: {
    type: String
  },
  address: {
    type: Object
  },
  employeeType: {
    type: Number,
    required: true,
    default: 2
  },
  password: {
    type: String,
    max: 1025,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  clientID: {
    type: String,
    required: true
  },

  gender: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    default: new Date(+0)
  },
  adminGen: {
    type: Boolean,
    default: false
  },
  settings: {
    type: Object,
    default: {
      general: {
        liveSchedule: true,
        liveNotifications: true,
        liveDashboard: true,
        sounds: true
      },
      colourSettings: {
        accent: "#2f74eb"
      }
    },
    required: false
  }
});
module.exports = mongoose.model("User", userSchema);
