const User = require('./../../models/User')
module.exports = {
  upgradePermissions: async function(req) {
    const changedUserID = req.body.user_id
    try {
      const changeUser = await User.updateOne(
        { _id: changedUserID },
        { employee_type: 1 }
      )
      return Promise.resolve(changeUser)
    } catch (error) {
      return Promise.reject('Failed to update user, please try again')
    }
  },
  /**
   * Returns one user based on ID
   * @param {*} req
   * @param {*} helpers
   */
  getOneUser: async function(req, helpers) {
    let params = req.body
    if (params.user_id) {
      let foundUser = await User.findOne({ _id: params.user_id })
      delete foundUser['password']
      delete foundUser['registered_date']
      return Promise.resolve(foundUser)
    } else {
      return Promise.reject(
        'No user ID found, please select a user to get their details'
      )
    }
  },
  /**
   * Returns all users
   */
  getAllUsers: async function() {
    try {
      let users = await User.find({})
      let newUsers = []
      if (users.length > 0) {
        for (let i = 0, len = users.length; i < len; i++) {
          let user = users[i]
          delete user['password']
          delete user['registered_date']
          newUsers.push(user)
        }
        return Promise.resolve(users)
      } else {
        return Promise.reject('No users found, please try again later')
      }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  /**
    Sign out the current session and delete their token and remove that they are online
    * @param {*} req
    * @param {*} res
    * @param {*} helpers
  **/
  logOut: async function(req, res) {
    let authHeader = req.header('Authorisation')
    let currentUser = jwt.decode(authHeader, process.env.JWT_SECRET)
    try {
      let isUserSignedIn = await User.findOne({
        _id: currentUser['user_id'],
        is_online: true
      })
      if (!isUserSignedIn) {
        return Promise.reject(
          'User not signed in, you can only sign in if your are logged in.'
        )
      }
      let userlogOut = await User.findByIdAndUpdate(
        { _id: currentUser['user_id'] },
        { is_online: false }
      )
      return Promise.resolve(userlogOut)
    } catch (error) {
      return Promise.reject(error)
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
      return Promise.resolve(update)
    } catch (error) {
      return Promise.reject(error)
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
      const user = await User.updateOne(
        { email: params.email },
        { is_online: true }
      )
      if (user.n <= 0) {
        return Promise.reject(
          'Email or password are incorrect please, try again'
        )
      } else {
        // Check passwords
        let isPasswordCorrect
        if (user.password) {
          isPasswordCorrect = await helpers.db.compareHash(
            params.password,
            user.password
          )
        } else {
          return Promise.reject(
            'Failed to get password please try again later.'
          )
        }
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
          return Promise.reject('Email already exists')
        } else {
          try {
            const savedUser = await user.save()
            return Promise.resolve(savedUser)
          } catch (error) {
            return Promise.reject(error)
          }
        }
      } else {
        return validation
      }
    } else {
      return Promise.reject('Already in session, please return to dashboard')
    }
  }
}
