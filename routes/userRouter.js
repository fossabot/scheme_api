const user = require('./../controllers/users/userController')
const verifyToken = require('./../middlewares/verifyToken')
const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
  user.login(req, res)
})

router.post('/register', (req, res) => {
  user.register(req, res)
})

router.post('/remove', verifyToken, (req, res) => {
  user.removeUser(req, res)
})
router.post('/update', verifyToken, (req, res) => {
  user.updateUser(req, res)
})
router.get('/logout', verifyToken, (req, res) => {
  user.logOut(req, res)
})
router.get('/all', verifyToken, (req, res) => {
  user.getUsers(req, res)
})
router.get('/one', verifyToken, (req, res) => {
  user.getUser(req, res)
})
router.post('/upgrade', verifyToken, (req, res) => {
  user.upgradePermissions(req, res)
})

module.exports = router
