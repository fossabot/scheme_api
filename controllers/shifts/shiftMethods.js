const Shift = require('./../../models/Shift')

module.exports = {
  updateShift: async req => {
    const params = req.body
    const shiftID = params.shift_id
    const updateParams = params.shift_update
    try {
      const updatedShift = await Shift.findByIdAndUpdate(
        { _id: shiftID },
        updateParams
      )
      return Promise.resolve(updatedShift)
    } catch (error) {
      return Promise.reject('Error when updating shift, please try again')
    }
  },

  getShift: async req => {
    try {
      let shifts = await Shift.find({})
      return Promise.resolve(shifts)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  createShift: async req => {
    try {
      let params = req.body
      const user = req.user
      let assignedTo = params.assigned_to ? params.assigned_to : user._id
      let repeatDays = params.repeatDays
      let startDate = params.startDate
      let endDate = params.endDate
      let employeeType = user.employee_type
      let shiftType = !params.shift_type ? employeeType : params.shift_type

      if (!startDate || !endDate) {
        return Promise.reject('Please enter a date or time')
      }

      let mongoShift = {
        assigned_to: assignedTo,
        startDate: startDate,
        endDate: endDate,
        shift_type: shiftType
      }
      if (repeatDays) {
        mongoShift['repeat_days'] = repeatDays
      }

      // Check that the shift doesn't already exist with the datetime
      const duplicateShift = await Shift.findOne({
        startDate: startDate,
        key: assignedTo,
        endDate: endDate
      })

      if (!duplicateShift) {
        let shift = new Shift(mongoShift)
        const savedShift = await shift.save()
        return Promise.resolve(savedShift)
      } else {
        return Promise.reject('Shift already exists')
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
