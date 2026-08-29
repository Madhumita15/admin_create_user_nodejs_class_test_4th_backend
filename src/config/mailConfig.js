require('dotenv').config()
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter