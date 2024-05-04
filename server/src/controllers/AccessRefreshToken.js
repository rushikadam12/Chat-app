require("dotenv").config();
const ApiError = require("../utility/ApiError");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utility/asyncHandler");
const User = require("../models/user.model");
const ApiResponse = require("../utility/ApiResponse");

const generateAccessAndRefreshToken = async (userId) => {
    
  try {
    const user = await User.findById(userId);

    const RefreshToken = await user.generateRefreshToken(user._id);
    const accessToken = await user.generateToken();

    if (!RefreshToken || !accessToken) {
      throw new ApiError(400, "Invalid request or token is invalid");
    }
      
    return { RefreshToken, accessToken };
  } catch (error) {
    throw new ApiError(404, false, "Invalid token access request", error);
  }
};

const AccessRefreshToken = asyncHandler(async (req, res) => {
    // console.log(req.cookies?.refreshToken);
  const InComingRefreshToken = req.cookies?.refreshToken;
    
  if (!InComingRefreshToken) {
    throw new ApiError(404, false, "token not found....");
  }
  try {
    const decoded = await jwt.verify(InComingRefreshToken, process.env.SEC_KEY);
    
    if (InComingRefreshToken !== req.cookies.refreshToken) {
      throw new ApiError(404,false,"Invalid token");
    }
    
    const user = await User.findById(decoded?._id);
    if (!user || !decoded) {
      throw new ApiError(404, false, "Invalid refresh token");
    }
    const options = {
      httpOnly: true,
      secure: true,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    };
    
    const { RefreshToken, accessToken } = await generateAccessAndRefreshToken(
      user._id
    );
    //   console.log(RefreshToken,accessToken)
      
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", RefreshToken, options)
      .json(new ApiResponse(200, "Access Token is refresh"));
  } catch (error) {
    throw new ApiError(
      500,
      false,
      error?.message || "Invalid token access",
      error
    );
  }
});

module.exports = AccessRefreshToken;
