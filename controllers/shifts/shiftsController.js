const Shift = require('./../../models/Shift')
const jwt = require('jsonwebtoken')
const Request = require('./../../models/Request')
// const Request = require('./../../models/Request')

module.exports = (fs, helpers) => {
  /**
   * Retures all the requests
   * @param {*} req
   * @param {*} res
   */
  const allRequests = (req, res) => {
    methods
      .returnAllRequests(req, helpers)
      .then(response => {
        helpers.success(res, { extras: response })
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }
  /**
   * Admins side of apporving a shift
   * Need the following:{
   *  employee :{
   * user ID, email, employee type
   * }
   *
   * }
   * @param {*} req
   * @param {*} res
   */
  const approveShift = (req, res) => {
    methods
      .approve(req, res)
      .then(response => {
        helpers.success(res, { extras: response })
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }

  /**
   * Create shift
   * @param {*} req
   * @param {*} res
   */
  const createShift = (req, res) => {
    methods
      .createShift(helpers, req, res)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }
  /**
   * Get all shifts
   * @param {*} req
   * @param {*} res
   */
  const getAllShifts = (req, res) => {
    methods
      .getShifts(req, 'all')
      .then(response => {
        helpers.success(res, { extras: response })
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }

  /**
   * Update shift
   * @param {*} req
   * @param {*} res
   */
  const updateShift = (req, res) => {
    methods
      .update(req, res, helpers)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(error => {
        helpers.error(res, error)
      })
  }
  /**
   * Remove shift
   * @param {*} req
   * @param {*} res
   */
  const removeShift = (req, res) => {
    methods
      .remove(req, res, helpers)
      .then(response => {
        helpers.success(res, response)
      })
      .catch(err => {
        helpers.error(res, err)
      })
  }

  return {
    getAllShifts: getAllShifts,
    createShift: createShift,
    updateShift: updateShift,
    removeShift: removeShift,
    approveShift: approveShift,
    allRequests: allRequests
  }
}

let methods = {
  /**
   * Return all requests that have a matching user ID
   * @param {*} req
   * @param {*} helpers
   */
  returnAllRequests: async function(req, helpers) {
    let user = helpers.admin.decode(
      req.header('Authorisation'),
      process.env.JWT_SECRET
    )

    // Checks that user is an admin
    let isUserAdmin = helpers.get.isUserAdmin(user)
    console.log(user['user_id'])

    let foundRequests = await Request.find({})
    let personalRequests = []

    if (!isUserAdmin) {
      // Return requests that are the user ID;
      let userID = user['user_id']
      foundRequests.map(request => {
        if (request['participants']['employee'] == userID) {
          personalRequests.push(request)
        }
      })
      if (personalRequests.length > 0) {
        return Promise.resolve(personalRequests)
      } else {
        return Promise.reject('No request so far')
      }
    } else {
      return Promise.resolve(foundRequests)
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  approve: async function(req, res) {
    // Are you an admin ?
    let headers = req.header('Authorisation')
    let isAdmin = headers['user_employee_type'] == 1
    if (isAdmin) {
      // Send an email back to the user confirming the shift
      // Get the shift ID
    } else {
      return Promise.reject(
        'You cannot approve shifts if you are not an admin, contact your admin to become one.'
      )
    }
  },
  /**
   * Makes a shift avaliable for pickup
   * @param {*} req
   * @param {*} res
   * @param {*} helpers
   */
  remove: async function(req, res, helpers) {
    // Need shift ID
    let params = req.body
    let currentUser = req.header('Authorisation')

    if (params.shift_id && params.shift_type) {
      // Is it your shift ?
      let isShiftYours = await Shift.findOne({
        _id: params.shift_id,
        key: currentUser['user_id']
      })
      if (isShiftYours || currentUser['user_employee_type'] == 1) {
        // Send request to admin
        let response = await helpers.admin.createRequest(req, res, {
          shift_type: params.shift_type
        })
      } else if (currentUser['user_employee_type'] == 1) {
        // If admin force pickup and send request
        let makePickup = await Shift.findByIdAndUpdate(
          { _id: params.shift_id },
          { is_pickup: true }
        )
        if (makePickup) {
          return Promise.resolve('Shift successfully updated.')
        } else {
          return Promise.reject(
            'Error when changing shift please try again later'
          )
        }
      } else {
        return Promise.reject("This shift doesn't belong to you")
      }
    } else {
      return Promise.reject(
        'A shift ID or shift type is missing, please input these to continue'
      )
    }
  },
  /**
   * Update a shift and create requests accordingly
   * @param {Object} req
   * @param {Object} res
   * @param {Object} helpers
   */
  update: async function(req, res, helpers) {
    if (req.body.shift_id) {
      let params = req.body
      try {
        let currentUser = req.header('Authorisation')

        let isShiftYours = await Shift.findOne({
          _id: params.shift_id,
          key: currentUser['user_id']
        })
        if (isShiftYours || current['user_employee_type'] == 1) {
          let response = await helpers.admin.createRequest(req, res, {
            shift_type: 2
          })
          return Promise.resolve(response)
        } else {
          return Promise.reject("This shift doesn't belong to you")
        }
      } catch (error) {
        return Promise.reject(error)
      }
    } else {
      return Promise.reject(
        'No shift ID detected plase enter it and try again.'
      )
    }
  },
  /**
   * Gets all shifts pushes them to an array
   * Returns that array
   * @param {*} req
   * @param {*} res
   * @param {*} helpers
   */
  getShifts: async function(req, params) {
    // Get all shifts
    if (params == 'all') {
      try {
        let shifts = await Shift.find({})
        if (shifts.length <= 0) {
          return Promise.reject('No shifts found, please try again later')
        }
        return Promise.resolve(shifts)
      } catch (error) {
        return Promise.reject(error)
      }
    } else {
      let headers = req.header('Authorisation')
      let token = jwt.decode(headers, process.env.JWT_SECRET)
      try {
        let shifts = await Shift.find({ key: token.user_id })
        return Promise.resolve(shifts)
      } catch (error) {
        return Promise.reject(
          'Failed to retrieve shifts, please try again later'
        )
      }
    }
  },

  /**
   * Makes shift not assigned to a user,
   * replaces the key with null,
   * Changes the pickup to true
   * Changes the approved {user:0,admin:0}
   * Sends notification to the admin to approve the drop
   * @param {*} helpers
   * @param {*} req
   * @param {*} res
   */
  dropShift: async function(helpers, req, res) {
    let params = req.body
    let headers = req.header('Authorization')
    let decode = jwt.decode(headers, process.env.JWT_SECRET)

    // Send request with

    let shift = Shift.findByIdAndUpdate(decode['user_id'])
  },
  /**
   * Creates a shift for the user
   * Start time and end time
   * @param {*} helpers
   * @param {*} req
   * @param {*} res
   */
  createShift: async function(helpers, req, res) {
    let params = req.body
    let headers = req.header('Authorisation')
    let isValid = helpers.db.validate(params, 'create_shift')
    let decode = jwt.decode(headers, process.env.JWT_SECRET)

    // Logic for determining the type of shift
    if (
      decode['user_employee_type'] == 2 ||
      decode['user_employee_type'] == 1
    ) {
      shiftType = 1
    } else if (decode['user_employee_type'] == 3) {
      shiftType = 2
    } else if (params.shift_type) {
      shiftType = 3
    }

    if (!params.start_datetime || !params.end_datetime) {
      return Promise.reject("'Please enter a date or time'")
    }

    // Date formatting
    let _startDate = helpers.date.toISO(params.start_datetime)
    let _endDate = helpers.date.toISO(params.end_datetime)
    let isAfterToday = helpers.date.isFuture(_startDate)

    // Checking whether it's after today or not
    if (!isAfterToday) {
      return Promise.reject(
        'You cannot start a shift before today, please enter another date time'
      )
    }
    // Validating the params

    if (isValid) {
      let shift = new Shift({
        key: decode['user_id'],
        employee_type: decode['user_employee_type'],
        start_datetime: _startDate ? _startDate : params.start_datetime,
        end_datetime: _endDate ? _endDate : params.end_datetime,
        shift_type: shiftType
      })
      try {
        // Check that the shift doesn't already exist with the datetime

        const duplicateShift = await Shift.findOne({
          start_datetime: _startDate,
          key: decode['user_id'],
          end_datetime: _endDate
        })

        if (!duplicateShift) {
          // Saves shift (but the admin can only do that)
          const savedShift = await shift.save()
          // Send request for shift to admin
          let request = await helpers.admin.createRequest(req, res, {
            shift_type: params.shift_type
          })
          return Promise.resolve('Shift request successfully sent to admin')
        } else {
          return Promise.reject('Shift already exists')
        }
      } catch (error) {
        return Promise.reject(err.message)
      }
    }
  }
}
