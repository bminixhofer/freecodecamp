var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var path = require('path');

var app = express();
var mongo = require('mongodb').MongoClient;
var isProcessingRequest = false;

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  if(req.cookies.username && req.cookies.username !== "j:null") {
    res.redirect('/voting.html');
  } else {
    res.redirect('/index.html');
  }
});

app.use(express.static(__dirname + '/public'));

app.post('/loginUser', function(req, res) {
  mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err) throw err;

    var users = db.collection('users');
    users.find( {
      name: req.body.user.name,
      password: req.body.user.password
    }).toArray(function(err, matches) {
      if(err) throw err;

      res.cookie('username', req.body.user.name);

      if(matches.length > 0) {
        res.end(JSON.stringify( { error: "none" }));
      } else {
        res.end(JSON.stringify( { error: "Username or Password incorrect"}));
      }
      res.end();
    });
  });
});

app.get('/getUser', function(req, res) {
  res.end(JSON.stringify( { user: req.cookies.username }));
});

app.post('/addUser', function(req, res) {
  mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err) throw err;

    var username = req.body.user.name;
    var pw = req.body.user.password;
    var confirmPw = req.body.user.confirmPassword;

    var log = {
      error: "none"
    };

    var users = db.collection('users');

    users.find( { name: username } ).toArray(function(err, matches) {
      if(err) throw err;

      if(username == "" || pw == "" || confirmPw == "") {
        log.error =  "Please fill in all forms";
      } else if(matches.length > 0) {
        log.error = "Username is already taken";
      } else if(pw !== confirmPw) {
        log.error = "Passwords don't match";
      }

      if(log.error === "none") {
        users.insert( { name: username, password: pw }, function(err, data) {
          if(err) throw err;

          res.cookie('username', username);
          res.end(JSON.stringify(log));
        });
      } else {
        res.end(JSON.stringify(log));
      }
    });
  });
});

app.post('/vote', function(req, res) {
  mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err) throw err;

    var polls = db.collection('polls');
    polls.find( { token: req.body.token }).toArray(function(err, arr) {
      if(err) throw err;

      if(arr.length > 0) {
        var key = Object.keys(req.body)[0];
        var poll = arr[0];
        res.end(JSON.stringify( { name: poll[key].name }));
      } else {
        res.end();
      }
    });
  });
});

app.get('/logoutUser', function(req, res) {
  res.cookie('username', null);
  res.end();
});

app.post('/setPoll', function(req, res) {
  mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err) throw err;

    var polls = db.collection('polls');
    var poll = req.body.poll;
    delete poll._id;

    for(var k = 1; k <= poll.count; k++) {
      poll[k].votes = 0;
    }

    var keys = Object.keys(poll.voters);
    for(var i = 0; i < keys.length; i++) {
      for(var j = 1; j <= poll.count; j++) {
        if(poll.voters[keys[i]] == poll[j].name) {
          poll[j].votes++;
          break;
        }
      }
    }

    polls.update( { token: req.body.poll.token }, poll, {}, function(err) {
      if(err) throw err;

      polls.find( { token: req.body.poll.token }).toArray(function(err, arr) {
        if(err) throw err;
        res.end();
      });
    });
  });
});

app.post("/getPoll", function(req, res) {
  mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err) throw err;

    var polls = db.collection('polls');
    polls.find( { token: req.body.token }).toArray(function(err, data) {
      if(err) throw err;

      if(data.length > 0) {
        res.end(JSON.stringify(JSON.stringify(data[0])));
      } else {
        res.end(JSON.stringify( { error: "Poll not found."}));
      }
    });
  });
});

app.get("/poll/:token", function(req, res) {
  mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err) throw err;

    var polls = db.collection('polls');
    polls.find( { token: req.params.token } ).toArray(function(err, arr) {
      if(err) throw err;

      if(arr.length == 0) {
        res.redirect('/voting.html');
      } else {
        res.sendFile(path.join(__dirname, '/public', 'poll.html'));
      }
    });
  });
});

app.get('/getAllPolls', function(req, res) {
  mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err) throw err;

    var polls = db.collection('polls');
    polls.find().toArray(function(err, arr) {
      if(err) throw err;

      res.end(JSON.stringify(arr.map(function(element) {
        return {
          question: element.question,
          link: "/poll/" + element.token
        };
      })));
    });
  });
});

app.post('/deletePoll', function(req, res) {
  mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err) throw err;

    var polls = db.collection('polls');
    polls.find( { token: req.body.token} ).toArray(function(err, arr) {
      if(err) throw err;

      if(arr[0].author === req.cookies.username) {
        polls.remove( { token: req.body.token }, { justOne: false }, function(err) {
          if(err) throw err;

          res.end();
        });
      } else {
        res.end();
      }
    });
  });
});

app.post('/addPoll', function(req, res) {
  mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err) throw err;
    var polls = db.collection('polls');

    if(req.cookies.username) {
      var gen = new TokenGenerator();
      gen.run(polls, function(data) {
          var poll = req.body.poll;
          poll.token = data;
          for(var i = 1; i <= poll.count; i++) {
            poll["" + i].votes = 0;
          }
          poll.author = req.cookies.username;
          poll.voters = {};
          polls.insert(poll, function(err, data) {
            if(err) throw err;
            res.end(JSON.stringify( { error: "none", token: poll.token }));
          });
      });
    } else {
      res.end(JSON.stringify( { error: "You are not logged in."}));
    }
  });
});

function TokenGenerator() {
  this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var _this = this;

  this.run = function(col, callback) {
    var _token = [];
    for(var i = 0; i < 6; i++) {
      _token.push(_this.chars[Math.floor(Math.random() * _this.chars.length)]);
    }
    _token = _token.join('');

    col.find( { token: _token } ).toArray(function(err, data) {
      if(err) throw err;

      if(data.length == 0) {
        callback(_token);
      } else {
        return _this.generate(col);
      }
    });
  }
}

app.listen(process.env.PORT || 8080);
console.log("Started..");
