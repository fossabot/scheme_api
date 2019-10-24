const shiftData = require('./../../db/shifts')
const Shift = require('./../../models/Shift')
const jwt = require('jsonwebtoken')
module.exports = (fs, helpers) => {
  const createShift = (req, res) => {
    methods.createShift(helpers, req, res).then(response => {
      res.json(response)
    })
  }
  const getAllShifts = (req, res) => {
    res.json({
      shifts: methods.getShifts(helpers),
      type: 'success'
    })
  }
  const getShiftDetails = (req, res) => {
    if (req.body.userID && req.body.shiftID) {
      shiftData.shifts.map(shift => {
        req.body.userID
      })
    } else {
      helpers.createError(res, { message: 'No user ID found' })
    }
  }

  return {
    getAllShifts: getAllShifts,
    getShiftDetails: getShiftDetails,
    createShift: createShift
  }
}

let methods = {
  getShifts: function(helpers) {
    let dateMethods = helpers.DateMethods
    let shiftsObj = {
      holidays: {
        today: [],
        upcoming: [],
        previous: []
      },
      shifts: {
        today: [],
        upcoming: [],
        previous: []
      },
      all: []
    }

    for (let i = 0, len = shiftData.shifts.length; i < len; i++) {
      let shift = shiftData.shifts[i]

      let dateObj = {
        start: shift['start_date'],
        end: shift['end_date']
      }
      shift['dates'] = []
      shift['dates'].push(dateObj)

      let user = getUser(shift['key'])
      shift['user_fullname'] = user
      shift['popover'] = {
        label: ''
      }

      shift['start_date'] = dateMethods.format(shift['start_date'], null)
      shift['end_date'] = dateMethods.format(shift['end_date'], null)
      let startDate = shift['start_date']

      if (shift['shift_type'] == 1) {
        this.setShiftProperties(shift, 'blue', user, dateMethods)
        this.checkShiftDates(true, startDate, shiftsObj, dateMethods, shift)
      } else if (shift['shift_type'] == 2) {
        this.setShiftProperties(shift, 'green', user, dateMethods)
        this.checkShiftDates(true, startDate, shiftsObj, dateMethods, shift)
      } else {
        this.setShiftProperties(shift, 'red', user, dateMethods)
        this.checkShiftDates(false, startDate, shiftsObj, dateMethods, shift)
      }
      shiftsObj['all'].push(shift)
    }
    return {
      shiftsObj
    }
  },
  setShiftProperties: function(shift, highlightColour, user, dateMethods) {
    let startTime = shift['start_time']
    let endTime = shift['end_time']

    if (shift['shift_type'] == 3) {
      shift['popover']['label'] = `${user}'s Holiday until ${
        shift['end_date']
      } `
    } else if (shift['shift_type'] == 2) {
      shift['popover'][
        'label'
      ] = `${user}'s locum shift from  ${startTime} to ${endTime}`
    } else {
      shift['popover'][
        'label'
      ] = `${user}'s  shift from  ${startTime} to ${endTime}`
    }
    shift['highlight'] = highlightColour
  },
  checkShiftDates: function(
    checkShift,
    startDate,
    shiftsObj,
    dateMethods,
    shift
  ) {
    if (checkShift) {
      shiftsObj = shiftsObj['shifts']
      if (dateMethods.isToday(startDate)) {
        shiftsObj.today.push(shift)
      } else if (dateMethods.isFuture(startDate)) {
        shiftsObj.upcoming.push(shift)
      } else {
        shiftsObj.previous.push(shift)
      }
    } else {
      shiftsObj = shiftsObj['holidays']

      if (dateMethods.isToday(startDate)) {
        shiftsObj.today.push(shift)
      } else if (dateMethods.isFuture(startDate)) {
        shiftsObj.upcoming.push(shift)
      } else {
        shiftsObj.previous.push(shift)
      }
    }
  },
  /**
   *
   * @param {*} id
   */
  getUser: function(id) {
    let userData = require('./../../db/users')
    let returnedUser = userData.users.find(user => {
      return user['id'] == id
    })
    return `${returnedUser['first_name']} ${returnedUser['last_name']}`
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
    let headers = req.header('Authorization')
    let isValid = helpers.DatabaseMethods.validate(params, 'create_shift')
    let decode = jwt.decode(headers, process.env.JWT_SECRET)
    let shiftType

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
      helpers.createError(res, { message: 'Please enter a date or time' })
    }
    // Date formatting
    let _startDate = helpers.DateMethods.toISO(params.start_datetime)
    let _endDate = helpers.DateMethods.toISO(params.end_datetime)
    let isAfterToday = helpers.DateMethods.isFuture(_startDate)
    console.log(isAfterToday)
    // Checking whether it's after today or not
    if (!isAfterToday) {
      helpers.createError(res, {
        message:
          'You cannot start a shift before today, please enter another date time'
      })
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
          end_datetime: _endDate
        })

        if (!duplicateShift) {
          const savedShift = await shift.save()
          return savedShift
        } else {
          helpers.createError(res, {
            message:
              'Shift already exists, please enter a different date or time'
          })
        }
      } catch (error) {
        helpers.createError(res, error)
        return error
      }
    }
  }
}
