const User = require("../models/user.model");
const ApiError = require("../utility/ApiError");
const ApiResponse = require("../utility/ApiResponse");
const asyncHandler = require("../utility/asyncHandler");

const handelLogin = asyncHandler(async (req, res) => {
  
  const user = await User.findById(req.user?._id); 
  if (!user) {
    throw new ApiError(404, "User not found");
  }
    const token =await user.generateToken();
    
    res.status(301).cookie("accessToken",token,{httpOnly:true}).json(new ApiResponse(200,"google login successfully",user))
  
});

module.exports=handelLogin