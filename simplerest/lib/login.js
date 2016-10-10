"use strict";

const Twitter = require("node-twitter-api");
const secret = include("secret");

module.exports = function(app) {
  var twitter = new Twitter({
    consumerKey: secret.twitter.consumerKey,
    consumerSecret: secret.twitter.consumerSecret,
    callback: secret.twitter.callbackUrl
  });

  var _requestSecret;

  app.get("/request-token", function(req, res) {
    twitter.getRequestToken(function(err, requestToken, requestSecret) {
      if (err)
        res.status(500).send(err);
      else {
        _requestSecret = requestSecret;
        res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
      }
    });
  });
};
