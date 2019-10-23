const userRoutes = require('./userRoutes')
const shiftRoutes = require('./shiftRoutes')

const appRouter = (app, fs, helpers) => {
  userRoutes(app, fs, helpers)
  shiftRoutes(app, fs, helpers)
}

module.exports = appRouter
