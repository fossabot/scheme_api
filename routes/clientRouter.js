const express = require('express')
const router = express.Router()
const client = require('./../controllers/clientController')
router.post('/create', (req, res) => {
  client.create(req, res)
})

module.exports = router
