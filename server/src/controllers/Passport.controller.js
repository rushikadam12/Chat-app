const passport = require("passport");
const User = require("../models/user.model");
const ApiError = require("../utility/ApiError");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

try {
  passport.serializeUser((user, next) => {
    next(null, user._id);
  });

  passport.deserializeUser(async (id, next) => {
    try {
      const user = await User.findById({ _id: id });

      if (user) next(null, user);
      else next(new ApiError(404, false, "User not found in database"), null);
    } catch (error) {
      next(
        new ApiError(
          500,
          false,
          "Something went wrong while deserializing the user. Error: " + error
        ),
        null
      );
    }
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5121/api/v1/passport/google/callback",
      },
      async (_, __, profile, next) => {
        const user = await User.findOne({ email: profile._json.email });

        if (!user) {
          const createUser = await User.create({
            email: profile._json.email,
            password: profile._json.sub,
            username: profile._json.email?.split("@")[0],
            avatar: profile._json.picture,
          });

          if (createUser) {
            next(null, createUser);
          } else {
            next(new ApiError(500, "Error while registering the user"), null);
          }
        } else {
          next(null, user);
        }
      }
    )
  );
} catch (error) {
  console.log("PASSPORT ERROR:");
}

module.exports = passport;
