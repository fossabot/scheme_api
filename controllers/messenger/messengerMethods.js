const helpers = require('./../../helpers/helpers')
const Message = require('./../../models/Message')
module.exports = {
  getAll: async function(req) {
    try {
      const chats = await Message.find({ transcript: { sender: req.user._id } })
      return Promise.resolve(chats)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
