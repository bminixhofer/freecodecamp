'use strict';

var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request');
var Mark = require('markup-js');
var fs = require('fs');

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

//login / logout system

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
          console.log(mappedData);
          res.end(JSON.stringify(mappedData));
        });
      });
    }
  })
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
  getBooks(req.cookies['email'], function(books) {
    fs.readFile(__dirname + '/pages/index.html', 'utf8', function(err, file) {
      if(err) throw err;

      var header = req.cookies['email'] ? 'header_auth' : 'header_noauth';

      fs.readFile(__dirname + '/pages/' + header + '.html', 'utf8', function(err, content) {
        if(err) throw err;

        res.send(Mark.up(file, { //load books
          books: books,
          canAddBooks: true,
          header: Mark.up(content, {
            user: req.cookies.username,
            active: 'my'
          })
        }));
      });
    });
  });
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
