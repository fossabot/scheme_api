const user = require('../controllers/users/userController')
const express = require('express')
const verifyToken = require('./../middlewares/verifyToken')
const router = express.Router()

router.post('/login', (req, res) => {
  user.login(req, res)
})
router.post('/forgotpassword', (req, res) => {
  user.forgotPassword(req, res)
})
router.post('/register', (req, res) => {
  user.register(req, res)
})
router.post('/newemployee', (req, res) => {
  user.updateNewEmployee(req, res)
})
router.post('/verify', verifyToken, (req, res) => {
  user.verifyUser(req, res)
})
router.post('/remove', (req, res) => {
  user.removeUser(req, res)
})
router.post('/update', verifyToken, (req, res) => {
  user.updateUser(req, res)
})
router.get('/logout', verifyToken, (req, res) => {
  user.logOut(req, res)
})
router.get('/all', verifyToken, (req, res) => {
  user.getAllUsers(req, res)
})

module.exports = router
