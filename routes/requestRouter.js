const express = require('express')
const router = express.Router()
const request = require('./../controllers/requests/requestController')

router.get('/all', (req, res) => {
  request.getAllRequests(req, res)
})
router.post('/update', (req, res) => {
  request.updateRequest(req, res)
})

module.exports = router
