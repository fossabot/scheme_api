const Shift = require('./../../models/Shift')

module.exports = {
  update: async function(req) {
    const params = req.body
    const shiftID = params.shift_id
    const shiftUpdate = params.shift_update
    try {
      const updatedShift = await Shift.updateOne({ _id: shiftID }, shiftUpdate)
    } catch (error) {
      return Promise.reject('Error when updating shift, please try again')
    }
  },

  get: async function(req, params) {
    try {
      let shifts = await Shift.find({})
      if (shifts.length <= 0) {
        return Promise.reject('No shifts found, please try again later')
      }
      return Promise.resolve(shifts)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  create: async function(helpers, req, res) {
    try {
      let params = req.body
      let decode = helpers.admin.decode(req)
      let assignedTo = params.assigned_to ? params.assigned_to : decode._id
      let repeatDays = params.repeatDays
      let startDate = params.startDate
      let endDate = params.endDate
      let employeeType = decode.employee_type
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
