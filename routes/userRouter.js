const userCtrl = require('./../controllers/users/userController')
const verifyToken = require('./../middlewares/verifyToken')
const express = require('express')
const router = express.Router()
router.post('/test', (req, res) => {
  userCtrl.test(req, res)
})
router.post('/login', (req, res) => {
  userCtrl.login(req, res)
})

router.post('/register', (req, res) => {
  userCtrl.register(req, res)
})

router.post('/remove', verifyToken, (req, res) => {
  userCtrl.removeUser(req, res)
})
router.post('/update', verifyToken, (req, res) => {
  userCtrl.updateUser(req, res)
})
router.get('/logout', verifyToken, (req, res) => {
  userCtrl.logOut(req, res)
})
router.get('/all', verifyToken, (req, res) => {
  userCtrl.getUsers(req, res)
})
router.get('/one', verifyToken, (req, res) => {
  userCtrl.getUser(req, res)
})
router.post('/upgrade', verifyToken, (req, res) => {
  userCtrl.upgradePermissions(req, res)
})

module.exports = router
