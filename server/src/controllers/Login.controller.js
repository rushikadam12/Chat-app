const User = require("../models/user.model");
const ApiError = require("../utility/ApiError");
const asyncHandler = require("../utility/asyncHandler");
const ApiResponse = require("../utility/ApiResponse.js");

const UserLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(422, false, "pls enter your valid username & password");
  }
  return res.send({ msg: "ok" })
  // const isPassword = await User.isPasswordCorrect(password);
  // if (!isPassword) {
  //   throw new ApiError(401, false, "Invalid credentials");
  // }
  // console.log(isPassword)

  // const user = await User.findOne({ email }).select("-password -username");
  // if (!user) {
  //   throw new ApiError(422, false, "pls enter valid email");
  // }
  // console.log(user);
  // const token = await User.generateToken();
  // console.log(token);
  // if (token) {
  //  return res.send(new ApiResponse(201,"token:",token,true))
  // } else {
  //   throw new ApiError(422, false, "token generation problem");
  // }
});

module.exports = UserLogin;
