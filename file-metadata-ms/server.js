'use strict';

var express = require('express');
var app = express();
var multer = require('multer');
var autoReap  = require('multer-autoreap');

app.use(multer({dest:'./uploads/'}).single('fileToUpload'));
app.use(express.static(__dirname + '/public'));
app.use(autoReap);

app.post('/filedata', function(req, res){
    res.end(JSON.stringify( { name: req.file.originalname, size: req.file.size } ));
});

app.listen(3000);
app.listen(process.env.PORT || 8080);