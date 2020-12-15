const { Router } = require("express");
const router = Router();

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post("/login", (req, res, next) => {
  res.send("Hello from Login router POST");
});

router.post("/register", (req, res, next) => {
  res.send("Hello from Register router POST");
});

router.get("/logout", (req, res, next) => {
  res.send("Hello from Logout router POST");
});

module.exports = router;
