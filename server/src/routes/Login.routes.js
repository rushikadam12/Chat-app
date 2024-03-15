const express = require("express");
const router = express.Router();
const validator = require("../validators/validate.js"); //for validation
const { userLogin } = require("../validators/userRegistervalidation.js");
const UserLogin = require("../controllers/Login.controller.js");

router.route("/").post(userLogin(), validator, UserLogin);
//1.user data will validate first
//2.validation middleware return error is any validation goes wrong
//3.at last our UserLogin function find user in DB and perform login functionality

module.exports = router;
