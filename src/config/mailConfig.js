require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  // // pool: true,
  // host: process.env.EMAIL_HOST,
  // port: process.env.EMAIL_PORT,
  // secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  // auth: {
  //   user: process.env.EMAIL_USER,
  //   pass: process.env.EMAIL_PASS,
  // },
  // pool: true,
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 150000,
});

module.exports = transporter;
