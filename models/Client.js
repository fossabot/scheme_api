const mongoose = require('mongoose')

const clientSchema = mongoose.Schema({
  image: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Client', clientSchema)
