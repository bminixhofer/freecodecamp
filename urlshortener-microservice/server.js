'use strict';

var express = require('express');
var mongo = require('mongodb').MongoClient;
var app = express();
var viableCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

app.use(express.static(__dirname + '/public'));

app.get(/\/new\/.+/, function(req, res) {
    var currentUrl = req.url.slice(5);
    var isValidUrl = /^(https?:\/\/)?w{3}\.\w+\.\w+/.test(currentUrl);
    
    if(isValidUrl) {
        mongo.connect('mongodb://localhost:27017', function(err, db) {
            if(err) throw err;
            
            var urls = db.collection('urls');
            urls.find().sort({_id: -1}).limit(1).toArray(function(err, docs) {
                if(err) throw err;
                var short = (docs.length > 0) ? docs[0].shortenedChar : 'a'; 
                
                if(short[short.length - 1] == viableCharacters[viableCharacters.length - 1]) {
                    short = short.split('');
                    short[short.length - 1] = 'a';
                    short.push('a');
                    short = short.join('');
                } else {
                    short = short.slice(0, short.length - 1) + viableCharacters[viableCharacters.indexOf(short[short.length -1]) + 1];
                }
            
                var obj = {
                 shortenedChar: short,
                 url: currentUrl,
                 shortened: req.get('host') + '/' + short
                };
            
                urls.insert(obj, function(err, data) {
                    if(err) throw err;
                    
                    res.end(JSON.stringify( {
                        url: obj.url,
                        short: obj.shortened
                    }));    
                });
            });
        });
    } else {
        res.end(JSON.stringify({ error: "invalid url" }));
    }
});

app.get(/^\/\w+$/, function(req, res) { 
    var shortenedUrl = req.url.slice(1);
    mongo.connect('mongodb://localhost:27017', function(err, db) {
        if(err) throw err;
        
        db.collection('urls').find({ shortenedChar: { $eq: shortenedUrl }}).toArray(function(err, arr) {
            if(err) throw err;
            
            if(arr.length > 0) {
            res.redirect((arr[0].url.indexOf("http://") === -1 && arr[0].url.indexOf("https://") === -1) ? "http://" + arr[0].url : arr[0].url);
            } else {
                res.end(JSON.stringify( { error: "URL not assigned" }));
            }
        });
    });
});
app.listen(process.env.PORT || 8080);
