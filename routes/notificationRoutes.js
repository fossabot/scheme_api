let router = require('express').Router()
let notification = require('./../controllers/notifications/notificationController')

router.post('/update', (req, res) => {
  notification.updateNotification(req, res)
})
router.get('/all', (req, res) => {
  notification.getNotifications(req, res)
})
router.delete('/one', (req, res) => {
  notification.deleteNotification(req, res)
})
router.delete('/all', (req, res) => {
  notification.deleteAllNotifications(req, res)
})
module.exports = router
