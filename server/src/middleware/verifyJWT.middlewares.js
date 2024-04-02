const User = require("../models/user.model");
const ApiError = require("../utility/ApiError");
const asyncHandler = require("../utility/asyncHandler");
const jwt = require("jsonwebtoken");
const verifyJWT = asyncHandler(async (req, res, next) => {
  
  const token = req.cookies?.accessToken;
  
  if (!token) {
    throw new ApiError(400, false, "Unauthorized request");
  }
  // console.log(token);
  const decodeToken = await jwt.verify(token, process.env.SEC_KEY);
    const user = await User.findOne({ _id:decodeToken._id }).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }
  req.user = user;
  next();
});

module.exports = verifyJWT;
