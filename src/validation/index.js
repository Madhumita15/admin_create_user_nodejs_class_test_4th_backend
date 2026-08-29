const httpStatusCode = require("../utils/httpstatuscode");

class Validation {
  static validate(schema) {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          errors: error.details.map((err) => ({
            field: err.path.join(","),
            message: err.message,
          })),
        });
      }
      req.body = value;
      next();
    };
  }
}
module.exports = Validation;
