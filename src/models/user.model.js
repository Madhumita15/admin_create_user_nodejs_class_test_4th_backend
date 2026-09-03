const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone is required"],
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },
    role: {
      type: String,
      default: "user",
    },
    createdBy: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true,
  },
);


userSchema.index({name: 1})
const userModel = mongoose.model("user", userSchema)
module.exports = userModel