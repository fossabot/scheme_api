const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
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
  }
});

module.exports = mongoose.model("Client", clientSchema);
