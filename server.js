const express = require('express'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  helpers = require('./helpers/helpers')(),
  dotenv = require('dotenv'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  app = express()

// Env Vars
dotenv.config()

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(compression())

app.use(
  session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true,
    cookie: {
      secure: true,
      maxAge: 6000000000
    }
  })
)

const routes = require('./routes/router')(app, helpers)

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
