// Moment
const moment = require('moment')
const format = 'D MMMM HH:MM'
const timezone = 'Europe/London'
const now = moment().toISOString()

module.exports = {
  format: function (date, _format) {
    let configFormat = _format ? _format : format
    return moment(date).format(configFormat)
  },
  isToday: function (date, _format) {
    return moment(date).isSame(new Date(), 'day')
  },
  isPast: function (date, _format) {
    return moment(date).isBefore(now)
  },
  isFuture: function (date, isNow, afterDate) {
    if (isNow) {
      return moment(date).isAfter(now)
    } else {
      return moment(date).isAfter(afterDate)
    }
  },
  isThisWeek: function (date, _format) {
    return moment(date).isBetween(now.startOf('week'), now.endOf('week'))
  },
  diff() {

  },
  compare: function (firstDate, secondDate, _format) {
    let configFormat = _format ? _format : format
    secondDate = moment(secondDate, configFormat, timezone)
    return moment(firstDate).isAfter(secondDate)
  },
  toISO: function (date, _format) {
    return moment(date).toISOString()
  },
  timeAgo: function (date) {
    return moment(date).fromNow()
  },
  calendar: function (date) {
    return moment(date).calendar()
  }
}
