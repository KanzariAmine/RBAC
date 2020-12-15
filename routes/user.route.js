const { Router } = require("express");
const router = Router();

router.get("/profile", (req, res, next) => {
  res.render("profile");
});

module.exports = router;
