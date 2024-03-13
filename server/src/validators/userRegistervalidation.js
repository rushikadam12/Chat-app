const { body } = require("express-validator");
const userRegistervalidation = () => {
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
      body("password")
          .trim()
          .notEmpty()
          .withMessage("password is required")
      
  ];
};

module.exports=userRegistervalidation