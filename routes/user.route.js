const { Router } = require("express");
const router = Router();

router.get("/profile", (req, res, next) => {
  const person = req.user;
  res.render("profile", { person });
});

module.exports = router;
