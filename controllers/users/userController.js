const User = require('./../../models/User')
const jwt = require('jsonwebtoken')
const Shift = require('./../../models/Shift')
module.exports = (fs, helpers, passport) => {
  /**
   *
   * @param {*} req
   * @param {*} res
   */
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
          extras: token
        })
      })
      .catch(err => {
        helpers.error(res, err)
      })
  }

  /**
   * Signs out the current user
   * @param {*} req
   * @param {*} res
   */
  const logOut = (req, res) => {
    methods
      .logOut(req, helpers, res)
      .then(response => {
        console.log(response)
        if (response) {
          helpers.success(res, {
            message: 'Signed Out Successfully',
            instructions: 'Remove Token'
          })
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

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  const getUserInfo = (req, res) => {
    let params = req.body
    try {
      res.json(helpers.db.findOne(User, { id: params.userID }))
    } catch (error) {
      helpers.createError(res, error)
    }
  }
  /**
   * Regsiter new user
   * @param {*} req
   * @param {*} res
   */
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
  /**
   * Update user details
   * @param {*} req
   * @param {*} res
   */
  const updateUser = (req, res) => {
    methods.updateUser(req, res).then(response => {
      res.json(response)
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
    getUserInfo: getUserInfo,
    updateUser: updateUser,
    removeUser: removeUser,
    logOut: logOut
  }
}

var methods = {
  /**
  //  * Sign out the current session and delete their token and remove that they are online
  //  * @param {*} req
  //  * @param {*} res
  //  * @param {*} helpers
  //  */
  logOut: async function(req, helpers, res) {
    let authHeader = req.header('Authorisation')
    let currentUser = jwt.decode(authHeader, process.env.JWT_SECRET)
    try {
      let isUserSignedIn = await User.findOne({
        _id: currentUser['user_id'],
        is_online: true
      })
      if (!isUserSignedIn) {
        helpers.error(res, {
          message:
            'User not signed in, you can only sign in if your are logged in.'
        })
      }
      let userlogOut = await User.findByIdAndUpdate(
        { _id: currentUser['user_id'] },
        { is_online: false }
      )
      return userlogOut
    } catch (error) {
      return error
    }
  },
  /**
   * Updates a users details
   * @param {Object} req
   */
  updateUser: async function(req) {
    let params = req.body
    let header = req.header('Authorisation')
    try {
      let userDetails = jwt.verify(header, process.env.JWT_SECRET)

      let query = {}
      for (let property in params) {
        query[property] = params[property]
      }
      let update = await User.findByIdAndUpdate(userDetails['user_id'], query)
      return update
    } catch (error) {
      return error
    }
  },
  /**
   * Removes a user and makes their shifts avaliable for pickup
   * @param {Object} req
   */
  removeUser: async function(req) {
    let header = req.header('Authorisation')
    let userDetails = jwt.verify(header, process.env.JWT_SECRET)
    try {
      let found = await User.findByIdAndDelete({ _id: userDetails['user_id'] })
      let makeAllShiftsPickup = await Shift.updateMany(
        { key: userDetails['user_id'] },
        { is_pickup: true }
      )
      if (makeAllShiftsPickup) {
        return found['user_id']
      }
    } catch (error) {
      return error
    }
  },
  /**
   * Login user
   * @param {Object} req.body
   */
  login: async function(helpers, params) {
    if (params.email && params.password) {
      const user = await User.findOneAndUpdate(
        { email: params.email },
        { is_online: true }
      )
      if (!user) {
        return Promise.reject(
          'Email or password are incorrect please, try again'
        )
      } else {
        const isPasswordCorrect = await helpers.db.compareHash(
          params.password,
          user.password
        )
        if (isPasswordCorrect) {
          return Promise.resolve(user)
        } else {
          return Promise.reject('Error when loggin in please try again.')
        }
      }
    } else {
      return Promise.reject('Please provide an email or password')
    }
  },
  /**
   *
   * @param {Function Body} helpers
   * @param {Object} req
   * @param {Object} res
   */
  register: async function(helpers, req, res) {
    // Check if already authenticated
    if (!req.header('Authorisation')) {
      let params = req.body
      const validation = helpers.db.validate(params, 'register')
      let hashedPassword = await helpers.db.genHash(params.password)

      if (validation) {
        const user = new User({
          name: params.name,
          email: params.email,
          employee_type: params.employeeType,
          is_admin: params.is_admin,
          password: hashedPassword,
          is_online: true
        })

        const isEmailPresent = await User.findOne({ email: params.email })
        if (isEmailPresent != null) {
          helpers.error(res, {
            message: 'Email already exists, please try again'
          })
        } else {
          try {
            const savedUser = await user.save()
            return savedUser
          } catch (error) {
            return error
          }
        }
      } else {
        return validation
      }
    } else {
      helpers.error(res, {
        message: 'Already in session, please return to dashboard'
      })
    }
  }
}
