const Notification = require('./../../models/Notification')

module.exports = {
  deleteNotifications: async (req, all) => {
    try {
      let id = req.body.id
      if (!all) {
        await Notification.findByIdAndDelete({ _id: id })
      } else {
        await Notification.deleteMany({
          'for._id': req.user._id
        })
      }
      let resolveMessage = all ? 'All notifications cleared.' : 'Notification removed';
      return Promise.resolve(resolveMessage)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  updateNotification: async req => {
    try {
      let notificationID = req.body.id
      let notificationUpdate = req.body.update
      let notification = await Notification.findByIdAndUpdate(
        { _id: notificationID }, notificationUpdate
      )
      return Promise.resolve(notification)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  getNotifications: async req => {
    try {
      const allNotifications = await Notification.find({
        'for._id': req.user._id
      })
      return Promise.resolve(allNotifications)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
