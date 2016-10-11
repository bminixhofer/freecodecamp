const express = require('express');
const login = require('./lib/login.js');
const mongo = require('mongodb').MongoClient;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const mongodbURI = 'mongodb://localhost:27017';
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

login(app);

app.get('/api/entry', (req, res) => {
  mongo.connect(mongodbURI, (err, db) => {
    if(err) throw err;

    let posts = db.collection('posts');
    res.end(posts);
  })
});

app.put('/api/entry', (req, res) => {
  if(req.cookies['name']) {
    mongo.connect(mongodbURI, (err, db) => {
      if(err) throw err;

      let posts = db.collection('posts');
      posts.insert({
        image: req.body.image,
        description: req.body.description,
        user: req.cookies['name']
      });
    });
  } else {
    res.end({
      error: 'Not logged in.'
    });
  }
});

app.listen(8080); 
console.log('started');
