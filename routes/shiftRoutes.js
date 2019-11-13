const shiftsController = require('./../controllers/shifts/shiftsController')
const verifyToken = require('./../middlewares/verifyToken')
const shiftRoutes = (app, fs, helpers) => {
  const shiftCtrl = shiftsController(fs, helpers)

  app.get('/api/shifts/all', verifyToken, (req, res) => {
    shiftCtrl.getAllShifts(req, res)
  })

  app.post('/api/shifts/create', verifyToken, (req, res) => {
    shiftCtrl.createShift(req, res)
  })
  app.post('/api/shifts/pickup', verifyToken, (req, res) => {
    shiftCtrl.pickUpShift(req, res)
  })
  app.post('/api/shifts/update', verifyToken, (req, res) => {
    shiftCtrl.updateShift(req, res)
  })
  app.get('/api/shifts/remove', verifyToken, (req, res) => {
    shiftCtrl.removeShift(req, res)
  })
  app.post('/api/shifts/approve', verifyToken, (req, res) => {
    shiftCtrl.approveShift(req, res)
  })
  app.get('/api/requests/all', verifyToken, (req, res) => {
    shiftCtrl.allRequests(req, res)
  })
}

module.exports = shiftRoutes
