const express = require('express'),
  session = require('express-session'),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  helpers = require('./helpers/helpers')(),
  dotenv = require('dotenv'),
  mongoose = require('mongoose'),
  passport = require('passport'),
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
app.use(passport.initialize())
app.use(passport.session())

const routes = require('./routes/router')(app, fs, helpers, passport)

// DB Connect
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected')
  }
)

// Server Init
app.listen(process.env.DB_PORT, () => {
  console.log('(Shift Manager API...)')
})
