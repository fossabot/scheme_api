const mongoose = require("mongoose");
const shiftSchema = new mongoose.Schema({
  assigned_to: {
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
  // 1 (Normal), 2(Locumn), 3(Holiday) 4(Time OfF) 5 Sick Leave
  shift_type: {
    type: Number,
    required: true
  },
  is_pickup: {
    type: Boolean,
    default: false
  },

  repeat_days: {
    type: Object,
    default: null
  }
});
module.exports = mongoose.model("Shift", shiftSchema);
