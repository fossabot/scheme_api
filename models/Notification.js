const mongoose = require("mongoose");

let notificationModel = mongoose.Schema({
  message: {
    type: String,
    required: true
  },

  type: {
    type: String,
    default: "info"
  },
  for: [
    {
      user_id: String
    }
  ],
  status: {
    type: String,
    default: "unread"
  },
  requestBody: {
    type: Object
  },
  content: {
    type: Object
  },
  url: {
    type: String
  },
  requested_by: {
    type: String,
    required: false
  },
  created_at: {
    default: Date.now,
    type: Date
  }
});

module.exports = mongoose.model("Notification", notificationModel);
