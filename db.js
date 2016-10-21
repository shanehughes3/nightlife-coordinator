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
    // updates timestamp if user subdoc exists, passes on if not
    Bar.findOneAndUpdate(
	{ barID: barID,
	  "going.user": user},
	{ $set: { "going.$.date": Date.now() }},
	function(err, result) {
	    if (err) {
		cb(err);
	    } else if (result) {
		cb(null, result);
	    } else {
		insertGoing(user, barID, cb);
	    }
	});
}

function insertGoing (user, barID, cb) {
    // inserts new subdoc, as called from setGoing
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

exports.setNotGoing = function(user, barID, cb) {
    Bar.findOneAndUpdate(
	{ barID: barID },
	{ $pull: { going: { user: user }}},
	function(err, bar) {
	    if (err) {
		cb(err);
	    } else {
		cb(null, bar);
	    }
	});
}

exports.retrieveNumberGoing = function(barID, cb) {
    Bar.findOne(
	{ barID: barID },
	"going",
	function(err, results) {
	    if (err) {
		cb(err);
	    } else {
		if (results) {
		    var goingToday = results.going.filter(function(node) {
			return isToday(node.date);
		    });
		    cb(null, goingToday.length);
		} else {
		    // if bar is not yet in the collection
		    cb(null, 0);
		}
	    }
	});
}

exports.retrieveIsUserGoing = function(barID, user, cb) {
    Bar.findOne(
	{ barID: barID,
	  "going.user": user },
	"going.$",
	function(err, result) {
	    if (err) {
		cb(err);
	    } else if (result && isToday(result.going[0].date)) {
		cb(null, true);
	    } else {
		cb(null, false);
	    }
	});
}

function isToday(date) {
    // checks if same date, truncating time
    // for future upgrades - timezone-specific?
    var today = new Date(Date.now());
    return date.toDateString() == today.toDateString();
}
