const mongoose = require("mongoose"),
      Schema = mongoose.Schema,
      config = require("./config");

mongoose.Promise = global.Promise; // silence DeprecationWarning

const db = mongoose.connect(config.db);

var GoingSchema = new Schema({
    user: String,
    date: { type: Date, default: Date.now }
});

var BarSchema = new Schema({
    barID: String,
    going: [GoingSchema]
});

var Bar = mongoose.model("Bar", BarSchema);


exports.setGoing = function(user, barID, cb) {
    Bar.findOneAndUpdate(
	{ barID: barID },
	{ $push: { going: {user: user} } },
	{ upsert: true, new: true, setDefaultsOnInsert: true },
	function(err, result) {
	    if (err) {
		cb(err);
	    } else {
		cb(null, result);
	    }
	});
}

exports.retrieveGoing = function(barID, cb) {
    Bar.findOne(
	{ barID: barID },
	"going",
	function(err, results) {
	    if (err) {
		cb(err);
	    } else {
		if (results) {
		    var today = new Date(Date.now());
		    var goingToday = results.going.filter(function(node) {
			// checks if same date, truncating time
			// TODO - timezone?
			return node.date.toDateString() ==
			    today.toDateString();
		    });
		    cb(null, goingToday.length);
		} else {
		    // if bar is not yet in the collection
		    cb(null, 0);
		}
	    }
	});
}
