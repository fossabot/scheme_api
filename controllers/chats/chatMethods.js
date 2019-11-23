const helpers = require('../../helpers/helpers')
const Message = require('../../models/Message')

module.exports = {
  send: async function(req) {},
  init: async function(req) {
    try {
      const connection = await helpers.socket.startConnection()
      return Promise.resolve(connection)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  getChatTranscript: async function(req) {
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
    const content = params.message_content
    const attachements = params.message_attachements
      ? params.message_attachements
      : null
    const transcriptID = params.transcript_id

    // Add the message to DB
    const monogoMessage = {
      message_content: content,
      message_attachements: attachements,
      transcript_id: transcriptID
    }
    try {
      const newMessage = new Message(monogoMessage)
      newMessage = await newMessage.save()
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
