const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const shiftRouter = require('./routes/shiftRouter')
const userRouter = require('./routes/userRouter')
const requestRouter = require('./routes/requestRouter')
const clientRouter = require('./routes/clientRouter')

const verifyToken = require('./middlewares/verifyToken')

// Env Vars
dotenv.config()

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(compression())

// Routing
app.use('/api/users', userRouter)
app.use('/api/shifts', verifyToken, shiftRouter)
app.use('/api/requests', verifyToken, requestRouter)
app.use('/api/client', verifyToken, clientController)

// DB Connect

mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
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
