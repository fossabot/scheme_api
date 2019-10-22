const express = require('express'),
  session = require('express-session'),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  helpers = require('./helpers/helpers')(),
  passport = require('passport'),
  cors = require('cors')
;(port = 3000), (app = express())

// Middleware
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

app.listen(port, () => {
  console.log('(Shift Manager API...)')
})
