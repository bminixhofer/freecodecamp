'use strict';

var express = require('express');
var app = express();
var bing = require('node-bing-api')({ accKey: "5m1MQD9wHZnCt4cDnIJKGmMAokYFK9irBszcYwFPgzM" });
var mongo = require('mongodb').MongoClient;

app.use(express.static(__dirname + '/public'));

app.get("/imagesearch/:search", function(req, res) {
    var query = req.params.search;
    mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
        if(err) throw err;
        
        db.collection('recentsearches').insert( {
            search: query,
            time: new Date().toDateString()
        }, function(err, db) {
            if(err) throw err;
        });
    });
    bing.images(query, { top: 5, skip: req.query.offset || 0 }, function(err, resp, body) {
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

app.get("/mostrecent", function(req, res) {
    mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
        if(err) throw err;
        
        db.collection('recentsearches').find().sort({_id: -1}).limit(10).toArray(function(err, docs) {
            if(err) throw err;
            
            res.end(JSON.stringify( { docs.search, docs.time }));
        });
    });
});


app.listen(process.env.PORT || 8080);