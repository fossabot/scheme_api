const userRoutes = require('./userRoutes')
const shiftRoutes = require('./shiftRoutes')

const appRouter = (app, helpers) => {
  userRoutes(app, helpers)
  shiftRoutes(app, helpers)
}

module.exports = appRouter
