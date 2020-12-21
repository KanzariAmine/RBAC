const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { InternalServerError } = require("http-errors");
const UserSchema = Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    console.log(this.isNew);
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(this.password, salt);
      this.password = hashPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw createHttpError.InternalServerError(error.message);
  }
};

const User = mongoose.model("users", UserSchema);
module.exports = User;
