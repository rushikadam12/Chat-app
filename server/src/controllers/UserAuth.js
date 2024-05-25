const ApiResponse = require("../utility/ApiResponse");
const User = require("../models/user.model");
const asyncHandler = require("../utility/asyncHandler");

const userAuth = asyncHandler(async (req, res) => {
  const loggedUser = await User.findById(req.user?._id).select(
    "-refreshToken -password -updatedAt"
  );
    
  return res
    .status(200)
    .send(
      new ApiResponse(
        201,
        "user is authorized",
        { auth: true, loggedUser },
        true
      )
    );
});
module.exports = userAuth;
