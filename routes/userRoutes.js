const userController = require('../controllers/users/userController')

const userRoutes = (app, fs, helpers, passport) => {
  let userCtrl = userController(fs, helpers, passport)

  app.post('/api/users/login', (req, res) => {
    userCtrl.login(req, res)
  })

  app.post('/api/users/register', (req, res) => {
    res.send('Register')
  })

  app.get('/api/users/:id', (req, res) => {
    userCtrl.getUserInfo(req, res)
  })
}
module.exports = userRoutes
