const transporter = require("../config/mailConfig");
const nodemailer = require("nodemailer");
const Otp = require("../models/otp.model");

class SendEmail {
  static async verifyEmailOtp(req, user) {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const newOtp = await new Otp({
      userId: user._id,
      otp: otp,
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM, // sender address
        to: user.email, // list of recipients
        subject: "otp- verify your account", // subject line
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify Your Email</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        ">

          <div style="
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          ">

            <!-- Header -->
            <div style="
              background-color: #4f46e5;
              padding: 25px;
              text-align: center;
            ">
              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 24px;
              ">
                Verify Your Email
              </h1>
            </div>

            <!-- Content -->
            <div style="padding: 35px;">

              <h2 style="
                margin-top: 0;
                color: #222222;
              ">
                Hello ${user.name},
              </h2>

              <p style="
                font-size: 16px;
                line-height: 1.6;
              ">
                Thank you for creating an account with us.
                Please use the verification code below to verify your email address.
              </p>

              <!-- OTP -->
              <div style="
                margin: 30px 0;
                text-align: center;
              ">

                <p style="
                  margin-bottom: 10px;
                  color: #555555;
                  font-size: 15px;
                ">
                  Your Verification Code
                </p>

                <div style="
                  display: inline-block;
                  padding: 15px 30px;
                  background-color: #f3f4f6;
                  border: 1px solid #e5e7eb;
                  border-radius: 8px;
                  font-size: 30px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #4f46e5;
                ">
                  ${otp}
                </div>

              </div>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                color: #555555;
              ">
                This OTP is required to verify your account.
                Please do not share this code with anyone.
              </p>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                color: #555555;
              ">
                If you did not create this account, you can safely ignore this email.
              </p>

              <p style="
                margin-top: 30px;
                font-size: 15px;
              ">
                Thank you,<br />
                <strong>Admin Team</strong>
              </p>

            </div>

            <!-- Footer -->
            <div style="
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #888888;
              font-size: 12px;
            ">
              <p style="margin: 0;">
                This is an automated email. Please do not reply.
              </p>
            </div>

          </div>

        </body>
        </html>
      `, // HTML body
      });
      return otp;
    } catch (error) {
      throw error;
    }
  }


  static async sendEmailCredentials(user, temporaryPassword) {
    try {
      const loginUrl = `http://localhost:3007/login`;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Your Account Has Been Created - Login Credentials",

        html: `
      <!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Created</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      ">

        <div style="
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        ">

          <div style="
            background-color: #4f46e5;
            padding: 25px;
            text-align: center;
          ">
            <h1 style="
              color: #ffffff;
              margin: 0;
            ">
              Welcome to Our Platform
            </h1>
          </div>

          <div style="padding: 35px;">

            <h2>
              Hello ${user.name},
            </h2>

            <p style="
              font-size: 16px;
              line-height: 1.6;
            ">
              Your account has been created successfully by the administrator.
            </p>

            <p>
              Please use the following credentials to log in:
            </p>

            <div style="
              background-color: #f8f9fa;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
            ">

              <p>
                <strong>Email:</strong>
                ${user.email}
              </p>

              <p>
                <strong>Temporary Password:</strong>
                ${temporaryPassword}
              </p>

            </div>

            <div style="
              text-align: center;
              margin: 30px 0;
            ">

              <a
                href="${loginUrl}"
                style="
                  display: inline-block;
                  background-color: #4f46e5;
                  color: #ffffff;
                  padding: 12px 25px;
                  border-radius: 6px;
                  text-decoration: none;
                  font-weight: bold;
                "
              >
                Login to Your Account
              </a>

            </div>

            <p style="
              color: #555555;
              line-height: 1.6;
            ">
              For security purposes, please log in and
              <strong>change your temporary password immediately.</strong>
            </p>

            <p style="
              color: #555555;
              line-height: 1.6;
            ">
              If you did not expect this account to be created,
              please contact the administrator.
            </p>

            <p style="margin-top: 30px;">
              Thank you,<br>
              <strong>Admin Team</strong>
            </p>

          </div>

          <div style="
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #888888;
            font-size: 12px;
          ">
            This is an automated email. Please do not reply.
          </div>

        </div>

      </body>
      </html>
    `,
      });
    } catch (error) {
      throw error;
    }
  }
  static async sendPasswordResetMail(user, temporaryPassword) {
  const loginUrl = `${process.env.FRONTEND_URL}/login`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Your Password Has Been Reset",

    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      ">

        <div style="
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        ">

          <!-- Header -->
          <div style="
            background-color: #4f46e5;
            padding: 25px;
            text-align: center;
          ">
            <h1 style="
              margin: 0;
              color: #ffffff;
              font-size: 24px;
            ">
              Password Reset
            </h1>
          </div>

          <!-- Content -->
          <div style="padding: 35px;">

            <h2 style="
              margin-top: 0;
              color: #222222;
            ">
              Hello ${user.name},
            </h2>

            <p style="
              color: #555555;
              font-size: 16px;
              line-height: 1.6;
            ">
              Your account password has been reset by the administrator.
            </p>

            <p style="
              color: #555555;
              font-size: 16px;
              line-height: 1.6;
            ">
              A temporary password has been generated for your account.
              Please use the credentials below to log in.
            </p>

            <!-- Credentials -->
            <div style="
              background-color: #f8f9fa;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
            ">

              <p style="
                margin: 0 0 12px 0;
                color: #333333;
              ">
                <strong>Email:</strong> ${user.email}
              </p>

              <p style="
                margin: 0;
                color: #333333;
              ">
                <strong>Temporary Password:</strong>
                ${temporaryPassword}
              </p>

            </div>

            <!-- Login Button -->
            <div style="
              text-align: center;
              margin: 30px 0;
            ">

              <a
                href="${loginUrl}"
                style="
                  display: inline-block;
                  background-color: #4f46e5;
                  color: #ffffff;
                  padding: 13px 28px;
                  border-radius: 6px;
                  text-decoration: none;
                  font-weight: bold;
                "
              >
                Login to Your Account
              </a>

            </div>

            <!-- Security Notice -->
            <div style="
              background-color: #fff7ed;
              border-left: 4px solid #f97316;
              padding: 15px;
              margin-top: 25px;
            ">

              <p style="
                margin: 0;
                color: #7c2d12;
                font-size: 14px;
                line-height: 1.5;
              ">
                <strong>Security Notice:</strong><br>
                This is a temporary password. You will be required to
                change your password after logging in.
              </p>

            </div>

            <p style="
              color: #555555;
              font-size: 14px;
              line-height: 1.6;
              margin-top: 25px;
            ">
              If you did not request this password reset, please contact
              the administrator immediately.
            </p>

            <p style="
              color: #555555;
              margin-top: 30px;
            ">
              Thank you,<br>
              <strong>Admin Team</strong>
            </p>

          </div>

          <!-- Footer -->
          <div style="
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #888888;
            font-size: 12px;
          ">
            This is an automated email. Please do not reply.
          </div>

        </div>

      </body>
      </html>
    `,
  });
}
}

module.exports = SendEmail;
