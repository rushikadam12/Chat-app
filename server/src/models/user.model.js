require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
      lowercase: true,
    },

    avatar: {
      type: String,

      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_kSSoomJ9hiFXmiF2RdZlwx72Y23XsT6iwQ&usqp=CAU",
    },
  },
  { timestamps: true }
);

// Define pre-save hook to hash the password before saving
userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  console.log(this.password);
});

// Attach methods to the schema using "methods"
userModel.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// token generation method
userModel.methods.generateToken = async function () {
  return await jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    process.env.SEC_KEY,
    { expiresIn: process.env.EXPIRE }
  );
};

const User = mongoose.model("User", userModel);

module.exports = User;
