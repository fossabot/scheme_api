// Mailer
const nodeMailer = require('nodemailer')

// Tokens
const jwt = require('jsonwebtoken')

// Models
const Request = require('../models/Request')
const User = require('./../models/User')

// Validation
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')

module.exports = {
  genHash: async function(string) {
    let salt = await bcrypt.genSalt(10)
    let hash = await bcrypt.hash(string, salt)
    return hash
  },

  compareHash: async function(initString, stringToCompare) {
    let isSame = await bcrypt.compare(initString, stringToCompare)
    return isSame
  },

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
        const { error, value } = validations.createHoliday.validate(toValidate)
        return error ? error : value
      }
    }
  }
}
