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
var sha1 = require('sha1');

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

    mongo.connect(process.env.MONGODB_URI, function(err, db) {
      var users = db.collection('users');
      users.find( { email: email }).toArray(function(err, arr) {
        if(err) throw err;

        if(arr.length === 0) {
          users.insert({ email: email, username: username }, function(err) {
            if(err) throw err;
            res.end();
          });
        } else {
          res.end();
        }
      })
    });
  } else {
    res.end();
  }
});

app.get('/logoutUser', function(req, res) {
  res.clearCookie('email');
  res.clearCookie('username');
  res.end();
});

app.post('/addBook', function(req, res) {
  mongo.connect(process.env.MONGODB_URI, function(err, db) {
    if(req.body.book) {
      request('https://www.googleapis.com/books/v1/volumes?q=' + req.body.book, function(err, response, body) {
        if(response.statusCode !== 200 || err) throw err;

        var data = JSON.parse(body);
        if(data.totalItems === 0) {
          res.end(JSON.stringify({error: "Couldn't find any books with that title"}));
        }
        data = data.items[0];

        var info = data.volumeInfo;
        var mappedData = {
          owner: req.cookies['email'],
          title: info.title,
          cover: info.imageLinks.thumbnail,
          id: sha1(Date.now() + info.title)
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
  mongo.connect(process.env.MONGODB_URI, function(err, db) {
    var books = db.collection('books');

    var type = req.body.requested ? 'requested' : 'offered';
    var current = req.body[type];
    if(current) {
      books.find( { id: current }).toArray(function(err, book) {
        if(err) throw err;

        req.session[type] = book[0];
        var offered = req.session.offered;
        var requested = req.session.requested;

        if(offered && requested) {
          if(err) throw err;

          books.update( { id: offered.id }, { $set: { locked: true }}, function(err) {
            if(err) throw err;
          });
          books.update( { id: requested.id }, { $set: { locked: true }}, function(err) {
            if(err) throw err;
          });
          var trades = db.collection('trades');
          var trade = {
            offer: offered,
            request: requested,
          };
          trade.id = sha1(Date.now() + JSON.stringify(trade));
          trades.insert(trade, function(err) {
            if(err) throw err;

            req.session.destroy(function(err) {
              if(err) throw err;

              res.end(JSON.stringify({ status: 'done'}));
            });
          });
        } else {
          res.end(JSON.stringify({ status: 'waiting', waitingFor: req.body.offered ? 'all' : 'my' }));
        }
      });
    } else {
      res.end(JSON.stringify({ status: 'invalid input' }));
    }
  });
});

app.post('/trade/:type', function(req, res) {
  var type = req.params.type;
  var owner = req.cookies['email'];
  var id = req.body.id;

  if(owner && id) {
    mongo.connect(process.env.MONGODB_URI, function(err, db) {
      if(err) throw err;

      var books = db.collection('books');
      var trades = db.collection('trades');
      trades.find( { id: id }).toArray(function(err, arr) {
        if(err) throw err;

        var trade = arr[0];
        if(type === 'cancel') {
          if(trade.request.owner === owner || trade.offer.owner === owner) {
            trades.remove( { id: id }, false, function(err) {
              if(err) throw err;

              books.update( { id: trade.offer.id }, { $set: { locked: false }}, function(err) {
                if(err) throw err;
              });
              books.update( { id: trade.request.id }, { $set: { locked: false }}, function(err) {
                if(err) throw err;
              });
              res.end();
            });
          }
        } else if(type === 'confirm') {
          if(trade.request.owner === owner) {
            trades.remove( { id: id }, function(err) {
              if(err) throw err;
              var books = db.collection('books');
              books.update({ id: trade.request.id }, { $set: { locked: false, owner: trade.offer.owner } }, function(err) {
                if(err) throw err;
                books.update({ id: trade.offer.id }, { $set: { locked: false, owner: trade.request.owner } }, function(err) {
                  if(err) throw err;

                  res.end();
                });
              });
            });
          }
        }
      });
    });
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
        trades.find( { $or: [ { "offer.owner": email }, { "request.owner": email } ] }).toArray(function(err, trades) {
          if(err) throw err;

          fs.readFile(__dirname + '/pages/header_auth.html', 'utf8', function(err, content) {
            if(err) throw err;

            var index = 0;
            var users = db.collection('users');
            if(trades.length === 0) {
              sendTrades();
            } else {
              trades.forEach(function(trade) {
                var partner = trade.offer.owner === email ? trade.request.owner : trade.offer.owner;
                users.find({ email: partner }).toArray(function(err, arr) {
                  if(err) throw err;

                  trade.partner = arr[0];
                  console.log(trade);
                  index++;
                  if(index === trades.length) {
                    sendTrades();
                  }
                });
              });
            }
            function sendTrades() {
              var requested = trades.filter(function(trade) {
                return trade.offer.owner === email;
              });

              var received = trades.filter(function(trade) {
                return trade.request.owner === email;
              });

              var markup = {
                title: 'Trade Books | My Trades',
                req: requested,
                rec: received,
                header: Mark.up(content, {
                  user: req.cookies.username,
                  active: 'trades'
                })
              }

              res.send(Mark.up(file, markup));
            }
          });
        });
      });
    });
  }
});

app.get('/settings/get', function(req, res) {
  mongo.connect(process.env.MONGODB_URI, function(err, db) {
    if(err) throw err;

    var users = db.collection('users');
    users.find( { email: req.cookies['email'] }).toArray(function(err, arr) {
      if(err) throw err;

      var user = arr[0];
      res.end(JSON.stringify({
        city: user.city,
        state: user.state,
        street: user.street
      }));
    });
  });
})

app.post('/settings/set', function(req, res) {
  mongo.connect(process.env.MONGODB_URI, function(err, db) {
    if(err) throw err;

    var settings = {
      city: req.body.city,
      state: req.body.state,
      street: req.body.street
    };

    var users = db.collection('users');
    users.update( { email: req.cookies['email'] }, {
      $set: settings
    }, function(err) {
      if(err) throw err;
      res.end();
    });
  });
});

app.get('/all', function(req, res) {
  var addsTrade = req.query.add;
  getBooks(addsTrade ? req.cookies['email'] : null, addsTrade, function(books) {
    fs.readFile(__dirname + '/pages/index.html', 'utf8', function(err, file) {
      if(err) throw err;

      var header = req.cookies['email'] ? 'header_auth' : 'header_noauth';

      fs.readFile(__dirname + '/pages/' + header + '.html', 'utf8', function(err, content) {
        if(err) throw err;

        res.send(Mark.up(file, { //load books
          books: books,
          addsTrade: addsTrade,
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
    getBooks(req.cookies['email'], false, function(books) {
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

function getBooks(owner, lock, cb) {
  mongo.connect(process.env.MONGODB_URI, function(err, db) {
    if(err) throw err;

    var books = db.collection('books');

    books.find(owner && !lock ? { owner: owner } : null).toArray(function(err, arr) {
      if(err) throw err;
      if(lock) {
        arr.forEach(function(book) {
          if(book.owner === owner) {
            book.locked = true;
          }
        });
      }
      cb(arr);
    });
  });
}
