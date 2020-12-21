const { Router } = require("express");
const router = Router();
const User = require("../models/user.model");
const { body, validationResult } = require("express-validator");

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post("/login", (req, res, next) => {
  res.send("Hello from Login router POST");
});

router.post(
  "/register",
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

router.get("/logout", (req, res, next) => {
  res.send("Hello from Logout router POST");
});

module.exports = router;
