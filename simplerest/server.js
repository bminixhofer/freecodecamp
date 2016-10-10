const express = require('express');
const login = require('./lib/login.js');

const app = express();
app.use(express.static(__dirname + '/public'));
login(app);

app.listen(8080);
console.log('started');
