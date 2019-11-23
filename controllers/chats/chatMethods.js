const helpers = require('../../helpers/helpers')
const Message = require('../../models/Message')

module.exports = {
  send: async function(req) {},
  init: async function() {
    try {
      const connection = await helpers.socket.startConnection()
      return Promise.resolve(connection)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  getChats: async function(req) {
    const params = req.body
    const transcriptID = params.transcript_id
    try {
      const messageTranscript = await Message.find({
        transcript_id: transcriptID
      })
      return Promise.resolve(messageTranscript)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  sendMessage: async function(req) {
    const params = req.body
    const messageContent = params.message
    const attachements = params.attachements ? params.attachements : null

    // Add the message to DB
    const monogoMessage = {
      message: messageContent,
      attachements: attachements,
      transcript_id: helpers.admin.genID()
    }
    try {
      try {
        const emit = await helpers.socket.emit('message_sent', {
          message: messageContent,
          attachements: attachements
        })
      } catch (error) {
        return Promise.reject(error)
      }

      const newMessage = new Message(monogoMessage)
      newMessage = newMessage.save()
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
