var express = require('express');
var http = require('http');
var io = require('socket.io')(http);

var app = express();

app.use(express.static(__dirname + '/public'));

app.listen('8080');
console.log('Started..');
