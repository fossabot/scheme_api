const userController = require('../controllers/users/userController')
const verifyToken = require('./../middlewares/verifyToken')
const userRoutes = (app, fs, helpers) => {
  let userCtrl = userController(fs, helpers)

  app.post('/api/users/login', (req, res) => {
    userCtrl.login(req, res)
  })

  app.post('/api/users/register', (req, res) => {
    userCtrl.register(req, res)
  })

  app.post('/api/users/remove', verifyToken, (req, res) => {
    userCtrl.removeUser(req, res)
  })
  app.post('/api/users/update', verifyToken, (req, res) => {
    userCtrl.updateUser(req, res)
  })
}
module.exports = userRoutes
