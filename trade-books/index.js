var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();

app.get('/', function(req, res) {
  console.log('req');
  res.sendFile(__dirname + '/pages/index.html');
});

app.use(express.static(__dirname + '/public'));


app.listen(process.env.PORT || '8080');
console.log('Started..');
