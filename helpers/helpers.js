const moment = require('moment-timezone')
const format = 'DD/MM/YYYY'
const timezone = 'Europe/London'

const now = moment.tz(timezone)
module.exports = () => {
  function checkSession(req, res) {
    let session = req.session
    if (!session.user) {
      createError(req, res, {
        code: 201,
        message: 'No session found, please login again'
      })
    }
  }
  function checkInput(req, res, params) {}

  function createError(req, res, err) {
    res
      .json({
        message: err['message'],
        code: !err['code'] ? 101 : err['code']
      })
      .end()
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

  /**
   *
   * @param {Object} config(from,to,email,pass,message,customHtml)
   */
  function sendEmail(config) {
    const nodeMailer = require('nodemailer')
    /**
     * 
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword'
  }
});

var mailOptions = {
  from: 'youremail@gmail.com',
  to: 'myfriend@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
    html: '<h1>Welcome</h1><p>That was easy!</p>'

};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
     */
  }
  return {
    createError: createError,
    checkInput: checkInput,
    checkSession: checkSession,
    DateMethods: DateMethods,
    sendEmail: sendEmail
  }
}
