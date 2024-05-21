const express = require("express");
const router = express.Router();
const passport = require("passport");
const handelLogin = require("../controllers/handelUserlogin.controller");
const ApiResponse = require("../utility/ApiResponse");

// sso routes
router.route("/login/success").get(async (req, res) => {
  console.log(req.user)
  if (req.user) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Google login successful",
          { user: req.user },
          true
        )
      );
  } else {
    res
      .status(401)
      .json(new ApiResponse(401, "User not authenticated", null, false));
  }
});

router
  .route("/google")
  .get(
    passport.authenticate("google", { scope: ["profile", "email"] }),
    (req, res) => {
      console.log(res.user);
      res.send("redirecting user.....");
    }
  );

router.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  handelLogin
);
module.exports = router;
