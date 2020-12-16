const { Router } = require("express");
const router = Router();
const User = require("../models/user.model");

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post("/login", (req, res, next) => {
  res.send("Hello from Login router POST");
});

router.post("/register", async (req, res, next) => {
  try {
    const { email } = req.body;
    const doesExist = await User.findOne({ email });
    if (doesExist) {
      res.redirect("/auth/register");
      return;
    }

    const newUser = new User(req.body);
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    next(error);
  }
});

router.get("/logout", (req, res, next) => {
  res.send("Hello from Logout router POST");
});

module.exports = router;
