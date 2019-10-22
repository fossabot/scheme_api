const shiftData = require('./../../db/shifts')
module.exports = (fs, helpers) => {
  const getAllShifts = (req, res) => {
    res.json({
      shifts: getShifts(helpers),
      type: 'success'
    })
  }
  const getShiftDetails = (req, res) => {
    if (req.body.userID && req.body.shiftID) {
      shiftData.shifts.map(shift => {
        req.body.userID
      })
    } else {
      helpers.createError(req, res, { message: 'No user ID found' })
    }
  }

  return {
    getAllShifts: getAllShifts,
    getShiftDetails: getShiftDetails
  }
}
/**
 *
 * @param {*} helpers
 */
function getShifts(helpers) {
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

    shift['start_date'] = dateMethods.format(shift['start_date'])
    shift['end_date'] = dateMethods.format(shift['end_date'])
    let startDate = shift['start_date']

    if (shift['shift_type'] == 1) {
      setShiftProperties(shift, 'blue', user, dateMethods)
      checkShiftDates(true, startDate, shiftsObj, dateMethods, shift)
    } else if (shift['shift_type'] == 2) {
      setShiftProperties(shift, 'green', user, dateMethods)
      checkShiftDates(true, startDate, shiftsObj, dateMethods, shift)
    } else {
      setShiftProperties(shift, 'red', user, dateMethods)
      checkShiftDates(false, startDate, shiftsObj, dateMethods, shift)
    }
    shiftsObj['all'].push(shift)
  }
  return {
    shiftsObj
  }
}
/**
 *
 * @param {*} shift
 * @param {*} highlightColour
 * @param {*} user
 */
function setShiftProperties(shift, highlightColour, user, dateMethods) {
  let startTime = shift['start_time']
  let endTime = shift['end_time']

  if (shift['shift_type'] == 3) {
    shift['popover']['label'] = `${user}'s Holiday until ${shift['end_date']} `
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
}
/**
 *
 * @param {*} checkShift
 * @param {*} startDate
 * @param {*} shiftsObj
 * @param {*} dateMethods
 * @param {*} shift
 */
function checkShiftDates(checkShift, startDate, shiftsObj, dateMethods, shift) {
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
}

function getUser(id) {
  let userData = require('./../../db/users')
  let returnedUser = userData.users.find(user => {
    return user['id'] == id
  })
  return `${returnedUser['first_name']} ${returnedUser['last_name']}`
}
