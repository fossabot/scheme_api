const express = require('express')
const router = express.Router()
const messenger = require('./../controllers/messenger/messengerController')
router.post('/start', (req, res) => {
  messenger.startChat(req, res)
})
router.get('/transcripts', (req, res) => {
  messenger.getAll(req, res)
})
router.post('/messages', (req, res) => {
  messenger.getMessages(req, res)
})
router.post('/send', (req, res) => {
  messenger.sendMessage(req, res)
})
router.post('/readMessage', (req, res) => {
  messenger.readMessage(req, res)
})

module.exports = router
