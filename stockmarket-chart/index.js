var express = require('express');
var http = require('http');
var request = require('request');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var server = app.listen('8080');
var io = require('socket.io').listen(server);

var stocks = [];

app.use(express.static(__dirname + '/public'));

app.get('/getStocks', function(req, res) {
  res.end(JSON.stringify(stocks));
});

io.on('connection', function(socket) {
  socket.on('stock add', function(code) {
    var stock = {
      code: code
    }
    request('http://dev.markitondemand.com/MODApis/Api/v2/quote/json?symbol=' + code, function(err, res, body) {
      if(err) throw err;

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
          io.emit('stock error', 'Stock is already added');
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
            if(err) throw err;

            try {
              var data = JSON.parse(body);
            } catch(err) {
              io.emit('stock error', 'Internal Error');
              return;
            }
            data.companyName = info.Name;
            stocks.push(data);
            io.emit('stock change', stocks);
          });
        }

      } else {
        io.emit('stock error', 'No such Stock');
      }
    });
  });
});

console.log('Started..');
