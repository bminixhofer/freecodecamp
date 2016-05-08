var express = require('express');
var http = require('http');
var request = require('request');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var stocks = [];

app.use(express.static(__dirname + '/public'));

app.get('/getStocks', function(req, res) {
  res.end(JSON.stringify(stocks));
});

io.on('connection', function(socket) {
  socket.on('stock remove', function(code) {
    stocks = stocks.filter(function(stock) {
      return stock.Elements[0].Symbol !== code;
    });
    io.sockets.emit('stock change', stocks);
  });
  socket.on('stock add', function(code) {
    var stock = {
      code: code
    }
    request('http://dev.markitondemand.com/MODApis/Api/v2/quote/json?symbol=' + code, function(err, res, body) {
      if(err) {
        io.sockets.emit('stock error', 'Could not connect to API');
        return;
      }

      var info = JSON.parse(body);
      //check if stock exists
      if(info.Name) {
        //check if stock is already added
        var exists = false;
        stocks.forEach(function(element) {
          if(element.Elements[0].Symbol.toLowerCase() === code.toLowerCase()) {
            exists = true;
            return;
          }
        });

        if(exists) {
          io.sockets.emit('stock error', 'Stock is already added');
        } else {
          var requestData = {
            "Normalized": false,
            "NumberOfDays": 365,
            "DataPeriod": "Day",
            "Elements": [{
              "Symbol": code,
              "Type": "price",
              "Params": ["c"]
            }]
          };

          request('http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=' + JSON.stringify(requestData), function(err, res, body) {
            if(err) {
              io.sockets.emit('stock error', 'Could not connect to API');
              return;
            }

            try {
              var data = JSON.parse(body);
            } catch(err) {
              io.sockets.emit('stock error', 'Internal Error');
              return;
            }
            data.companyName = info.Name;
            stocks.push(data);
            io.sockets.emit('stock change', stocks);
          });
        }

      } else {
        io.sockets.emit('stock error', 'No such Stock');
      }
    });
  });
});

server.listen(process.env.PORT || '8080')
console.log('Started..');
