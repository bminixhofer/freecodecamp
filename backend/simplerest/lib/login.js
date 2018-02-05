'use strict';

const Twitter = require('node-twitter-api');
const twitter = new Twitter({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callback: 'http://fcc-simplerest.herokuapp.com/confirm-login'
});

module.exports = function login(app) {
  let _requestSecret;
  let _requestToken;

  app.get('/start-login', (req, res) => {
    twitter.getRequestToken((err, requestToken, requestSecret) => {
      if (err) {
        console.log('Error getting request token.');
        res.status(500).send(err);
      } else {
        _requestSecret = requestSecret;
        _requestToken = requestToken;
        res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
      }
    });
  });

  app.get('/confirm-login', (req, res) => {
    console.log('confirming');
    twitter.getAccessToken(_requestToken, _requestSecret, req.query.oauth_verifier, (err, accessToken, accessTokenSecret, results) => {
      if (err) {
        console.log('Error getting access token.');
        res.status(500).send(err);
      } else {
        twitter.verifyCredentials(accessToken, accessTokenSecret, {}, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            res.cookie('name', data.screen_name);
            res.redirect('/entries');
          }
        });
      }
    });
  });
};
