// Validation
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
// Moment
const moment = require('moment-timezone')
const format = 'YYYY-MM-DD HH:mm'
const timezone = 'Europe/London'
const now = moment.tz(timezone)
module.exports = () => {
  function createError(res, err) {
    res
      .json({
        success: false,
        message: err['message'],
        code: !err['code'] ? 101 : err['code']
      })
      .end()
  }
  let DatabaseMethods = {
    /**
     *
     * @param {String} string
     * @param {Number} saltRounds
     */
    genHash: async function(string) {
      let salt = await bcrypt.genSalt(10)
      let hash = await bcrypt.hash(string, salt)
      return hash
    },
    /**
     *
     * @param {String} string
     */
    compareHash: async function(initString, stringToCompare) {
      let isSame = await bcrypt.compare(initString, stringToCompare)
      return isSame
    },
    /**
     *
     * @param {Object} toValidate
     * @param {String} event
     */
    validate: function(toValidate, event) {
      let isError = false

      let validations = {
        createShift: Joi.object({
          start_datetime: Joi.date().required(),
          end_datetime: Joi.date().required(),
          shift_type: Joi.number().required()
        }),
        createHoliday: Joi.object({
          start_date: Joi.date().required(),
          end_date: Joi.date().required()
        }),
        register: Joi.object({
          name: Joi.string()
            .min(6)
            .required(),
          email: Joi.string()
            .min(6)
            .required()
            .email(),
          employee_type: Joi.number().required(),
          password: Joi.string()
            .required()
            .max(120)
            .min(6)
        }),
        login: Joi.object({
          email: Joi.string()
            .required()
            .email()
        })
      }
      switch (event) {
        case 'register': {
          const { error, value } = validations.register.validate(toValidate)
          return error ? error : value
        }
        case 'login': {
          const { error, value } = validations.login.validate(toValidate)
          return error ? error : value
        }
        case 'create_shift': {
          const { error, value } = validations.createShift.validate(toValidate)
          return error ? error : value
        }
        case 'create_holiday': {
          const { error, value } = validations.createHoliday.validate(
            toValidate
          )
          return error ? error : value
        }
      }
    }
  }
  let DateMethods = {
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
    isFuture: function(date, _format) {
      let configFormat = _format ? _format : format
      return moment(date, configFormat, timezone).isAfter(now)
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
    }
  }

  return {
    createError: createError,
    DateMethods: DateMethods,
    DatabaseMethods: DatabaseMethods
  }
}
