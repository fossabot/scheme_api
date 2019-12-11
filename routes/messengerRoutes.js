const express = require('express')
const router = express.Router()
const messenger = require('./../controllers/messenger/messengerController')
router.get('/all', (req, res) => {
  messenger.getAll(req, res)
})
router.get('/transcript')
router.post('/message')
router.post('/read')
module.exports = router
