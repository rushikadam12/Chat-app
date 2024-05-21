const { validationResult } = require("express-validator");
const ApiError = require("../utility/ApiError");
const errorHandler = require("../middleware/errorHandler");
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  throw new ApiError(422, false, "data is invalid", extractedErrors);
};
module.exports = validate;
