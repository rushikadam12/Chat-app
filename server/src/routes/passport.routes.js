const express = require("express");
const router = express.Router();
const passport = require("passport");
const handelLogin = require("../controllers/handelUserlogin.controller");
const ApiResponse = require("../utility/ApiResponse");

// sso routes

router.get("/login/success", async (req, res) => {

  if (req.user) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "google login successful",
          { user: req.user },
          true
        )
      );
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
    failureRedirect: "http://localhost:5173/login/failure",
  }),
  handelLogin
);
module.exports = router;
