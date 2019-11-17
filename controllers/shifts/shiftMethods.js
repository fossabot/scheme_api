const Shift = require('./../../models/Shift')
const Request = require('./../../models/Request')
const requestMethods = {
  approve: async function(req, res) {
    let params = req.body
    try {
      let foundShift = await Shift.findByIdAndUpdate(
        { _id: params._id },
        { is_approved: { admin: 1 } }
      )
      if (foundShift) {
        // Modify the requests to be multidirectional
        return Promise.resolve(foundShift)
      } else {
        return Promise.reject('Failed to update shift, please try again later.')
      }
    } catch (error) {
      return Promise.reject(res, error)
    }
  },
  returnAllRequests: async function(req, helpers) {
    try {
      let requests = await Request.find({})
      if (requests.length > 0) {
        return Promise.resolve(requests)
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = {
  requestMethods,

  pickupShift: async function(req, helpers) {
    let params = req.body
    let shiftID = params.shift_id
    let currentUser = helpers.admin.decode(req.header('Authorisation'))
    let currentUserID = currentUser.user_id
    let shiftType
    employeeType = currentUser.user_employee_type
    if (params.shift_type) {
      shiftType = params.shift_type
    }
    shiftType = employeeType

    // Get shift with that shift ID
    try {
      let updateShift = await Shift.updateOne(
        { _id: shiftID, shift_type: shiftType, is_pickup: true },
        { key: currentUserID }
      )
      if (updateShift.n > 0) {
        let emailConfig = {
          from: currentUser.user_email,
          text: `${currentUser.user_name} has picked up a shift`
        }
        try {
          let updateShiftRequest = await helpers.admin.sendEmail(emailConfig)
          return Promise.resolve(updateShiftRequest)
        } catch (error) {
          return Promise.reject(error)
        }
      } else {
        return Promise.reject('Failed to pickup shift, please try again later')
      }
    } catch (error) {
      console.log(error)
      return Promise.reject('Failed to pickup shift, please try again later')
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

  dropShift: async function(req, res, helpers) {
    let params = req.body
    let headers = req.header('Authorisation')
    let decode = helpers.admin.decode(headers)

    // Send request with
    try {
      let shift = await Shift.findOneAndUpdate({
        _id: params.shift_id,
        key: decode['user_id'],
        is_pickup: false,
        shift_type: decode.user_employee_type
      })
      if (shift.n > 0) {
        helpers.admin.sendEmail({
          from: decode.user_email,
          text: `${decode.user_name} dropped a shift from ${helpers.date.format(
            shift.startDate,
            'DD MMMM HH:MM'
          )} to ${helpers.date.format(shift.endDate, 'DD MMMM HH:MM')}`
        })
        return Promise.resolve()
      } else {
        return Promise.reject('Failed to update shift, please try again later')
      }
    } catch (error) {
      return Promise.reject('Failed to update shift, please try again')
    }
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
        return Promise.reject('Please enter a date or time')
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
              start: helpers.date.format(startDate),
              end: helpers.date.format(endDate)
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
