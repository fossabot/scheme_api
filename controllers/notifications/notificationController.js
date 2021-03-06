const methods = require('./notificationMethods')
const helpers = require('../../helpers')
module.exports = {
  createNotification: (req, res) => {
    methods
      .createNotification(req, null)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err))
  },
  deleteNotification: (req, res) => {
    methods
      .deleteNotifications(req, null)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err))
  },
  updateNotification: (req, res) => {
    methods
      .updateNotification(req, helpers)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err))
  },
  getNotifications: (req, res) => {
    methods
      .getNotifications(req, helpers)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err))
  },
  deleteAllNotifications: (req, res) => {
    methods
      .deleteNotifications(req, true)
      .then(response => helpers.success(res, response))
      .catch(err => helpers.error(res, err))
  },

}
