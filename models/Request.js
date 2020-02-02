const mongoose = require("mongoose");

let requestObj = new mongoose.Schema({
  dateCreated: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Object,
    default: {
      admin: 0,
      employee: 0
    }
  },
  // 1 creating new shift 2 Editting shift 3 holiday 4 editting holiday
  requestType: {
    type: String,
    default: 1
  },
  shiftID: {
    type: String,
    default: "New Shift"
  },
  participants: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model("Request", requestObj);
