const express = require("express"),
      router = express.Router(),
      yelp = require("node-yelp"),
      config = require("../config");

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


module.exports = router;
