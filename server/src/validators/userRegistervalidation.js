
const { body } = require("express-validator");
const userRegister = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Pls enter valid email"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Pls enter your name")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 character"),
    body("password").trim().notEmpty().withMessage("password is required"),
  ];
};

const userLogin = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("pls enter your Email ID")
      .isEmail()
      .withMessage("pls enter your valid email"),
    body("password").trim().notEmpty().withMessage("pls enter your password"),
  ];
};

module.exports = { userRegister, userLogin };
