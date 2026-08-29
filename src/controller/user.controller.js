const User = require("../models/user.model");
const httpStatusCode = require("../utils/httpstatuscode");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendMail");
const Otp = require("../models/otp.model");
const crypto = require("crypto");

const generateRandomPassword = () => {
  return crypto.randomBytes(9).toString("base64url") + "@1";
};

class UserController {
  async createUser(req, res) {
    try {
      const { name, email, phone } = req.body;

      const existingEmail = await User.findOne({ email: email });
      if (existingEmail) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "User already exist",
        });
      }

      const temporaryPassword = await generateRandomPassword();

      const salt = 10;
      const hashPassword = await bcryptjs.hash(temporaryPassword, salt);

      const newUser = new User({
        name: name,
        email: email,
        password: hashPassword,
        phone: phone,
      });

      const user = await newUser.save();
      await sendEmail.sendEmailCredentials(user, temporaryPassword);

      return res.status(httpStatusCode.CREATED).json({
        status: true,
        message: "User created and verify account successfully!",
        data: user,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }

      if (user.status === "InActive") {
        return res.status(httpStatusCode.FORBIDDEN).json({
          status: false,
          message:
            "Your account is block by the admin, contact with administrator",
        });
      }
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "Invalid credentials",
        });
      }

      const refreshToken = await jwt.sign(
        {
          role: user.role,
          id: user._id,
        },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: "7d" },
      );

      const accessToken = await jwt.sign(
        {
          role: user.role,
          id: user._id,
        },
        process.env.JWT_ACCESS_SECRET_KEY,
        { expiresIn: "15m" },
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      return res.status(httpStatusCode.OK).json({
        status: true,
        message: "Successfully login!",
        accessToken: accessToken,
        refreshToken: refreshToken,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isFirstLogin: user.isFirstLogin,
        },
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const { name } = req.query;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const skip = (page - 1) * limit;
      let query = {
        role: { $ne: "admin" },
      };
      if (name) {
        query.name = { $regex: name, $options: "i" };
      }

      const data = await User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
        const totalUsers = await User.countDocuments(query)
     
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: data.length ? "All users get suucessfully!" : "User not found",
          data: data,
          totalUsers: totalUsers,
          currentPage: page,
          totalPages: Math.ceil(totalUsers/limit)
        });
      
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

 async getUserStats(req, res){
  try {
    const totalUsers = await User.countDocuments({role: {$ne: "admin"}})
    const totalActiveUsers = await User.countDocuments({role: {$ne: "admin"}, status: "Active"})
    const totalInActiveUsers = await User.countDocuments({role: {$ne: "admin"}, status: "InActive"})

    return res.status(httpStatusCode.OK).json({
      status: true,
      message: "All stats gets successfully!",
      totalUsers: totalUsers,
      totalActiveUsers: totalActiveUsers,
      totalInActiveUsers: totalInActiveUsers
    })
    
  } catch (error) {
    return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    
  }

 }

  async getSingleUser(req, res) {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "user gets successfully!",
          data: user,
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          status: false,
          message: "Refresh token missing",
        });
      }

      const decode = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY,
      );
      const user = await User.findById(decode.id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }

      const accessToken = await jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_ACCESS_SECRET_KEY,
        { expiresIn: "15m" },
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      return res.json({
        status: true,
        message: "Access token refreshed",
      });
    } catch (error) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        status: false,
        message: "Refresh token expired",
      });
    }
  }

  async changeStatus(req, res) {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const user = await User.findByIdAndUpdate(
        id,
        { status: status },
        { new: true },
      );
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
          data: null,
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "User update status successfully!",
          data: user,
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const id = req.params.id;
      const temporaryPassword = generateRandomPassword();
      const salt = 10;
      const hashPassword = await bcryptjs.hash(temporaryPassword, salt);
      const user = await User.findByIdAndUpdate(
        id,
        { password: hashPassword, isFirstLogin: true },
        { new: true },
      );
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      } else {
        await sendEmail.sendPasswordResetMail(user, temporaryPassword);
        return res.status(httpStatusCode.OK).json({
          status: true,
          message:
            "Password reset successfully and credentials send to your email",
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { name, email, phone } = req.body;
      const id = req.params.id || req.user._id;
      const user = await User.findByIdAndUpdate(
        id,
        { name, email, phone },
        { new: true },
      );
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
          data: null,
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "user updated successfully!",
          data: user,
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }
  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "User deleted  suuccessfully!",
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async updatePassword(req, res) {
    try {
      const { curPassword, newPassword } = req.body;
      const id = req.user._id;

      const user = await User.findById(id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "user not found",
        });
      }

      const isMatch = await bcryptjs.compare(curPassword, user.password);
      if (!isMatch) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "Current Password is not matching",
        });
      }
      const hashPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashPassword;

      if (user.isFirstLogin) {
        user.isFirstLogin = false;
      }

      await user.save();
      return res.status(httpStatusCode.OK).json({
        status: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async getProfile(req, res) {
    try {
      const id = req.user._id;
      const user = await User.findById(id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "user not found",
          data: null,
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "User gets profile successfully",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: user.status,
            role: user.role,
            isFirstLogin: user.isFirstLogin,
          },
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const { name, email, phone } = req.body;
      const id = req.user._id;
      const user = await User.findByIdAndUpdate(
        id,
        { name, email, phone },
        { new: true },
      );
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
          data: null,
        });
      } else {
        return res.status(httpStatusCode.OK).json({
          status: true,
          message: "user updated successfully!",
          data: user,
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
      });
      return res.status(httpStatusCode.OK).json({
        status: true,
        message: "Logout successfully!",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }
}
module.exports = new UserController();
