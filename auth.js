const passport = require("passport"),
      LocalStrategy = require("passport-local").Strategy,
      mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      passportLocalMongoose = require("passport-local-mongoose"),
      db = require("./db");

var UserSchema = new Schema({});
UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User", UserSchema);

exports.user = User;

exports.register = function(req, res, cb) {
    User.register(new User({
	username: req.body.username
    }), req.body.password, function(err, user) {
	if (err) {
	    console.log(err);
	    cb(err);
	} else {
	    cb(null, user.username);
	}
    });
}
