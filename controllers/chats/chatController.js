const methods = require('./chatMethods')
const helpers = require('../../helpers/helpers')

exports.init = (req, res) => {
  methods
    .init(req)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}

exports.sendMessage = (req, res) => {
  methods
    .sendMessage(req)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}

exports.getChatTranscript = (req, res) => {
  methods
    .getChatTranscript(req)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(error => {
      helpers.error(res, error)
    })
}
