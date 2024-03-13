const ApiError = require("../utility/ApiError.js");
const User = require("../models/user.model.js");
const ApiResponse = require("../utility/ApiResponse.js");
const asyncHandler = require("../utility/asyncHandler.js");
const Register = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  const exitedUser = await User.findOne({
    $or:[{ username }, { email }],
  });
  if (exitedUser) {
    throw new ApiError(401, "Email or username already exist");
  }
  const createuser = await User.create({
    email,
    password,
    username,
  });
    const result = await createuser.save();
    console.log(result)
  if (result) {
    return res.send(new ApiResponse(200, "data added successfully", result)
    );
  }
});

module.exports = Register;
