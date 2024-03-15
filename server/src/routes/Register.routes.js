const express = require("express");
const router = express.Router();
const Register = require("../controllers/Register.controller.js");
const validator = require("../validators/validate.js");
const { userRegister } = require("../validators/userRegistervalidation.js");//validations from express-validators

router.route("/").post(userRegister(), validator, Register);
//1.user data will validate first
//2.validation middleware return error is any validation goes wrong
//3.at last our Register function find user in DB and perform register functionality

module.exports = router;
