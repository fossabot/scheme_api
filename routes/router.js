const userRoutes = require('./userRoutes')
const shiftRoutes = require('./shiftRoutes')

const appRouter = (app, fs, helpers, passport) => {
  userRoutes(app, fs, helpers, passport)
  shiftRoutes(app, fs, helpers, passport)
}

module.exports = appRouter
