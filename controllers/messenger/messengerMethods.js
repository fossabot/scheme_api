const Messenger = require('../../models/Messenger')

module.exports = {
  sendMessage: async function(req) {
    try {
      const params = req.body
      const transcript_id = params.transcript_id
      const content = params.content
      const attachments = params.attachments || null
      const reciever = params.reciever_id
      const currentUser = req.user._id
      let mongoMessage = {
        content: content,
        attachments: attachments,
        sender_id: currentUser,
        reciever_id: reciever,
        transcript_id: transcript_id
      }
      await new Messenger.message(mongoMessage).save()
      return Promise.resolve('Message successfully sent')
    } catch (error) {
      return Promise.resolve(error)
    }
  },
  editMessage: async function(req) {
    try {
      const params = req.body
      const message_id = params.message_id
      const content = params.content
      await Messenger.message.findByIdAndUpdate(
        { _id: message_id },
        { content: content, editted: true }
      )
      return Promise.resolve('Message successfully editted')
    } catch (error) {
      return Promise.resolve(error)
    }
  },
  deleteMessage: async function(req) {
    try {
      const params = req.body
      const message_id = params.message_id
      await Messenger.message.findByIdAndDelete({ _id: message_id })
      return Promise.resolve('Message successfully deleted')
    } catch (error) {
      return Promise.resolve(error)
    }
  },
  startChat: async function(req) {
    try {
      const params = req.body
      const currentUser = req.user._id
      const reciever = params.reciever_id
      const attachments = params.attachments || null
      const content = params.content
      let mongoMessage = {
        content: content,
        attachments: attachments,
        sender_id: currentUser,
        reciever_id: reciever
      }
      const mongoTranscript = {
        participants: {
          user_1: mongoMessage.sender_id,
          user_2: mongoMessage.reciever_id
        },
        created_at: new Date()
      }

      const transcript = await new Messenger.transcript(mongoTranscript).save()
      mongoMessage.transcript_id = transcript._id
      await new Messenger.message(mongoMessage).save()
      return Promise.resolve('Conversation successfully started')
    } catch (error) {
      return Promise.reject(error)
    }
  },
  getMessages: async function(req) {
    try {
      const params = req.body
      const transcript = params.transcript_id

      const messages = await Messenger.message.find({
        transcript_id: transcript
      })
      return Promise.resolve(messages)
    } catch (error) {
      return Promise.error(error)
    }
  },
  readMessage: async function(req) {},
  getAll: async function(req) {
    try {
      const currentUser = req.user._id
      const transcriptConditon = [
        { participants: { user_1: currentUser } },
        { participants: { user_2: currentUser } }
      ]

      const chats = await Messenger.transcript.find().or(transcriptConditon)
      return Promise.resolve(chats)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
