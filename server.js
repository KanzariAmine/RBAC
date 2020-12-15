const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/", require("./routes/index.route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/user", require("./routes/user.route"));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.render("error", { error });
});

const PORT = process.env.PORT || 8585;
const URI = process.env.MONGO_URI;
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("💾 connected...");
    app.listen(PORT, () => console.log(`🚀 on port${PORT}`));
  })
  .catch((error) => console.error(error.message));
