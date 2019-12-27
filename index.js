const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const passport = require('passport')

const shiftRoutes = require('./routes/shiftRoutes')
const userRoutes = require('./routes/userRoutes')
const requestRoutes = require('./routes/requestRoutes')
const clientRoutes = require('./routes/clientRoutes')
const messengerRoutes = require('./routes/messengerRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const serviceRoutes = require('./routes/serviceRoutes')

const verifyToken = require('./middlewares/verifyToken')

// Env Vars
dotenv.config()

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(compression())
app.use(passport.initialize())

// Routing
app.use('/users', userRoutes)
app.use('/shifts', verifyToken, shiftRoutes)
app.use('/requests', verifyToken, requestRoutes)
app.use('/clients', clientRoutes)
app.use('/messenger', verifyToken, messengerRoutes)
app.use('/notifications', verifyToken, notificationRoutes)
app.use('/auth', serviceRoutes)

// DB Connect
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  },
  err => {
    !err ? console.log('Connected') : console.log(err)
  }
)

// Server init
app.listen(process.env.DB_PORT, () => {
  console.log('API Running...')
})
