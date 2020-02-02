const mongoose = require("mongoose");
const shiftSchema = new mongoose.Schema({
  assignedTo: {
    type: Array,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  
  status:{
    type:String,
    default:'incomplete'
  },

  isApproved: {
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
  // 1 (General), 2(Locumn), 3(Holiday) 4(Time OfF) 5 Sick Leave
  type: {
    type: Number,
    required: true
  },
  isPickup: {
    type: Boolean,
    default: false
  },

  repeatDays: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: null
  }
});
module.exports = mongoose.model("Shift", shiftSchema);
