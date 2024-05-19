const User = require("../models/user.model");
const ApiError = require("../utility/ApiError");
const ApiResponse = require("../utility/ApiResponse");
const asyncHandler = require("../utility/asyncHandler");

const handelLogin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const token = await user.generateToken();
  const refreshToken = await user.generateRefreshToken();
  res
    .status(201)
    .cookie("accessToken", token, { httpOnly: true, secure: false })
    .cookie("refreshToken",refreshToken,{httpOnly:true,secure:false})
    .redirect("http://localhost:5173/");;
});

module.exports = handelLogin;
