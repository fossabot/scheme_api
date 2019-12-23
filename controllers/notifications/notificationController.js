const methods = require('./notificationMethods')
const helpers = require('./../../helpers/helpers')
module.exports = {
  deleteNotification: (req, res) => {
    methods
      .deleteNotification(req, helpers)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  },
  updateNotification: (req, res) => {
    methods
      .updateNotification(req, helpers)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  },
  getNotifications: (req, res) => {
    methods
      .getNotifications(req, helpers)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  }
}
