const jwt = require('jsonwebtoken')
const getters = require('./getters')
const User = require('./../models/User')
const nodeMailer = require('nodemailer')
const Request = require('./../models/Request')

module.exports = {
  genEmailContent(config) {
    let requestType = config.request_type
    let name = config.currentUser.user_name
    let startDate = config.dates.start
    let endDate = config.dates.end

    let requestString,
      base = `${name} is `
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
      if (!emailContent.to) {
        emailContent.to = process.env.defaultAdminEmail
      }
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
