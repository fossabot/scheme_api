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
  app.get('/api/users/logout', verifyToken, (req, res) => {
    userCtrl.logOut(req, res)
  })
  app.get('/api/users/all', verifyToken, (req, res) => {
    userCtrl.getUsers(req, res)
  })
  app.get('/api/users/one', verifyToken, (req, res) => {
    userCtrl.getUser(req, res)
  })
}
module.exports = userRoutes
