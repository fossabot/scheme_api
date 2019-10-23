const User = require('./../../models/User')

module.exports = (fs, helpers, passport) => {
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  const login = (req, res) => {
    let params = req.body
    if (!params.email || !params.password) {
      helpers.createError(res, {
        message:
          'Failed to login, please enter your email or password please ?',
        code: 1010
      })
    } else {
      res.json(userManagement.login(req, null, 'login'))
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  const getUserInfo = (req, res) => {
    let params = req.body
    try {
      res.json(helpers.DatabaseMethods.findOne(User, { id: params.userID }))
    } catch (error) {
      helpers.createError(res, error)
    }
  }
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  const register = (req, res) => {
    userManagement.register(helpers, req, res).then(user => {
      res.json(user)
    })
  }

  return {
    login: login,
    register: register,
    getUserInfo: getUserInfo
  }
}

/**
 * user management operations
 */
var userManagement = {
  /**
   * Login user
   * @param {*} params
   */
  login: async function(params) {
    const user = await helpers.DatabaseMethods.findOne(User, {
      email: params.email,
      password: params.password
    })
    return user
  },
  /**
   *
   * @param {File} helpers
   * @param {Object} req
   * @param {Object} res
   */
  register: async function(helpers, req, res) {
    let params = req.body
    const validation = helpers.DatabaseMethods.validate(params, 'register')
    let hashedPassword = await helpers.DatabaseMethods.hash(params.password)

    if (validation) {
      const user = new User({
        name: params.name,
        email: params.email,
        employee_type: params.employeeType,
        password: hashedPassword
      })

      const isEmailPresent = await helpers.DatabaseMethods.findOne(User, params)
      if (isEmailPresent != null) {
        console.log('Wow')
        helpers.createError(res, {
          message: 'Email already exists, please try again'
        })
      } else {
        try {
          const savedUser = await user.save()
          return Promise.resolve(savedUser)
        } catch (error) {
          // res.send(error)
          return Promise.reject(error)
        }
      }
    } else {
      return Promise.reject(validation)
    }
  }
}
