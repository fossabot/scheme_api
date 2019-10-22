const shiftsController = require('./../controllers/shifts/shiftsController')
const shiftRoutes = (app, fs, helpers, passport) => {
  // Check Session
  const shiftCtrl = shiftsController(fs, helpers)
  app.get('/api/shifts', (req, res) => {
    shiftCtrl.getAllShifts(req, res)
  })

  app.get('/api/shifts/:id', (req, res) => {
    shiftCtrl.getShiftDetails(req, res)
  })
}

module.exports = shiftRoutes
