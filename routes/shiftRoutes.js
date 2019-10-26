const shiftsController = require('./../controllers/shifts/shiftsController')
const verifyToken = require('./../middlewares/verifyToken')
const shiftRoutes = (app, fs, helpers) => {
  const shiftCtrl = shiftsController(fs, helpers)

  app.get('/api/shifts', verifyToken, (req, res) => {
    shiftCtrl.getAllShifts(req, res)
  })

  app.post('/api/shifts/create', verifyToken, (req, res) => {
    shiftCtrl.createShift(req, res)
  })

  app.post('/api/shifts/update', verifyToken, (req, res) => {
    shiftCtrl.updateShift(req, res)
  })
  app.get('/api/shifts/remove', verifyToken, (req, res) => {
    shiftCtrl.removeShift(req, res)
  })
}

module.exports = shiftRoutes
