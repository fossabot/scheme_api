// Mailer
const nodeMailer = require('nodemailer')
const jwt = require('jsonwebtoken')
// Models
const Request = require('../models/Request')
const User = require('./../models/User')

// Validation
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')

// Moment
const moment = require('moment-timezone')
const format = 'YYYY-MM-DD HH:mm'
const timezone = 'Europe/London'
const now = moment.tz(timezone)

module.exports = () => {
  function error(res, err) {
    res
      .json({
        success: false,
        message: err['message'],
        code: !err['code'] ? 101 : err['code']
      })
      .end()
  }
  function success(res, obj) {
    res
      .json({
        success: true,
        obj
      })
      .end()
  }

  let admin = {
    /**
     * Creates a notification and will send it to the adminss email address
     * @param {*} req
     * @param {*} config
     */
    createRequest: async function(req, res, config) {
      let header = req.header('Authorisation')
      let currentUser = jwt.decode(header, process.env.JWT_SECRET)
      // Change to the admins email once there is a valid one
      let defaultAdminEmail = process.env.DOCK_EMAIL_USERNAME
      let emailConfig = {
        from: currentUser['user_email'],
        to: defaultAdminEmail,
        text: `Request about ${req.header('shift_id')}`
      }
      let sendEmail = this.sendEmail

      // If they are not an admin
      if (
        Object.keys(config).length > 0 &&
        currentUser['user_employee_type'] != 1
      ) {
        let admin = await User.findOne({ employee_type: 1 })

        let sentEmail = await sendEmail(emailConfig)
        if (sentEmail['response']) {
          // Create request in DB
          let requestObj = new Request({
            is_approved: {
              admin: 0,
              employee: 1
            },
            request_type: config['request_type'],
            participants: {
              employee: currentUser['user_id'],
              admin: admin['_id']
            },
            shift_id: req.body.shift_id
          })
          try {
            let res = await requestObj.save()
            return res
          } catch (error) {
            return error
          }
        }

        /**
         * Things that want changed on a shift
         * Config:{
         * shift_type:,
         * start_datetime,
         * end_datetime,
         * }
         */

        // Create request to database from one user to another user with different reasons
        // Pickup shift, remove shift, add shift, create holiday
        // Set default Email account for admin to be CCD

        //Check that the request with the shift ID doesnt already exist in DB
        let isDuplicateRequest = await Request.findOne({
          shift_id: req.header('shift_id')
        })

        if (isDuplicateRequest) {
          // Create erorr
          error(res, {
            message: 'This request already exists, please create another one'
          })
        } else {
          // Sends an email to the admin with the params that they want to change NO DB Operations
          let sentEmail = await sendEmail(emailConfig)
          if (sentEmail['response']) {
            // Create request in DB
            let requestObj = new Request({
              is_approved: {
                admin: 0,
                employee: 1
              },
              request_type: config['request_type'],
              participants: {
                employee: currentUser['user_id'],
                admin: admin['_id']
              },
              shift_id: req.body.shift_id
            })
            try {
              let res = await requestObj.save()
              return res
            } catch (error) {
              return error
            }
          }
        }
        //If they are an admin
      } else if (currentUser['user_employee_type'] == 1) {
        let isDuplicateRequest = await Request.findOne({
          shift_id: req.body.shift_id
        })

        if (!isDuplicateRequest) {
          // Send an email about the shift to the employee
          let emailConfig = {
            from: defaultAdminEmail,
            to: currentUser['user_email'],
            text: `This is an email notifying you that your shift has changed`
          }

          let requestObj = new Request({
            is_approved: {
              admin: 1,
              employee: 1
            },
            shift_id: req.body.shift_id,
            request_type: config['request_type'],
            participants: {
              employee: currentUser['user_id'],
              admin: admin['_id']
            }
          })
          try {
            let res = await requestObj.save()
            await this.sendEmail(emailConfig)
            return res
          } catch (error) {
            return error
          }
        } else {
          error(res, { message: 'Request already exists' })
        }
      } else {
        error(res, {
          message: 'No config detected please try again later.'
        })
      }
    },
    /**
     * Sends an email to the desired user
     * @param {Object} req
     * @param {*} res
     * @param {*} emailContent
     */
    sendEmail: function(emailContent) {
      return new Promise((resolve, reject) => {
        nodeMailer.createTestAccount((err, account) => {
          let transporter = nodeMailer.createTransport({
            host: 'smtp.googlemail.com', // Gmail Host
            port: 465, // Port
            secure: true, // this is true as port is 465
            auth: {
              user: process.env.DOCK_EMAIL_USERNAME, //Gmail username
              pass: process.env.DOCK_EMAIL_PASSWORD // Gmail password
            }
          })

          transporter.sendMail(emailContent, (err, info) => {
            if (err) {
              reject(err)
            } else {
              resolve(info)
            }
          })
        })
      })
    }
  }
  let db = {
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
  let date = {
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
    error: error,
    date: date,
    db: db,
    success: success,
    admin: admin
  }
}
