const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      yelp = require("node-yelp"),
      config = require("../config"),
      auth = require("../auth"),
      db = require("../db");

var client = yelp.createClient({
    oauth: {
	consumer_key: config.consumerKey,
	consumer_secret: config.consumerSecret,
	token: config.token,
	token_secret: config.tokenSecret
    }
});

router.get("/", function(req, res) {
    if (req.user) {
	res.render("index", {user: req.user.username});
    } else {
	res.render("index");
    }
});

router.get("/search", function(req, res) {
    client.search({
	term: "bar",
	location: req.query.location,
	limit: 15,
	offset: req.query.offset || 0
    }).then(function(data) {
	addGoingData(data, function(output) {
	    res.send(data);
	});
    }).catch(function(err) {
	console.log(err);
	// TODO
    });
});

function addGoingData(data, cb) {
    var requests = data.businesses.map(function(business, index) {
	return new Promise((resolve) => {
	    db.retrieveGoing(business.id, function(err, numberGoing) {
		if (err) {
		    console.log(err);
		    resolve();
		} else {
		    data.businesses[index].going = numberGoing;
		    resolve();
		}
	    });
	});
    });

    Promise.all(requests).then(() => {
	cb(data);
    });
}

router.post("/going", function(req, res) {
    if (req.user) {
	db.setGoing(req.user.username, req.body.yelpId, function(err, result) {
	    if (err) {
		sendDatabaseError(req, res);
	    } else {
		sendGoingSuccess(req, res, result.barID);
	    }
	});
    } else {
	sendErrorNotLoggedIn(req, res);
    }
});

router.post("/notgoing", function(req, res) {
    if (req.user) {
	db.setNotGoing(req.user.username, req.body.yelpId,
		       function(err, result) {
			   if (err) {
			       sendDatabaseError(req, res);
			   } else {
			       sendGoingSuccess(req, res, result.barID);
			   }
		       });
		     
    } else {
	sendErrorNotLoggedIn(req, res);
    }
});

function sendGoingSuccess(req, res, barID) {
    res.json({
	success: true,
	id: barID
    });
}

function sendDatabaseError(req, res) {
    res.json({
	success: false,
	error: "DatabaseError"
    });
}

function sendErrorNotLoggedIn(req, res) {
    res.json({
	success: false,
	error: "AuthenticationError"
    });
}

router.post("/login", passport.authenticate("local", {failWithError: true}),
	    loginSuccess, loginFailure);

function loginSuccess(req, res, next) {
    res.json({username: req.user.username});
}

function loginFailure(err, req, res, next) {
    if (err.name == "AuthenticationError") {
	res.json({error: "Invalid username or password"});
    } else {
	res.json({error: "An unknown error occurred"});
    }
}

router.post("/register", function(req, res) {
    auth.register(req, res, function(err, user) {
	if (err) {
	    res.send(err);
	} else {
	    res.json(user);
	}
    });
});

router.get("/logout", function(req, res) {
    req.logout();
    res.json({success: true});
});
	    
module.exports = router;
