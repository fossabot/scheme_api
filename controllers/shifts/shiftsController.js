const Shift = require('./../../models/Shift')
const Request = require('./../../models/Request')

module.exports = (fs, helpers) => {
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

  const createShift = (req, res) => {
    methods
      .createShift(helpers, req, res)
      .then(response => {
        helpers.success(res, { extras: response })
      })
      .catch(err => {
        helpers.error(res, { message: err })
      })
  }

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
  returnAllRequests: async function(req, helpers) {
    try {
      let requests = await Request.find({})
      if (requests.length > 0) {
        return Promise.resolve(requests)
      }
    } catch (error) {
      return Promise.reject(error)
    }
  },

  approve: async function(req, res) {
    // Are you an admin ?
    let headers = req.header('Authorisation')
    if (isAdmin) {
      // Send an email back to the user confirming the shift
      // Get the shift ID
    } else {
      return Promise.reject(
        'You cannot approve shifts if you are not an admin, contact your admin to become one.'
      )
    }
  },

  remove: async function(req, res, helpers) {
    // Need shift ID
    let params = req.body
    let currentUser = req.header('Authorisation')

    if (params.shift_id && params.shift_type) {
      // Is it your shift ?

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
      let token = helpers.admin.decode(headers)
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

  dropShift: async function(helpers, req, res) {
    let params = req.body
    let headers = req.header('Authorization')
    let decode = helpers.admin.decode(headers)

    // Send request with

    let shift = Shift.findByIdAndUpdate(decode['user_id'])
  },

  createShift: async function(helpers, req, res) {
    try {
      let params = req.body
      let headers = req.header('Authorisation')
      let decode = helpers.admin.decode(headers)
      let assignedTo = params.assigned_to
        ? params.assigned_to
        : decode['user_id']
      let repeatDays = params.repeat_days
      let startDate = params.startDate
      let endDate = params.endDate
      let employeeType = decode.user_employee_type
      let shiftType, flag

      // Logic for determining the type of shift
      if (employeeType == 2 || employeeType == 1) {
        shiftType = 1
      } else if (employeeType == 3) {
        shiftType = 2
      } else if (params.shift_type) {
        shiftType = 3
      }

      if (!startDate || !endDate) {
        return Promise.reject("'Please enter a date or time'")
      }

      let mongoShift = {
        key: assignedTo,
        startDate: startDate,
        endDate: endDate,
        shift_type: shiftType
      }
      if (repeatDays) {
        mongoShift['repeat_days'] = repeatDays
      }
      let shift = new Shift(mongoShift)

      // Check that the shift doesn't already exist with the datetime
      const duplicateShift = await Shift.findOne({
        startDate: startDate,
        key: assignedTo,
        endDate: endDate
      })

      if (!duplicateShift) {
        const savedShift = await shift.save()
        if (savedShift) {
          // Config for requests
          let requestConfig = {
            request_type: shiftType,
            shift_id: savedShift['_id'],
            currentUser: decode,
            dates: {
              start: helpers.date.format(startDate, 'DD MMMM HH:MM'),
              end: helpers.date.format(endDate, 'DD MMMM HH:MM')
            }
          }

          let request = await helpers.admin.createRequest(
            req,
            res,
            requestConfig
          )

          if (request) {
            return Promise.resolve(request)
          }
        } else {
          return Promise.reject(
            'Error either during creating the request or shift'
          )
        }
      } else {
        return Promise.reject('Shift already exists')
      }
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
