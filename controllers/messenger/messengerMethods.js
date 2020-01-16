const Messenger = require("../../models/Messenger");
const Notification = require("../../models/Notification");
module.exports = {
  deleteTranscript: async req => {
    try {
      const { transcript_id } = req.body;
      await Messenger.transcript.findByIdAndDelete({ _id: transcript_id });
      await Messenger.message.deleteMany({ transcript_id });
      return Promise.resolve("Transcript successfully deleted");
    } catch (error) {
      return Promise.reject(error);
    }
  },
  sendMessage: async req => {
    try {
      const { transcript_id, content, attachments, reciever_id } = req.body;
      const currentUser = req.user._id;
      let mongoMessage = {
        content,
        attachments,
        sender_id: currentUser,
        reciever_id,
        transcript_id
      };
      let mongoNotification = {
        message: "",
        url: "/messenger/send",
        content,
        for: reciever,
        type: "message"
      };
      // Find transcript first
      const foundTranscript = await Messenger.transcript.find({
        _id: transcript_id
      });
      if (foundTranscript.length > 0) {
        const success = await new Messenger.message(mongoMessage).save();
        await new Notification(mongoNotification).save();
        return Promise.resolve(success);
      } else {
        return Promise.reject(
          "No transcript with that ID found, please start a new chat"
        );
      }
    } catch (error) {
      return Promise.resolve(error);
    }
  },
  editMessage: async req => {
    try {
      const { message_id, content } = req.body;
      await Messenger.message.findByIdAndUpdate(
        { _id: message_id },
        { content, editted: true }
      );
      return Promise.resolve("Message successfully editted");
    } catch (error) {
      return Promise.resolve(error);
    }
  },
  deleteMessage: async req => {
    try {
      const { message_id } = req.body;
      await Messenger.message.findByIdAndDelete({ _id: message_id });
      return Promise.resolve("Message successfully deleted");
    } catch (error) {
      return Promise.resolve(error);
    }
  },
  startChat: async req => {
    try {
      const { reciever_id, attachments, content } = req.body;
      const currentUser = req.user._id;

      let mongoMessage = {
        content,
        attachments,
        sender_id: currentUser,
        reciever_id
      };
      const mongoTranscript = {
        user_1: mongoMessage.sender_id,
        user_2: mongoMessage.reciever_id,
        created_at: new Date()
      };

      // Check exists
      const duplicate = await Messenger.transcript.find({
        user_1: mongoTranscript.user_1,
        user_2: mongoTranscript.user_2
      });
      if (duplicate.length > 0) {
        return Promise.resolve("Chat already exists");
      }

      const transcript = await new Messenger.transcript(mongoTranscript).save();
      mongoMessage.transcript_id = transcript._id;
      await new Messenger.message(mongoMessage).save();
      return Promise.resolve("Conversation successfully started");
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getMessages: async req => {
    try {
      const { transcript_id } = req.body;
      if (!transcript_id) {
        return Promise.reject("Please provide a transcript ID");
      }

      const messages = await Messenger.message.find({
        transcript_id
      });
      return Promise.resolve(messages);
    } catch (error) {
      return Promise.error(error);
    }
  },
  readMessage: async req => {},
  getAll: async req => {
    try {
      const currentUser = req.user._id;
      const response = await Messenger.transcript.find({
        $or: [{ user_1: currentUser }, { user_2: currentUser }]
      });

      const len = response.length;
      let completeResponses = [];

      for (let i = 0; i < len; i++) {
        let item = response[i];
        if (item) {
          item = item.toObject();
          const lastMessage = await Messenger.message.find({
            transcript_id: item._id
          });

          item.message = lastMessage[lastMessage.length - 1];
          completeResponses.push(item);
        }
      }
      return Promise.resolve(completeResponses);
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
