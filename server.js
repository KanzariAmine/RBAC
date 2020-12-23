const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const connectFlash = require("connect-flash");
const passport = require("passport");
const connectMongo = require("connect-mongo");
const connectEnsureLogin = require("connect-ensure-login");

//Initialization
const app = express();
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MongoStore = connectMongo(session);

// Init Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      //secure: true for https only
      httpOnly: true,
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//For passport JS Auth
app.use(passport.initialize());
app.use(passport.session());
require("./utils/passport.auth");

//After Auth send user to template engine
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

//Flash Messages
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

//Routers
app.use("/", require("./routes/index.route"));
app.use("/auth", require("./routes/auth.route"));
app.use(
  "/user",
  connectEnsureLogin.ensureLoggedIn({ redirectTo: "/auth/login" }),
  require("./routes/user.route")
);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.render("error", { error });
});

//Start Server and DB Connect
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
    app.listen(PORT, () => console.log(`🚀 @ http://loclahost:${PORT}`));
  })
  .catch((error) => console.error(error.message));

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     console.log("hello");
//     next();
//   } else {
//     res.redirect("/auth/login");
//   }
// }
