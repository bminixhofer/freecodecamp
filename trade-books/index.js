'use strict';

var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var request = require('request');
var Mark = require('markup-js');
var fs = require('fs');


app.use(session({
  secret: 'tree',
  resave: true,
  saveUninitialized: true,
  unset: 'destroy'
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  if(req.url === '/') {
    res.redirect('/all');
  }
  next();
});

app.post('/loginUser', function(req, res) {
  var email = req.body.email;
  var username = req.body.name;

  if(email && username) {
    res.cookie('email', email);
    res.cookie('username', username);
  }
  res.end();
});

app.get('/logoutUser', function(req, res) {
  res.clearCookie('email');
  res.clearCookie('username');
  res.end();
});

app.post('/addBook', function(req, res) {
  console.log(req.body);
  mongo.connect(process.env.MONGODB_URI, function(err, db) {
    if(req.body.book) {
      request('https://www.googleapis.com/books/v1/volumes?q=' + req.body.book, function(err, response, body) {
        if(response.statusCode !== 200 || err) throw err;

        var data = JSON.parse(body);
        if(data.totalItems === 0) {
          res.end(JSON.stringify({error: "Couldn't find any books with that title"}));
        }
        data = data.items[0];

        var mappedData = {
          owner: req.cookies['email'],
          title: data.volumeInfo.title,
          cover: data.volumeInfo.imageLinks.thumbnail,
          id: data.id
        };
        db.collection('books').insert(mappedData, function(err) {
          if(err) throw err;
          res.end(JSON.stringify(mappedData));
        });
      });
    }
  })
});

app.post('/addTrade', function(req, res) {
  var sess = req.session;
  sess.requested = sess.requested || req.body.requested;
  sess.offered = sess.offered || req.body.offered;

  var offered = sess.offered;
  var requested = sess.requested;

  console.log(requested);

  if(offered && requested) {
    mongo.connect(process.env.MONGODB_URI, function(err, db) {
      if(err) throw err;

      var trades = db.collection('trades');
      trades.insert({
        offered: offered,
        requested: requested
      }, function(err) {
        if(err) throw err;

        req.session.destroy(function(err) {
          if(err) throw err;

          res.end(JSON.stringify({ status: 'done'}));
        })
      });
    });
  } else {
    res.end(JSON.stringify({ status: 'waiting', waitingFor: offered ? 'all' : 'my' }));
  }
});

app.get('/trades', function(req, res) {
  var email = req.cookies['email'];

  if(!email) {
    res.redirect('/all');
  } else {
    mongo.connect(process.env.MONGODB_URI, function(err, db) {
      if(err) throw err;

        fs.readFile(__dirname + '/pages/trades.html', 'utf8', function(err, file) {
        if(err) throw err;

        var trades = db.collection('trades');
        trades.find( { $or: [ { receiver: email }, { requester: email } ] }).toArray(function(err, trades) {
          if(err) throw err;

          fs.readFile(__dirname + '/pages/header_auth.html', 'utf8', function(err, content) {
            if(err) throw err;

            res.send(Mark.up(file, {
              title: 'Trade Books | My Trades',
              header: Mark.up(content, {
                user: req.cookies.username,
                active: 'trades'
              })
            }));
          });
        });
      });
    });
  }
});

app.get('/all', function(req, res) {
  getBooks(null, function(books) {
    fs.readFile(__dirname + '/pages/index.html', 'utf8', function(err, file) {
      if(err) throw err;

      var header = req.cookies['email'] ? 'header_auth' : 'header_noauth';

      fs.readFile(__dirname + '/pages/' + header + '.html', 'utf8', function(err, content) {
        if(err) throw err;

        res.send(Mark.up(file, { //load books
          books: books,
          addsTrade: req.query.add,
          title: 'Trade Books | All Books',
          header: Mark.up(content, {
            user: req.cookies.username,
            active: 'all'
          })
        }));
      });
    });
  });
});

app.get('/my', function(req, res) {
  if(!req.cookies['email']) {
    res.redirect('/all');
  } else {
    getBooks(req.cookies['email'], function(books) {
      fs.readFile(__dirname + '/pages/index.html', 'utf8', function(err, file) {
        if(err) throw err;

        var header = 'header_auth';
        fs.readFile(__dirname + '/pages/' + header + '.html', 'utf8', function(err, content) {
          if(err) throw err;

          res.send(Mark.up(file, { //load books
            books: books,
            isOnMyScreen: true,
            addsTrade: req.query.add,
            title: 'Trade Books | My Books',
            header: Mark.up(content, {
              user: req.cookies.username,
              active: 'my'
            })
          }));
        });
      });
    });
  }
});

app.use(express.static(__dirname + '/public'));


app.listen(process.env.PORT || '8080');
console.log('Started..');

function getBooks(owner, cb) {
  mongo.connect(process.env.MONGODB_URI, function(err, db) {
    if(err) throw err;

    var books = db.collection('books');
    books.find(owner ? { owner: owner } : null).toArray(function(err, arr) {
      if(err) throw err;
      cb(arr);
    });
  });
}
