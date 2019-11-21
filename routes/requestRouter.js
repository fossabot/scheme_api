const express = require('express')
const router = express.Router()
const requestCtrl = require('./../controllers/requests/requestController')
router.get('/all', (req, res) => {
  requestCtrl.getAllRequests(req, res)
})

module.exports = router
