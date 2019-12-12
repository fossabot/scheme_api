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
    // console.log(params)
    // if (!clientID) {
    //   return Promise.reject('Missing paramters, please try again later')
    // }
    try {
      let users = await User.find({})
      return Promise.resolve(users)
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
    const user = await User.findOneAndUpdate(
      { email: params.email },
      { is_online: true }
    )
    if (!user) {
      return Promise.reject('Email or password are incorrect please, try again')
    } else {
      let isPasswordCorrect
      if (user.password) {
        isPasswordCorrect = await helpers.db.compareHash(
          params.password,
          user.password
        )
      } else {
        return Promise.reject('Failed to get password please try again later.')
      }
      if (isPasswordCorrect) {
        const userObj = user.toObject()
        delete userObj.password

        const token = helpers.admin.sign(userObj)
        return Promise.resolve({ user: userObj, token: token })
      } else {
        return Promise.reject(
          'Email or password are incorrect please, try again'
        )
      }
    }
  },

  register: async function(req, helpers) {
    try {
      const params = req.body
      const email = params.email
      const password = params.password
      const service = params.service || null
      const name = params.name
      const employeeType = params.employee_type
      const clientID = params.client_id || 123
      const dateOfBirth = helpers.date.toISO(params.date_of_birth)
      const gender = params.gender
      const hashedPwd = await helpers.db.genHash(password)

      if (!email || !password || !name) {
        return Promise.reject('Missing parameters, please try again')
      }
      if (service) {
        switch (service) {
          case 'google': {
          }
          case 'facebook': {
          }
          case 'linkedin': {
          }
        }
      }
      const isDuplicate = await User.findOne({ email: email })
      if (isDuplicate) {
        return Promise.reject('User already exists, please try again later')
      } else {
        const mongoUser = {
          email: email,
          password: hashedPwd,
          employee_type: employeeType,
          name: name,
          is_online: true,
          client_id: clientID,
          gender: gender,
          date_of_birth: dateOfBirth
        }

        const newUser = new User(mongoUser)
        const createdUser = await newUser.save()

        const secureUser = {
          _id: createdUser._id,
          email: createdUser.email,
          name: createdUser.name,
          employee_type: createdUser.employee_type,
          registration_date: createdUser.registration_date
        }

        const token = helpers.admin.sign(secureUser)

        return Promise.resolve({ user: createdUser, token: token })
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
