const User = require("../models/user.model");
const ApiError = require("../utility/ApiError");
const asyncHandler = require("../utility/asyncHandler");
const jwt = require("jsonwebtoken");
const verifyJWT = asyncHandler(async (req, res, next) => {
 try {
   const token =
     req.cookies?.accessToken ||
     req.header("Authorization")?.replace("Bearer", "");
   const RefreshToken =
     req.cookies?.refreshToken ||
     req.header("Authorization")?.replace("Bearer", "");
 
   if (!token) {
     throw new ApiError(400, false, "Unauthorized request");
   }
   // console.log(token);
   const decodeToken = await jwt.verify(token, process.env.SEC_KEY);
   const user = await User.findOne({ _id: decodeToken?._id }).select(
     "-password -refreshToken"
   );
 
   if (!user) {
     throw new ApiError(401, false,"Invalid access token");
   }
   req.user = user;
   next();
 } catch (error) {
    next( new ApiError(401, false,"Invalid access token",));
 }
});

module.exports = verifyJWT;
