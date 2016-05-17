var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var Mark = require('markup-js');
var fs = require('fs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/addBook', function(req, res) {
  mongo.connect(process.env.MONGODB_URI, function(err, db) {
    //TODO: authenticate the user
    var auth = true;
    if(auth && req.body.book) {
      request('https://www.googleapis.com/books/v1/volumes?q=' + req.body.book, function(err, response, body) {
        if(response.statusCode !== 200 || err) throw err;

        var data = JSON.parse(body);
        if(data.totalItems === 0) {
          res.end(JSON.stringify({error: "Couldn't find any books with that title"}));
        }
        data = data.items[0];

        var mappedData = {
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

app.get('/', function(req, res) {
  mongo.connect(process.env.MONGODB_URI, function(err, db) {
    if(err) throw err;

    var books = db.collection('books');
    books.find().toArray(function(err, arr) {
      if(err) throw err;

      fs.readFile(__dirname + '/pages/index.html', 'utf8', function(err, file) {
        if(err) throw err;

        res.send(Mark.up(file, { books: arr }));
      });
    });
  });
});

app.use(express.static(__dirname + '/public'));


app.listen(process.env.PORT || '8080');
console.log('Started..');
