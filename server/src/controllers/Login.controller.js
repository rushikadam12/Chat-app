require('dotenv').config()
const User = require("../models/user.model");
const ApiError = require("../utility/ApiError");
const asyncHandler = require("../utility/asyncHandler");
const ApiResponse = require("../utility/ApiResponse.js");

const UserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    throw new ApiError(422, false, "pls enter your valid username & password");
  }
  const user = await User.findOne({ email });//find User in database
  if (!user) {
    throw new ApiError(422, false, "pls enter valid email");
  }

  const isPasswordValid = await user.isPasswordCorrect(password); //compare user password and hashed password
  if (!isPasswordValid) {
    throw new ApiError(401, false, "Invalid credentials");
  }
  
  const token = await user.generateToken();//generate the token for verification
  
  const loggedUser = await User.findOne({ _id: user._id }).select("-password");

  if (token) {
    return res
      .cookie("accessToken", token, {
        //set cookies
        httpOnly: true,
        strict: true,
        expiresIn: process.env.EXPIRE,
      })
      .json(new ApiResponse(200, "user logged in successfully", loggedUser));
  } else {
    throw new ApiError(422, false, "token generation problem");
  }
});



module.exports = UserLogin;
