const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  client_subdomain: {
    type: String,
    required: true
  },
  client_phone: {
    type: String,
    required: true
  },
  client_name: {
    type: String,
    required: true
  },
  client_image: {
    type: String,
    required: true
  },
  client_colours: {
    type: String,
    required: true
  },
  registration_date: {
    type: Date,
    default: Date.now
  },
  stroage_ref: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Client", clientSchema);
