const helpers = require('../../helpers/helpers')
const Message = require('../../models/Message')

module.exports = {
  init: async function(req) {
    try {
      const connection = await helpers.socket.startConnection()
      return Promise.resolve(connection)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  // ######################################
  getChatTranscripts: async function(req) {
    const params = req.body
    const sender = helpers.admin.decode(req)._id
    const recipient = params.recipient_id

    try {
      const chatTranscripts = await Message.find({
        sender: sender,
        recipient: recipient
      })
      const len = chatTranscripts.length
      let messages = []
      for (let i = 0; i < len; i++) {
        const chat = chatTranscripts[i].toObject();
        
      }
      return Promise.resolve(chatTranscripts)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  getAllChats: async function(req) {
    try {
      const allChats = await Message.find({
        sender: helpers.admin.decode(req)._id
      })
      const len = allChats.length
      let newChats = []
      for (let i = 0; i < len; i++) {
        let chat = allChats[i].toObject()
        delete chat.sender
        newChats.push(chat)
      }

      return Promise.resolve(newChats)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  sendMessage: async function(req) {
    const params = req.body
    const content = params.message_content
    const attachements = params.message_attachements
    const recipient = params.recipient_id
    const sender = helpers.admin.decode(req)._id

    const monogoMessage = {
      message_content: content,
      message_attachements: attachements,

      sender: sender,
      recipient: recipient
    }
    try {
      let newMessage = new Message(monogoMessage)
      newMessage = await newMessage.save()
      return Promise.resolve(newMessage)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
