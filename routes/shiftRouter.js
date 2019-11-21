const shiftCtrl = require('../controllers/shifts/shiftsController')
const verifyToken = require('../middlewares/verifyToken')
const express = require('express')
const router = express.Router()

router.get('/all', verifyToken, (req, res) => {
  shiftCtrl.getAllShifts(req, res)
})

router.post('/create', verifyToken, (req, res) => {
  shiftCtrl.createShift(req, res)
})
router.post('/pickup', verifyToken, (req, res) => {
  shiftCtrl.pickUpShift(req, res)
})
router.post('/update', verifyToken, (req, res) => {
  shiftCtrl.updateShift(req, res)
})
router.post('/drop', verifyToken, (req, res) => {
  shiftCtrl.dropShift(req, res)
})
router.post('/remove', verifyToken, (req, res) => {
  shiftCtrl.removeShift(req, res)
})

module.exports = router
