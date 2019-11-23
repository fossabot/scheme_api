const express = require('express')
const router = express.Router()
const chats = require('./../controllers/chats/chatController')

router.post('/send', (req, res) => {
  chats.sendMessage(req, res)
})
router.get('/begin', (req, res) => {
  chats.init(req, res)
})

router.get('/getAll', (req, res) => {
  chats.getChatTranscript(req, res)
})

module.exports = router
