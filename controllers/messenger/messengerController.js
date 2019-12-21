const methods = require('./messengerMethods')
const helpers = require('./../../helpers/helpers')
module.exports = {
  deleteTranscript: (req, res) => {
    methods
      .deleteTranscript(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(error => {
        helpers.error(res, error)
      })
  },
  startChat: (req, res) => {
    methods
      .startChat(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(error => {
        helpers.error(res, error)
      })
  },
  sendMessage: (req, res) => {
    methods
      .sendMessage(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(error => {
        helpers.error(res, error)
      })
  },
  editMessage: (req, res) => {
    methods
      .editMessage(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(error => {
        helpers.error(res, error)
      })
  },
  deleteMessage: (req, res) => {
    methods
      .deleteMessage(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(error => {
        helpers.error(res, error)
      })
  },
  getAll: (req, res) => {
    methods
      .getAll(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(error => {
        helpers.error(res, error)
      })
  },

  getMessages: (req, res) => {
    methods
      .getMessages(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(error => {
        helpers.error(res, error)
      })
  },
  readMessage: (req, res) => {
    methods
      .readMessage(req)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(error => {
        helpers.error(res, error)
      })
  }
}
