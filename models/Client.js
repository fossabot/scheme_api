const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  userTypes: {
    type: Array,
    required: true
  },
  subdomain: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  colours: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  storageRef: {
    type: String,
    required: true
  },
  userGroups: {
    type: Array,
    default: [
      {
        name: "Admins",
        value: 1
      },
      {
        name: "General Staff",
        value: 2
      }
    ],

    required: false
  }
});

module.exports = mongoose.model("Client", clientSchema);
