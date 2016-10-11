const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      yelp = require("node-yelp"),
      config = require("../config"),
      auth = require("../auth");

var client = yelp.createClient({
    oauth: {
	consumer_key: config.consumerKey,
	consumer_secret: config.consumerSecret,
	token: config.token,
	token_secret: config.tokenSecret
    }
});

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/search", function(req, res) {
    client.search({
	term: "bar",
	location: req.query.location,
	limit: 15,
	offset: req.query.offset || 0
    }).then(function(data) {
	res.send(data);
    }).catch(function(err) {
	console.log(err);
    });
});

router.post("/login", passport.authenticate("local", {failWithError: false}),
	    loginSuccess, loginFailure);

function loginSuccess(req, res, next) {
    res.send("success");
}

function loginFailure(req, res, next) {
    if (err.name == "AuthenticationError") {
	res.send("Invalid username or password");
    } else {
	res.send("Unknown error");
    }
}

router.post("/register", function(req, res) {
    auth.register(req, res, function(err, user) {
	res.json(user);
    });
});
	    
module.exports = router;
