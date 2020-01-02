const Shift = require('./../../models/Shift')
const Notification = require('./../../models/Notification')
const User = require('./../../models/User')
async function getAdmins() {
  let admins = await User.find({ employee_type: 1 }, '_id')
  return admins
}
async function createNotification(config) {
  /**
   * title: '',
    message: msg,
    for: admins,
    content: { id: shiftID, update: updateParams },
    type: 'approve',
    url: '/shifts/update',
    requested_by: req.user._id
   */
  await new Notification(config).save()
}
module.exports = {
  deleteShift: async req => {
    try {
      const shiftID = req.body.id
      await Shift.findByIdAndDelete({ _id: shiftID })
      return Promise.resolve('Shift successfully deleted')
    } catch (error) {
      return Promise.reject(error)
    }
  },
  updateShift: async req => {
    const params = req.body
    const shiftID = params.id
    const updateParams = params.update

    // Check if admin & create notification for admins to approve
    if (!req.isAdmin) {
      let msg = `${req.user.name} is requesting changes to their shift`
      let sameShiftNotifications = await Notification.findOne({
        content: { id: shiftID },
        requested_by: req.user._id
      })
      if (sameShiftNotifications && sameShiftNotifications.length >= 2) {
        return Promise.reject(
          'You have made the maximum shift change requests for this shift.'
        )
      }

      await createNotification({
        title: '',
        message: msg,
        for: await getAdmins(),
        requestData: { id: shiftID, update: updateParams },
        content: updateParams,
        type: 'approve',
        url: '/shifts/update',
        requested_by: req.user._id
      })
    } else {
      try {
        const updatedShift = await Shift.findByIdAndUpdate(
          { _id: shiftID },
          updateParams
        )
        return Promise.resolve(updatedShift)
      } catch (error) {
        return Promise.reject('Error when updating shift, please try again')
      }
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
      let isApprvoed = {}
      if (req.isAdmin) {
        isApprvoed = {
          admin: 1,
          user: 1
        }
      }
      if (!startDate || !endDate) {
        return Promise.reject('Please enter a date or time')
      }

      let mongoShift = {
        is_approved: isApprvoed,
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
        // Send request to admins if they are an admin

        if (req.isAdmin) {
          const savedShift = await shift.save()
          return Promise.resolve(savedShift)
        } else {

          // Create notification
          let admins = await getAdmins()
          let msg = `${req.user.name} has made a request`

          await createNotification({
            message: msg,
            for: admins,
            content: mongoShift,
            type: 'approve',
            requestBody: { url: '/shifts/create', method: 'POST', data: mongoShift },
            requested_by: req.user._id
          })

          return Promise.resolve(
            'Request successfully sent to admins for approval'
          )
        }
      } else {
        return Promise.reject('Shift already exists')
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
