const { validationResult } = require("express-validator");
const ApiError = require("../utility/ApiError");
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractErrors = [];
  errors.array().map((err) => {
    extractErrors.push({ [err.path]: err.msg });  
  });
  // console.log(extractErrors)
  throw new ApiError(422, "data is invalid", JSON.stringify(extractErrors));
};
module.exports = validate;
