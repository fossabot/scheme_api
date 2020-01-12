const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  company_phone: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  company_image: {
    type: String,
    required: true
  },
  company_colours: {
    type: Object,
    required: true
  },
  registration_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Client", clientSchema);
