const { Router } = require("express");
const router = Router();
const User = require("../models/user.model");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

router.get("/login", ensureNotAuthenticated, (req, res, next) => {
  res.render("login");
});

router.get("/register", ensureNotAuthenticated, (req, res, next) => {
  res.render("register");
});

router.post(
  "/login",
  ensureNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/user/profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.post(
  "/register",
  ensureNotAuthenticated,
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid Email")
      .normalizeEmail()
      .toLowerCase(),
    body("password")
      .trim()
      .isLength(2)
      .withMessage("Password length short, min 2 char required"),
    body("password2").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          req.flash("error", error.msg);
        });
        res.render("register", {
          email: req.body.email,
          messages: req.flash(),
        });
        return;
      }
      const { email } = req.body;
      const doesExist = await User.findOne({ email });
      if (doesExist) {
        res.redirect("/auth/register");
        return;
      }

      const newUser = new User(req.body);
      await newUser.save();
      req.flash(
        "success",
        `${newUser.email} register successfully, you can now login 👌  `
      );
      res.redirect("/auth/login");
    } catch (error) {
      next(error);
    }
  }
);

router.get("/logout", ensureAuthenticated, (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/login");
  }
}

function ensureNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("back");
  } else {
    next();
  }
}
