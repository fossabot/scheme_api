const Cryptr = require("cryptr");
const cryptr = new Cryptr("<249y4r%?X2c");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

module.exports = {
  connect() {
    // DB Connect
    mongoose.connect(
      process.env.DB_CONNECT,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      },
      err => {
        !err
          ? console.log("Database Status: Connected")
          : console.log(`Database Status: Error ${err}`);
      }
    );
  },
  genHash(string) {
    let hash = cryptr.encrypt(string);
    return hash;
  },

  compareHash(compareString, encryptedString) {
    let decryptedString = cryptr.decrypt(encryptedString);
    let isSame = decryptedString.trim() == compareString.trim();
    return isSame;
  },
  findDuplicateNotification: async query => {
    let allNotifications = await Notification.find(query);
    if (allNotifications.length > 0) {
      return true;
    } else {
      return false;
    }
  },

  createNotification: async config => {
    /**
     * title: '',
      message: msg,
      for: admins,
      content: { id: shiftID, update: updateParams },
      type: 'approve',
      url: '/shifts/update',
      requested_by: req.user._id
     */
    await new Notification(config).save();
  }
};
