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
    methods.login(helpers, params, res).then(user => {
      const token = webToken.sign(
        {
          user_id: user._id,
          user_email: user.email,
          user_employee_type: user.employee_type,
          user_name: user.name
        },
        process.env.JWT_SECRET
      )
      res.header('Authorisation', token).json({
        Authorisation: token
      })
    })
  }

  /**
   * Signs out the current user
   * @param {*} req
   * @param {*} res
   */
  const signOut = (req, res) => {
    methods.signOut(req, res, helpers).then(user => {
      res.json(user)
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
    methods.register(helpers, req, res).then(user => {
      res.json({
        user_id: user._id,
        user_email: user.email,
        user_employee_type: user.employee_type,
        user_name: user.name
      })
    })
  }

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
    signOut: signOut
  }
}

var methods = {
  // /**
  //  * Sign out the current session and delete their token
  //  * @param {*} req
  //  * @param {*} res
  //  * @param {*} helpers
  //  */
  // signOut:function(req,res,helpers){
  //   let decode = webToken.verify(req.headers("Authorization"),process.env.JWT_SECRET);
  //   let found = await User.findOne(decode["user_id"]);
  //   if(found){
  //     webToken.
  //   }

  // },
  /**
   *
   * @param {Object} req
   */
  updateUser: async function(req) {
    let params = req.body
    let header = req.header('Authorization')
    try {
      let userDetails = webToken.verify(header, process.env.JWT_SECRET)

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
   *
   * @param {Object} req
   */
  removeUser: async function(req) {
    let header = req.header('Authorization')
    let userDetails = webToken.verify(header, process.env.JWT_SECRET)
    try {
      let found = await User.findOneAndDelete({ _id: userDetails['user_id'] })
      return found['user_id']
    } catch (error) {
      return error
    }
  },
  /**
   * Login user
   * @param {Object} req.body
   */
  login: async function(helpers, params, res) {
    const user = await User.findOneAndUpdate(
      { email: params.email },
      { is_online: true }
    )
    if (!user) {
      helpers.createError(res, {
        message: 'Email or password are incorrect please, try again'
      })
    } else {
      const isPasswordCorrect = await helpers.DatabaseMethods.compareHash(
        params.password,
        user.password
      )
      if (isPasswordCorrect) {
        return user
      } else {
        helpers.createError(res, {
          message: 'Error when loggin in please try again.'
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
        is_admin: params.is_admin,
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
