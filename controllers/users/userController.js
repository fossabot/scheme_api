const User = require('./../../models/User')
const jwt = require('jsonwebtoken')
const Shift = require('./../../models/Shift')
module.exports = helpers => {
  const getUser = (req, res) => {
    methods
      .getOneUser(req, helpers)
      .then(response => {
        helpers.success(res, { extras: response })
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }

  const getUsers = (req, res) => {
    methods
      .getAllUsers()
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  }

  const login = (req, res) => {
    let params = req.body
    methods
      .login(helpers, params)
      .then(user => {
        const token = jwt.sign(
          {
            user_id: user._id,
            user_email: user.email,
            user_employee_type: user.employee_type,
            user_name: user.name
          },
          process.env.JWT_SECRET
        )
        res.header('Authorisation', token)
        helpers.success(res, {
          message: 'Successfully logged in',
          extras: {
            token: token,
            user_id: user._id,
            user_email: user.email,
            user_employee_type: user.employee_type,
            user_name: user.name
          }
        })
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }

  const logOut = (req, res) => {
    methods
      .logOut(req, res)
      .then(response => {
        if (response) {
          helpers.success(res, response)
        } else {
          helpers.error(res, {
            message: 'Failed to sign out user, please try again later'
          })
        }
      })
      .catch(err => {
        helpers.error(res, err)
      })
  }

  const register = (req, res) => {
    methods
      .register(helpers, req, res)
      .then(user => {
        if (user) {
          const token = jwt.sign(
            {
              user_id: user._id,
              user_email: user.email,
              user_employee_type: user.employee_type,
              user_name: user.name
            },
            process.env.JWT_SECRET
          )
          res.header('Authorisation', token)
          helpers.success(res, {
            message: 'Registration successful!',
            extras: token
          })
        }
      })
      .catch(err => {
        helpers.error(res, err)
      })
  }

  const updateUser = (req, res) => {
    methods
      .updateUser(req, res)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  }
  const removeUser = (req, res) => {
    methods.removeUser(req).then(response => {
      res.json(response)
    })
  }

  return {
    login: login,
    register: register,
    updateUser: updateUser,
    removeUser: removeUser,
    logOut: logOut,
    getUsers: getUsers,
    getUser: getUser
  }
}
