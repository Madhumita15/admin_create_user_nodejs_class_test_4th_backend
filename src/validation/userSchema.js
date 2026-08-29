const Joi = require("joi");

class UserSchemaValidation {
  static register = Joi.object({
    name: Joi.string().trim().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),
    email: Joi.string().trim().email().required().messages({
      "string.email": "Please enter valid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
    // password: Joi.string().trim().min(6).max(15).required().messages({
    //   "string.empty": "Password is required",
    //   "string.min": "Password must be atleast 6 character",
    //   "string.max": "Password cannot exceed 15 character",
    //   "any.required": "Password is required",
    // }),
    phone: Joi.string().trim().pattern(/^[6-9]\d{9}$/).required().messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Phone number must be a valid 10-digit mobile number",
        "any.required": "Phone number is required"
    })

  });


  static login = Joi.object({
    email: Joi.string().trim().email().required().messages({
        "string.empty": "Email is required",
        "any.required": "Email is required"
    }),
    password: Joi.string().trim().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required"
    })
  })


  static otpVerify = Joi.object({
    email: Joi.string().trim().email().required().messages({
        "string.email": "Please enter valid email",
        "string.empty": "Email is required",
        "any.required": "Email is required"
    }),
    otp: Joi.string().trim().min(4).max(4).required().messages({
        "string.min": "otp must be 4 digits",
        "string.max": "otp must be 4 digits",
        "string.empty": "otp is required",
        "any.required": "otp is required"
    })
  })
}
module.exports = UserSchemaValidation;
