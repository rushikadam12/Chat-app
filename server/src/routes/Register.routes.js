const express = require("express");
const router = express.Router();
const Register = require("../controllers/Register.controller.js");
const validator = require("../validators/validate.js");
const userRegistervalidation = require("../validators/userRegistervalidation.js"); //validations from express-validators

router.route("/").get(userRegistervalidation(), validator, Register);

module.exports = router;
