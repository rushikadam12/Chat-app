const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

//pre function
userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  console.log(this.password)
});

//create User model
const User = mongoose.model("User", userModel);

module.exports = User;
