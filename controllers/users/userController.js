const methods = require('./userMethods')
const helpers = require('./../../helpers/helpers')

exports.upgradePermissions = (req, res) => {
  methods
    .upgradePermissions(req, res)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}
exports.getUser = (req, res) => {
  methods
    .getOneUser(req, helpers)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}

exports.getUsers = (req, res) => {
  methods
    .getAllUsers()
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}

exports.login = (req, res) => {
  let params = req.body
  methods
    .login(helpers, params)
    .then(user => {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          employee_type: user.employee_type,
          name: user.name
        },
        process.env.JWT_SECRET
      )

      res.header('Authorisation', token)

      helpers.success(res, {
        message: 'Successfully logged in',
        extras: {
          token: token,
          id: user._id,
          email: user.email,
          employee_type: user.employee_type,
          name: user.name
        }
      })
    })
    .catch(err => {
      helpers.error(res, err)
    })
}

exports.logOut = (req, res) => {
  methods
    .logOut(req, res)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}

exports.register = (req, res) => {
  methods
    .register(helpers, req, res)
    .then(response => {
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
          extras: token
        })
      }
    })
    .catch(err => {
      helpers.error(res, err)
    })
}

exports.updateUser = (req, res) => {
  methods
    .updateUser(req, res)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}
exports.removeUser = (req, res) => {
  methods
    .removeUser(req)
    .then(response => {
      helpers.success(res, response)
    })
    .catch(err => {
      helpers.error(res, err)
    })
}
