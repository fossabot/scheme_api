// Moment
const moment = require('moment-timezone')
const format = 'YYYY-MM-DD HH:mm'
const timezone = 'Europe/London'
const now = moment.tz(timezone).toISOString()

module.exports = {
  format: function(date, _format) {
    let configFormat = _format ? _format : format
    return moment(date, format, timezone).format(configFormat)
  },
  isToday: function(date, _format) {
    let configFormat = _format ? _format : format
    return moment(date, configFormat, timezone).isSame(new Date(), 'day')
  },
  isPast: function(date, _format) {
    let configFormat = _format ? _format : format
    return moment(date, configFormat, timezone).isBefore(now)
  },
  isFuture: function(date, isNow, afterDate) {
    if (isNow) {
      return moment(date, timezone).isAfter(now)
    } else {
      return moment(date, timezone).isAfter(afterDate)
    }
  },
  isThisWeek: function(date, _format) {
    let configFormat = _format ? _format : format
    return moment(date, configFormat, timezone).isBetween(
      now.startOf('week'),
      now.endOf('week')
    )
  },
  compare: function(firstDate, secondDate, _format) {
    let configFormat = _format ? _format : format
    secondDate = moment(secondDate, configFormat, timezone)
    return moment(firstDate, configFormat, timezone).isAfter(secondDate)
  },
  toISO: function(date, _format) {
    return moment(date, 'YYYY-MM-DD HH:mm', timezone).toISOString()
  },
  timeAgo: function(date) {
    return moment(date).fromNow()
  },
  calendar: function(date) {
    return moment(date).calendar()
  }
}
