const express = require("express"),
      app = express(),
      passport = require("passport"),
      LocalStrategy = require("passport-local").Strategy,
      morgan = require("morgan"),
      pug = require("pug"),
      bodyParser = require("body-parser"),
      session = require("express-session"),
      config = require("./config"),
      auth = require("./auth"),
      User = auth.user,
      db = require("./db"),
      routes = require("./routes/routes");

app.use(morgan("dev"));
app.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(routes);

app.listen(config.port);
