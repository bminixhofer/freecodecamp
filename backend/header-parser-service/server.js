'use strict';

var express = require('express');
var app = express();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

app.use(express.static(__dirname + '/public'));

app.get("/getdata", function(req, res) {
	var obj = {};
	callAjax("http://www.trackip.net/ip?json", function(data) {
		obj.ip = JSON.parse(data).ip;
		obj.software = /\(([^\)]+)\)/.exec(req.headers['user-agent'])[1];
		obj.language = req.acceptsLanguages()[0]
		res.end(JSON.stringify(obj));
	});
});
app.listen(process.env.PORT);

function callAjax(url, callback){
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}