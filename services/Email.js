const mailer = require("nodemailer");
const config = require("../configs/config");

let transporter = mailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

class Email {
  constructor() {}

  sendVerificationOtp(email) {
    let code = Math.floor(100000 + Math.random() * 900000);

    let options = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Verification code for ${config.APP_NAME}`,
      text: `Your verification code for ${config.APP_NAME} is ${code}`,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(options, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(code);
        }
      });
    });
  }

  sendTransactionOtp(email) {
    let code = Math.floor(100000 + Math.random() * 900000);

    let options = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Transaction code for ${config.APP_NAME}`,
      text: `Transaction code for ${config.APP_NAME} is ${code}. Do not share it with anyone.`,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(options, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(code);
        }
      });
    });
  }
}

module.exports = Email;
