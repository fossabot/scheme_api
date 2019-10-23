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
      helpers.createError(req, res, {
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
  const getUserInfo = (req, res) => {}
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  const register = async (req, res) => {
    userManagement.register(req).then(user => {
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
   * Logs in user
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
   * Register a new user
   */
  register: async function(req) {
    let params = req.body

    const user = new User({
      name: params.name,
      email: params.email,
      employee_type: params.employeeType,
      password: params.password
    })

    try {
      const savedUser = await user.save()
      return Promise.resolve(savedUser)
    } catch (error) {
      res.send(error)
    }
  }
}
