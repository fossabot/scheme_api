const user = require('./../controllers/users/userController')
const express = require('express')
const router = express.Router()

router.post('/login', (req, res) => {
  user.login(req, res)
})

router.post('/register', (req, res) => {
  user.register(req, res)
})

router.post('/remove', (req, res) => {
  user.removeUser(req, res)
})
router.post('/update', (req, res) => {
  user.updateUser(req, res)
})
router.get('/logout', (req, res) => {
  user.logOut(req, res)
})
router.get('/all', (req, res) => {
  user.getAllUsers(req, res)
})
router.get('/one', (req, res) => {
  user.getOneUser(req, res)
})

router.post('/permissions', (req, res) => {
  user.updatePermissions(req, res)
})

module.exports = router
