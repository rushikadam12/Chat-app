const ApiResponse = require("../utility/ApiResponse");
const asyncHandler = require("../utility/asyncHandler");

const Logout = asyncHandler(async (req,res) => {    

  return res
    .clearCookie("accessToken", { httpOnly: true })
    .clearCookie("connect.sid",{httpOnly:true})
    .json(new ApiResponse(200, "User logged out successfully"));
});
module.exports=Logout