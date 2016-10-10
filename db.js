const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      config = require("./config");

mongoose.Promise = global.Promise; // silence DeprecationWarning

const db = mongoose.connect(config.db);
