const express = require("express");
const router = express.Router();
const passport = require("passport");
const handelLogin = require("../controllers/handelUserlogin.controller");

// sso routes
router
  .route("/google")
  .get(
    passport.authenticate("google", { scope: ["profile", "email"] }),
    (req, res) => {
      res.send("redirecting user.....");
    }
  );

router
  .route("/google/callback")
  .get(passport.authenticate("google"), handelLogin);
module.exports = router;
