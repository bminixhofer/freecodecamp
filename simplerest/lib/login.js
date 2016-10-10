"use strict";

const Twitter = require("node-twitter-api");
const secret = require("../twitter-api.js");

module.exports = function(app) {
  let _requestSecret;
  let _requestToken;

  app.get("/start-login", function(req, res) {
    twitter.getRequestToken(function(err, requestToken, requestSecret) {
      if (err) res.status(500).send(err);

      _requestSecret = requestSecret;
      _requestToken = requestToken;
      res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
    });
  });

  app.get("/confirm-login", function(req, res) {
    twitter.getAccessToken(_requestToken, _requestSecret, req.query.oauth_verifier, function(err, accessToken, accessTokenSecret, results) {
      if (err) {
        console.log(err);
      } else {
        twitter.verifyCredentials(accessToken, accessTokenSecret, {}, function(err, data, response) {
          if (err) {
            console.log(err);
          } else {
            res.end(JSON.stringify(data));
          }
      });
      }
    });
  });
  const twitter = new Twitter({
    consumerKey: secret.consumerKey,
    consumerSecret: secret.consumerSecret,
    callback: 'http://127.0.0.1:8080/confirm-login'
  });
};
