const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')
module.exports = {
  sign(obj) {
    const token = jwt.sign({ data: obj }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })
    return token
  },

  sendEmail: async function(emailContent) {
    if (!emailContent.hasOwnProperty('to')) {
      emailContent.to = process.env.DOCK_EMAIL_USERNAME
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
          return Promise.reject(err)
        } else {
          return Promise.resolve('Email successfully sent')
        }
      })
    })
  }
}
