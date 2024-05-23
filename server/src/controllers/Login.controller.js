require("dotenv").config();
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
  const user = await User.findOne({ email }); //find User in database
  if (!user) {
    throw new ApiError(422, false, "pls enter valid email");
  }

  const isPasswordValid = await user.isPasswordCorrect(password); //compare user password and hashed password
  if (!isPasswordValid) {
    throw new ApiError(401, false, "Invalid credentials");
  }

  const token = await user.generateToken(); //generate the token for verification
  const RefreshToken = await user.generateRefreshToken(user._id); //refresh Token
  console.log("accessToken:", token);
  console.log("refreshToken:", RefreshToken);
  user.refreshToken = RefreshToken;
  await user.save({ validateBeforeSave: false }); //this parameter stop validation before saving
  const loggedUser = await User.findOne({ _id: user._id }).select("-password");
  const options = {
    httpOnly: true,
    secure: false,
    expiresIn: process.env.EXPIRE,
  };
  if (token && RefreshToken) {
    console.log(loggedUser)
    return res
      .cookie(
        //set cookie
        "accessToken",
        token,
        options
      )
      .cookie("refreshToken", RefreshToken, options) //refreshToken
      .json(new ApiResponse(200, "user logged in successfully", loggedUser));
  } else {
    throw new ApiError(422, false, "token generation problem");
  }
});

module.exports = UserLogin;
