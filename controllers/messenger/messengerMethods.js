const Messenger = require('../../models/Messenger')

module.exports = {
  deleteTranscript: async req => {
    try {
      const transcriptID = req.body.transcript_id
      await Messenger.transcript.findByIdAndDelete({ _id: transcriptID })
      await Messenger.message.deleteMany({ transcript_id: transcriptID })
      return Promise.resolve('Transcript successfully deleted')
    } catch (error) {
      return Promise.reject(error)
    }
  },
  sendMessage: async req => {
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
      // Find transcript first
      const foundTranscript = await Messenger.transcript.find({
        _id: transcript_id
      })
      if (foundTranscript.length > 0) {
        const success = await new Messenger.message(mongoMessage).save()
        return Promise.resolve(success)
      } else {
        return Promise.reject(
          'No transcript with that ID found, please start a new chat'
        )
      }
    } catch (error) {
      return Promise.resolve(error)
    }
  },
  editMessage: async req => {
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
  deleteMessage: async req => {
    try {
      const params = req.body
      const message_id = params.message_id
      await Messenger.message.findByIdAndDelete({ _id: message_id })
      return Promise.resolve('Message successfully deleted')
    } catch (error) {
      return Promise.resolve(error)
    }
  },
  startChat: async req => {
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
        user_1: mongoMessage.sender_id,
        user_2: mongoMessage.reciever_id,
        created_at: new Date()
      }

      // Check exists
      const duplicate = await Messenger.transcript.find({
        user_1: mongoTranscript.user_1,
        user_2: mongoTranscript.user_2
      })
      if (duplicate.length > 0) {
        return Promise.resolve('Chat already exists')
      }

      const transcript = await new Messenger.transcript(mongoTranscript).save()
      mongoMessage.transcript_id = transcript._id
      await new Messenger.message(mongoMessage).save()
      return Promise.resolve('Conversation successfully started')
    } catch (error) {
      return Promise.reject(error)
    }
  },

  getMessages: async req => {
    try {
      const params = req.body
      const transcript = params.transcript_id
      if (!transcript) {
        return Promise.reject('Please provide a transcript ID')
      }

      const messages = await Messenger.message.find({
        transcript_id: transcript
      })
      return Promise.resolve(messages)
    } catch (error) {
      return Promise.error(error)
    }
  },
  readMessage: async req => {},
  getAll: async req => {
    try {
      const currentUser = req.user._id
      const transcriptConditons = {
        isUser1: { user_1: currentUser },
        isUser2: { user_2: currentUser }
      }

      const _isUser1 = await Messenger.transcript.findOne(
        transcriptConditons.isUser1
      )
      const _isUser2 = await Messenger.transcript.findOne(
        transcriptConditons.isUser2
      )

      const response = await Promise.all([_isUser1, _isUser2])
      const len = response.length
      let completeResponses = []

      for (let i = 0; i < len; i++) {
        let item = response[i]
        if (item) {
          item = item.toObject()
          const lastMessage = await Messenger.message.find({
            transcript_id: item._id
          })

          item.message = lastMessage[lastMessage.length - 1]
          completeResponses.push(item)
        }
      }
      return Promise.resolve(completeResponses)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
