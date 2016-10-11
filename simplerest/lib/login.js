"use strict";

const Twitter = require('node-twitter-api');
const secret = require('../twitter-api.js');

module.exports = function login(app) {
  let _requestSecret;
  let _requestToken;

  app.get('/start-login', (req, res) => {
    twitter.getRequestToken((err, requestToken, requestSecret) => {
      if (err) res.status(500).send(err);

      _requestSecret = requestSecret;
      _requestToken = requestToken;
      res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
    });
  });

  app.get('/confirm-login', (req, res) => {
    twitter.getAccessToken(_requestToken, _requestSecret, req.query.oauth_verifier, (err, accessToken, accessTokenSecret, results) => {
      if (err) {
        console.log(err);
      } else {
        twitter.verifyCredentials(accessToken, accessTokenSecret, {}, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            res.cookie('name', data.screen_name);
            res.redirect('/');
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
