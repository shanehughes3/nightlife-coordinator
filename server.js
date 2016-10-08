const express = require("express"),
      app = express(),
      morgan = require("morgan"),
      pug = require("pug"),
      config = require("./config"),
      routes = require("./routes/routes");

app.use(morgan("dev"));

app.use(express.static(__dirname + "/public"));
app.set("view engine", "pug");

app.use(routes);

app.listen(config.port);
