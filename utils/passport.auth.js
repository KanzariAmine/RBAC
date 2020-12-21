const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.model");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        // Username/email does NOT exist
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { messages: "Username/Email not register" });
        }
        // Email exist and now we need to verify the password
        const isMatch = await user.isValidPassword(password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { messages: "Incorrect Email or Password" });
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
