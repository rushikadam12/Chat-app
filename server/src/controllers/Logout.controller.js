const User = require("../models/user.model");
const ApiResponse = require("../utility/ApiResponse");
const asyncHandler = require("../utility/asyncHandler");

const Logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  return res
    .clearCookie("accessToken", { httpOnly: true })
    .clearCookie("refreshToken", { httpOnly: true })
    .clearCookie("connect.sid", { httpOnly: true })
    .json(new ApiResponse(200, "User logged out successfully"));
});
module.exports = Logout;
