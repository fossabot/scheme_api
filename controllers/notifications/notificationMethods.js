const Notification = require('./../../models/Notification')

module.exports = {
  deleteNotification: async req => {
    try {
      let id = req.body.id
      await Notification.findByIdAndDelete({ _id: id })
      return Promise.resolve('Notification removed')
    } catch (error) {
      return Promise.reject(error)
    }
  },
  updateNotification: async req => {
    try {
      let notificationID = req.body.id
      let notificationUpdate = req.body.update
      let notification = await Notification.findByIdAndUpdate(
        { _id: notificationID },
        { is_read: true }
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
