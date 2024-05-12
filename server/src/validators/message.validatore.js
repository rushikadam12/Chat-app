const { body } = require("express-validator");

const sendMessageValidator = () => {
  return [
    body("content")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("content is required"),
  ];
};

module.exports = sendMessageValidator;
