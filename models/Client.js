const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  logo: {
    type: String,
    required: true
  },
  company_phone: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  registration_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Client", clientSchema);
