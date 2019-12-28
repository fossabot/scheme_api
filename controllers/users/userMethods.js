const User = require('./../../models/User')
const helpers = require('./../../helpers/helpers')
const verifier = require('email-verify')

let verifyEmail = (email, errmsg) => {
  return new Promise((resolve, reject) => {
    verifier.verify(email, (err, info) => {
      if (err) reject(err.message)
      else {
        if (info.success) {
          resolve(info.success)
        } else {
          reject(errmsg)
        }
      }
    })
  })
}
module.exports = {
  verifyUser: async req => {
    let params = req.body
    let email = params.email
    let errmsg = 'Failed to verify email, please enter a valid email.'
    let successmsg = 'Email successfully verified.'
    try {
      let verifiedEmail = await verifyEmail(email, errmsg)

      if (verifiedEmail) {
        let verfiedUser = await User.findOneAndUpdate(
          { email: email },
          { verified: true }
        )
        if (verfiedUser) {
          return Promise.resolve(successmsg)
        } else {
          return Promise.reject(errmsg)
        }
      } else {
        return Promise.reject(errmsg)
      }
    } catch (e) {
      return Promise.reject(e)
    }
  },
  getAllUsers: async req => {
    const params = req.body
    const clientID = params.client_id

    try {
      const properties = 'name email employee_type is_online _id'
      let users = await User.find({ _id: { $ne: req.user._id } }, properties)

      return Promise.resolve(users)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  logOut: async req => {
    let currentUser = req.user._id
    try {
      let isUserSignedIn = await User.findOne({
        _id: currentUser,
        is_online: true
      })
      if (!isUserSignedIn) {
        return Promise.reject(
          'User not signed in, you can only sign in if your are logged in.'
        )
      }
      await User.findByIdAndUpdate({ _id: currentUser }, { is_online: false })
      return Promise.resolve('User successfully logged out.')
    } catch (error) {
      return Promise.reject(error)
    }
  },

  updateUser: async req => {
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

  removeUser: async req => {
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

  login: async (req, helpers, service) => {
    const params = req.body
    console.log(params)
    const user = await User.findOne({ email: params.email })
    console.log(user)
    if (!user) {
      return Promise.reject('Email or password are incorrect please, try again')
    } else {
      let isPasswordCorrect = false

      if (!service) {
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
      }
      if (service || isPasswordCorrect) {
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

  register: async (req, helpers) => {
    try {
      const params = req.body
      const email = params.email
      const password = params.password
      const name = params.name
      const employeeType = params.employee_type
      const clientID = params.client_id || 123
      const dateOfBirth = params.date_of_birth
      const gender = params.gender
      const hashedPwd = await helpers.db.genHash(password)
      const adminGen = params.admin_gen
      if (!email || !password || !name) {
        return Promise.reject('Missing parameters, please try again')
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
          date_of_birth: dateOfBirth,
          admin_gen: adminGen
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
        let returnData = {}

        const token = helpers.admin.sign(secureUser)
        if (adminGen) {
          returnData = 'Employee successfully created'
        } else {
          returnData = { user: createdUser, token: token }
        }
        return Promise.resolve(returnData)
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
