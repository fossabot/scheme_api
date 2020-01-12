const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.ENCRYPT_SECRET);
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

module.exports = {
  storageEngineInit() {
    const multer = require("multer");
    const fs = require("fs");
    const storage = multer.diskStorage({
      destination(req, file, cb) {
        let destDir;
        let origin = req.originalUrl;
        switch (origin) {
          case origin.includes("uploadlogo"): {
            let { client_name } = req.body;
            destDir = `uploads/${client_name}`;
            break;
          }
          case origin.includes("uploadavatar"): {
            let { email } = req.body;
            destDir = `uploads/${email}/avatar/`;
            break;
          }

          default:
            break;
        }

        fs.exists(destDir, exists => {
          if (!exists) {
            return fs.mkdir(destDir, error => cb(error, destDir));
          }
          return cb(null, destDir);
        });
      },

      filename(req, file, cb) {
        switch (origin) {
          case origin.includes("uploadlogo"): {
            cb(null, `logo`);
            break;
          }
          case origin.includes("uploadavatar"): {
            cb(null, `${file.originalname}`);
            break;
          }

          default:
            break;
        }
      }
    });
    return storage;
  },
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
