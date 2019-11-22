const Shift = require('./../../models/Shift')

module.exports = {
  pickupShift: async function(req, helpers) {
    const params = req.body
    const shiftID = params.shift_id
    const currentUser = helpers.admin.decode(req.header('Authorisation'))
    const currentUserID = currentUser.user_id
    let shiftType
    const employeeType = currentUser.user_employee_type
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
      return Promise.reject('Failed to pickup shift, please try again later')
    }
  },

  /**
   * Update a shift with new object
   */
  update: async function(req) {
    const shiftID = req.body.shift_id
    const newShiftContent = req.body.shift_content
    try {
      const updatedShift = await Shift.updateOne(
        { _id: shiftID },
        { ...newShiftContent }
      )
    } catch (error) {
      return Promise.reject('Error when updating shift, please try again')
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
        let shifts = await Shift.find({ key: token._id })
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
      let repeatDays = params.repeatDays
      let startDate = params.startDate
      let endDate = params.endDate
      let employeeType = decode.user_employee_type
      let shiftType

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
      } else {
        return Promise.reject('Shift already exists')
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
