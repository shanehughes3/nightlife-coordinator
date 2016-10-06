const express = require("express"),
      app = express(),
      yelp = require("node-yelp"),
      config = require("./config");

var client = yelp.createClient({
    oauth: {
	consumer_key: config.consumerKey,
	consumer_secret: config.consumerSecret,
	token: config.token,
	token_secret: config.tokenSecret
    }
});
    

app.get("/search", function(req, res) {
    client.search({
	term: "bar",
	location: req.query.location
    }).then(function(data) {
	res.send(data);
    }).catch(function(err) {
	console.log(err);
    });
});

app.listen(config.port);
