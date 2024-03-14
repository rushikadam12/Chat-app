const express = require('express')
const router = express.Router()
const validator = require("../validators/validate.js");
const {userLogin}=require('../validators/userRegistervalidation.js')


router.route("/").get(userLogin(), validator,userLogin);

module.exports=router