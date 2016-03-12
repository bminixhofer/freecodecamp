'use strict';

var express = require('express');
var app = express();

var months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

app.use(express.static(__dirname + '/public'));

app.get(/.*/, function(req, res) {
	var input = req.url.slice(1);
	
	if(input.length > 0) {
		var jsDate = convertFromNaturalDate(input);
		var date = new Date((jsDate != "Invalid Date") ? jsDate : Number(input));
		var obj = { unix: null, natural: null };
	
		if(date.toString() != "Invalid Date") {
			obj.unix = date.getTime();
			obj.natural = months[date.getMonth()] + " " + date.getDate() + ", " + date.getUTCFullYear();
		}
			
		res.end(JSON.stringify(obj));
	} else {
		res.end();
	}
});
app.listen(process.env.PORT || 8080);

function convertFromNaturalDate(date) {
	var matches = date.match(/(\w+)%20(\d+),%20(\d+)/i) || [];
	if(matches.length == 4) {
		matches = matches.slice(1);
		var compareMonths = months.map(function(value) {
			return value.toLowerCase();	
		});
		return addZeros(matches[2], 4) + "-" + addZeros(compareMonths.indexOf(matches[0].toLowerCase()) + 1, 2) + "-" + addZeros(matches[1]); 
	} else {
		return "Invalid Date";
	}
}

function addZeros(str, num) {
	for(var i = 0; i < str.length; i++) {
		if(str.length < num) {
			str = "0" + str;
		}
	}
	
	return str;
}