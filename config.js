module.exports = {
    consumerKey: process.env.YELP_CONSUMER_KEY,
    consumerSecret: process.env.YELP_CONSUMER_SECRET,
    token: process.env.YELP_TOKEN,
    tokenSecret: process.env.YELP_TOKEN_SECRET,

    port: process.env.PORT || 8080,
    sessionSecret: process.env.SESSION_SECRET || "cats",

    db: process.env.MONGOLAB_URI
}
