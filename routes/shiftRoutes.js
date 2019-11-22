const shift = require('../controllers/shifts/shiftsController')
const verifyToken = require('../middlewares/verifyToken')
const express = require('express')
const router = express.Router()

router.get('/all', verifyToken, (req, res) => {
  shift.getAllShifts(req, res)
})

router.post('/create', verifyToken, (req, res) => {
  shift.createShift(req, res)
})

router.post('/update', verifyToken, (req, res) => {
  shift.updateShift(req, res)
})

module.exports = router
