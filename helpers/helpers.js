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

// Moment
const moment = require('moment-timezone')
const format = 'YYYY-MM-DD HH:mm'
const timezone = 'Europe/London'
const now = moment.tz(timezone).toISOString()

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
        ...obj
      })
      .end()
  }

  let getters = {
    isUserAdmin: function(user) {
      return user['user_employee_type'] == 1
    }
  }
  let admin = {
    genEmailContent(config) {
      let requestType = config.request_type
      let name = config.currentUser.user_name
      let startDate = config.dates.start
      let endDate = config.dates.end

      let requestString,
        base = `${name} is`
      dateString = `from ${startDate} to ${endDate}`
      switch (requestType) {
        case 1: {
          requestString = `${base}requesting a new shift ${dateString}`
          break
        }
        case 2: {
          requestString = `${base}requesting a new shift ${dateString}`
          break
        }
        case 3: {
          requestString = `${base}requesting a holiday ${dateString}`
          break
        }

        default: {
          break
        }
      }
      return requestString
    },

    decode: function(token) {
      return jwt.decode(token, process.env.JWT_SECRET)
    },

    createRequest: async function(req, res, config) {
      let currentUser = config.currentUser
      let defaultAdminEmail = process.env.DOCK_EMAIL_USERNAME
      let shiftID = req.body.shift_id ? req.body.shift_id : config.shift_id

      let emailConfig = {
        from: currentUser.user_email,
        to: defaultAdminEmail,
        text: this.genEmailContent(config)
      }
      let sendEmail = this.sendEmail
      let isUserAdmin = getters.isUserAdmin(currentUser)
      let requestType = config.request_type

      // If they are not an admin try and find an admin
      if (Object.keys(config).length > 0 && !isUserAdmin) {
        let admin = await User.find({ employee_type: 1 })

        let sentEmail = await sendEmail(emailConfig)
        if (sentEmail['response'] && admin) {
          // Create request in DB
          let requestBody = {
            is_approved: {
              admin: 0,
              employee: 1
            },
            request_type: config.request_type,
            participants: {
              employee: currentUser.user_id,
              admin: admin._id
            },
            shift_id: shiftID
          }

          let mongoRequestObj = new Request(requestBody)
          try {
            let res = await mongoRequestObj.save()
            return res
          } catch (error) {
            return error
          }
        } else {
          console.log('error bad')
        }

        let isDuplicateRequest = await Request.findOne({
          shift_id: shiftID
        })

        if (isDuplicateRequest) {
          // Create erorr
          error(res, {
            message: 'This request already exists, please create another one'
          })
          return
        } else {
          // Sends an email to the admin with the params that they want to change NO DB Operations
          let sentEmail = await sendEmail(emailConfig)
          if (sentEmail['response']) {
            // Create request in DB
            let mongoRequestObj = new Request({
              is_approved: {
                admin: 0,
                employee: 1
              },
              request_type: requestType,
              participants: {
                employee: currentUser.user_id,
                admin: admin._id
              },
              shift_id: shiftID
            })
            try {
              let res = await mongoRequestObj.save()
              return res
            } catch (error) {
              return error
            }
          }
        }
        //If they are an admin
      } else if (isUserAdmin) {
        let isDuplicateRequest = await Request.findOne({
          shift_id: shiftID
        })

        if (!isDuplicateRequest) {
          // Send an email about the shift to the employee
          let emailConfig = {
            from: defaultAdminEmail,
            to: currentUser['user_email'],
            text: `This is an email notifying you that your shift has changed`
          }

          let mongoRequestObj = new Request({
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
            let res = await mongoRequestObj.save()
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

  return {
    error: error,
    date: date,
    db: db,
    success: success,
    admin: admin,
    get: getters
  }
}
