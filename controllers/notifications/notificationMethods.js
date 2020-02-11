const Notification = require("./../../models/Notification");
const User = require("../../models/User");
const db = require("../../helpers").db;
module.exports = {
  deleteNotifications: async (req, all) => {
    try {
      let id = req.body.id;
      if (!all) {
        await Notification.findByIdAndDelete({ _id: id });
      } else {
        await Notification.deleteMany({
          "for._id": req.user._id
        });
      }
      let resolveMessage = all
        ? "All notifications cleared."
        : "Notification removed";
      return Promise.resolve(resolveMessage);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  updateNotification: async req => {
    try {
      let { id } = req.body;
      let notificationUpdate = req.body.update;
      let notification = await Notification.findByIdAndUpdate(
        { _id: id },
        notificationUpdate
      );
      return Promise.resolve(notification);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getNotifications: async req => {
    try {
      const allNotifications = await Notification.find({
        "for._id": req.user._id
      });
      return Promise.resolve(allNotifications);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  createNotification: async req => {
    const params = req.body;
    const sendTo = params.for;
    try {
      if (sendTo == "admins") {
        sendTo = await User.find({ groupID: 1 });
      }
      await db.createNotification({
        ...params
      });
      return Promise.resolve(
        sendTo == "admins"
          ? `Notification sent to all admins`
          : "Notification sent to " + sendTo
      );
    } catch (error) {
      return Promise.resolve(error);
    }
  }
};
