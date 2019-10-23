const User = require('./../../models/User')
const webToken = require('jsonwebtoken')
module.exports = (fs, helpers, passport) => {
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  const login = (req, res) => {
    let params = req.body
    userManagement.login(helpers, params).then(user => {
      const token = webToken.sign(
        {
          user_id: user._id,
          user_email: user.email,
          user_employee_type: user.employee_type,
          user_name: user.name
        },
        process.env.JWT_SECRET
      )
      res.header('Authorization', token).json({
        Authorisation: token
      })
    })
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
      res.json({
        user_id: user._id,
        user_email: user.email,
        user_employee_type: user.employee_type,
        user_name: user.name
      })
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
   * @param {Object} req.body
   */
  login: async function(helpers, params) {
    const user = await User.findOne({ email: params.email })
    if (!user) {
      return helpers.createError({
        message: 'Email or password is incorrect, please try again.'
      })
    } else {
      const isPasswordCorrect = await helpers.DatabaseMethods.compareHash(
        params.password,
        user.password
      )
      if (isPasswordCorrect) {
        return user
      } else {
        return helpers.createError({
          message: 'Email or password is incorrect, please try again.'
        })
      }
    }
  },
  /**
   *
   * @param {Function Body} helpers
   * @param {Object} req
   * @param {Object} res
   */
  register: async function(helpers, req, res) {
    let params = req.body
    const validation = helpers.DatabaseMethods.validate(params, 'register')
    let hashedPassword = await helpers.DatabaseMethods.genHash(params.password)

    if (validation) {
      const user = new User({
        name: params.name,
        email: params.email,
        employee_type: params.employeeType,
        password: hashedPassword
      })

      const isEmailPresent = await User.findOne({ email: params.email })
      if (isEmailPresent != null) {
        console.log('Wow')
        helpers.createError(res, {
          message: 'Email already exists, please try again'
        })
      } else {
        try {
          const savedUser = await user.save()
          return savedUser
        } catch (error) {
          // res.send(error)
          return error
        }
      }
    } else {
      return validation
    }
  }
}
