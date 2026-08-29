const httpStatusCode = require("../utils/httpstatuscode");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

class AuthMiddleware {
  static async verifyToken(req, res, next) {
    try {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          status: false,
          message: "No token provided, please login",
        });
      }
      const decode = await jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET_KEY,
      );
      const user = await User.findById(decode.id);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          status: false,
          message: "User not found",
        });
      }
      req.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      next();
    } catch (error) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        status: false,
        message: "Invalid or expired token",
      });
    }
  }

  static roleCheck(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(httpStatusCode.FORBIDDEN).json({
          status: false,
          message: "Access Denied",
        });
      }
      next();
    };
  }
}
module.exports = AuthMiddleware;
