const router = require("express").Router();
const User = require("../models/user.model");
const mongoose = require("mongoose");
const { roles } = require("../utils/Constants");
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    //res.send(users);
    res.render("manageUser", { users });
  } catch (error) {
    next(error);
  }
});

router.get("/user/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid ID");
      res.redirect("/admin/users");
      return;
    }
    const person = await User.findById(id);
    res.render("profile", { person });
  } catch (error) {
    next(error);
  }
});

router.post("/update-role", async (req, res, next) => {
  try {
    // Checking for is and roles in req.body
    const { id, role } = req.body;
    if (!id || !role) {
      req.flash("error", "Invalid request");
      return res.redirect("back");
    }

    // Check for valid mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid ID");
      res.redirect("back");
      return;
    }
    // check for valid role
    const rolesArray = Object.values(roles);
    console.log("role", roles);
    console.log("rolesArray", rolesArray);
    console.log(rolesArray.includes(role));
    if (!rolesArray.includes(role)) {
      req.flash("error", "Invalid Role");
      res.redirect("back");
      return;
    }
    // Admin cannot remove himself/herself as admin
    if (req.user.id === id) {
      req.flash(
        "error",
        "Admins cannot remove themselves from admin, ask another admin!"
      );
      res.redirect("back");
      return;
    }

    // finally update the user
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );
    req.flash("info", `update role for ${user.email} to ${user.role}`);
    res.redirect("back");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
