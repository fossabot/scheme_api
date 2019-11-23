const User = require('./../../models/User')
module.exports = {
  getOneUser: async function(req) {
    let params = req.body
    if (params._id) {
      let foundUser = await User.findOne({ _id: params._id })
      delete foundUser['password']
      return Promise.resolve(foundUser)
    } else {
      return Promise.reject(
        'No user ID found, please select a user to get their details'
      )
    }
  },

  getAllUsers: async function(req) {
    const params = req.body
    const clientID = params.client_id
    if (!clientID) {
      return Promise.reject('Missing paramters, please try again later')
    }
    try {
      let users = await User.find({ client_id: clientID })
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

  logOut: async function(req, helpers) {
    let currentUser = helpers.db.decode(req)
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

  updateUser: async function(req) {
    let params = req.body
    const userID = params._id
    const userUpdate = params.user_update
    try {
      const updatedUser = await User.updateOne({ _id: userID }, userUpdate)
      return Promise.resolve('User successfully updated')
    } catch (error) {
      return Promise.reject(error)
    }
  },

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

  login: async function(req, helpers) {
    const params = req.body
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

  register: async function(req, helpers) {
    try {
      const params = req.body

      const email = params.email
      const password = params.password
      const name = params.name
      const employeeType = params.employee_type
      const clientID = params.client_id
      if (!email || !password || !name || !clientID) {
        return Promise.reject('Missing parameters, please try again')
      }

      const isDuplicate = await User.findOne({ email: email })
      if (isDuplicate) {
        return Promise.reject('User already exists, please try again later')
      } else {
        const hashedPwd = await helpers.db.genHash(password)
        const mongoUser = {
          email: email,
          password: hashedPwd,
          employee_type: employeeType,
          name: name,
          is_online: true,
          client_id: clientID
        }

        const newUser = new User(mongoUser)
        const createdUser = await newUser.save()
        delete mongoUser.password
        const token = helpers.admin.sign(mongoUser)
        delete createdUser.password
        return Promise.resolve({ user: createdUser, token: token })
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
