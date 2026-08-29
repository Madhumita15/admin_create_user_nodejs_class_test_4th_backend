const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: "15m",
    default: Date.now(),
  },
});

const otpModel = mongoose.model("otp", otpSchema)
module.exports = otpModel
