var express = require('express');
var http = require('http');
var io = require('socket.io')(http);

var app = express();
var stocks = [];

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
  socket.on('stock add', function(code) {
    stocks.push(code);
    console.log(stocks);
  });
});

app.listen('8080');
console.log('Started..');
