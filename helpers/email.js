const nodeMailer = require("nodemailer");
const Email = require("email-templates");
/**
 * Configuration
 * From (email),
 * To (email)
 * Reason (shift,change,reminder)
 * Text content (The actual content of the email (replace with parts such as content,name,date)),
 * Attachments (Link for all attachments already uploaded (maybe))
 * Company image (URL to display in the header)
 * Company colours (#HEX for colouring and headers)

 */
module.exports = {
  genEmail: ({
    from,
    to,
    reason,
    content,
    attachments,
    company_image,
    company_colour
  }) => {
    const email = new Email({
      message: {
        to,
        from,
        attachments
      }
    });
    email
      .send({
        template: "template",
        locals: {
          company_image,
          company_colour
        }
      })
      .then(response => {})
      .catch(error => {});
  },
  sendEmail: async emailContent => {
    if (!emailContent.hasOwnProperty("to")) {
      emailContent.to = process.env.DOCK_EMAIL_USERNAME;
    }
    nodeMailer.createTestAccount((err, account) => {
      let transporter = nodeMailer.createTransport({
        host: "smtp.googlemail.com", // Gmail Host
        port: 465, // Port
        secure: true, // this is true as port is 465
        auth: {
          user: process.env.DOCK_EMAIL_USERNAME, //Gmail username
          pass: process.env.DOCK_EMAIL_PASSWORD // Gmail password
        }
      });

      transporter.sendMail(emailContent, (err, info) => {
        if (err) {
          return Promise.reject(err);
        } else {
          return Promise.resolve("Email successfully sent");
        }
      });
    });
  }
};
