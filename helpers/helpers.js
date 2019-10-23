// Validation
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
// Moment
const moment = require('moment-timezone')
const format = 'DD/MM/YYYY'
const timezone = 'Europe/London'
const now = moment.tz(timezone)
module.exports = () => {
  function createError(res, err) {
    res
      .json({
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
    hash: async function(string) {
      let salt = await bcrypt.genSalt(10)
      let hash = await bcrypt.hash(string, salt)
      return hash
    },
    /**
     *
     * @param {Object} toValidate
     * @param {String} event
     */
    validate: function(toValidate, event) {
      let isError = false

      let validations = {
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
      }
    },
    /**
     * Finds an item within the database
     * @param {Object} res
     * @param {Object} schema
     * @param {Object} params
     */
    findOne: async function(schema, params) {
      let query = schema.findOne(params)
      await query.findOne((err, res) => {
        if (err) {
          return Promise.reject(error)
        } else {
          return Promise.resolve(res)
        }
      })
    }
  }
  let DateMethods = {
    format: function(date) {
      return moment(date, format, timezone).format(format)
    },
    isToday: function(date) {
      return moment(date, format, timezone).isSame(new Date(), 'day')
    },
    isPast: function(date) {
      return moment(date, format, timezone).isBefore(now)
    },
    isFuture: function(date) {
      return moment(date, format, timezone).isAfter(now)
    },
    isThisWeek: function(date) {
      return moment(date, format, timezone).isBetween(
        now.startOf('week'),
        now.endOf('week')
      )
    }
  }

  return {
    createError: createError,
    DateMethods: DateMethods,
    DatabaseMethods: DatabaseMethods
  }
}
