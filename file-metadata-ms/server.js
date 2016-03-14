'use strict';

var express = require('express');
var app = express();
var bing = require('node-bing-api')({ accKey: "5m1MQD9wHZnCt4cDnIJKGmMAokYFK9irBszcYwFPgzM" });

app.get("/imagesearch/:search", function(req, res) {
    bing.images(req.params.search, { top: 5, skip: req.query.offset || 0 }, function(err, resp, body) {
        if(err) throw err;
        var response = [];
        body.d.results.forEach(function(obj) {
            response.push( {
                url: obj.MediaUrl,
                snippet: obj.Title,
                context: obj.SourceUrl,
                thumbnail: obj.Thumbnail.MediaUrl
            });
        });
        res.end(JSON.stringify(response));
    });
});

app.listen(process.env.PORT || 8080);