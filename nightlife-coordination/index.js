var express = require('express');
var Yelp = require('yelp');
var mongo = require('mongodb').MongoClient;
var yelp = new Yelp({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET,
});
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));

app.get('/getLastSearch', function(req, res) {
  res.end(JSON.stringify(req.cookies.lastSearch ? { query: req.cookies.lastSearch } : {}));
});

app.post('/goThere', function(req, res) {
  mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err) throw err;

    var visits = db.collection('visits');
    visits.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 86400 }, function() {
      visits.find({ id: req.body.id }).toArray(function(err, arr) {
        if(err) throw err;
        var visiting = true;

        if(arr.length > 0) {
          var index = arr[0].users.indexOf(req.body.user);
          if(index === -1) {
            arr[0].users.push(req.body.user);
          } else {
            visiting = false;
            arr[0].users.splice(index, 1);
          }
          visits.update( { id: req.body.id }, arr[0], function(err) {
            if(err) throw err;
            res.end();
          });
        } else {
          visits.insert( {
            "createdAt": new Date(),
            users: [ req.body.user ],
            id: req.body.id
          });
        }
        res.end( JSON.stringify({ visiting: visiting }));
      });
    });
  });
});

app.get('/search', function(req, res) {
  var loc = req.query.location;
  res.cookie('lastSearch', req.query.location);
  yelp.search({ term: "bar", location: loc }).then(function(data) {
    mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
      if(err) throw err;

      var mappedData = data.businesses.map(function(element) {
        return {
          visits: 0,
          id: element.id,
          name: element.name,
          address: element.location.display_address,
          image: element.image_url || "http://www.ansellpro.com/images/photos/food.jpg",
        }
      });

      var visits = db.collection('visits');
      visits.find().toArray(function(err, arr) {
        if(err) throw err;

        for(var i = 0; i < mappedData.length; i++) {
          for(var j = 0; j < arr.length; j++) {
            if(mappedData[i].id === arr[j].id) {
              mappedData[i].visits = arr[j].users.length;
            }
          }
        }

        res.end(JSON.stringify(mappedData));
      });
    });
  }).catch(function(err) {
    console.error(err);
  });
});

app.listen(8080);
console.log("Started..");
