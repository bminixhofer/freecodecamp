const express = require('express');
const login = require('./lib/login.js');
const mongodb = require('mongodb');
const mongo = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('then-fs');
const handlebars = require('handlebars');

const mongodbURI = 'mongodb://localhost:27017';
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
login(app);

app.get('/logout', (req, res) => {
  res.clearCookie('name');
  res.redirect('/');
});

app.get('/', (req, res) => {
  if(req.cookies['name']) {
    res.redirect('/entries');
  } else {
    res.sendFile(__dirname + '/public/index.html');
  }
});

app.get('/entries/:user?', (req, res) => {
  fs.readFile('public/entries.hbs', 'utf8').then(file => {
    let template = handlebars.compile(file);
    mongo.connect(mongodbURI, (err, db) => {
      if(err) throw err;

      let query = req.params.user ? {
        author: req.params.user
      } : {};
      db.collection('posts').find(query).toArray((err, posts) => {
        if(err) throw err;

        posts = posts.map(post => {
          post.userIsOwner = req.cookies['name'] === post.author;
          return {
            html: getGridItem(post)
          };
        });
        res.send(template({
          user: req.cookies['name'],
          entries: posts
        }));
      });
    });
  })
});

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
        author: req.cookies['name'],
        votes: 0
      }, (err, post) => {
        if(err) throw err;

        let entry = post.ops[0];
        entry.userIsOwner = req.cookies['name'] === entry.author;
        res.end(JSON.stringify({
          success: true,
          html: getGridItem(entry),
          id: entry._id
        }));
      });
    });
  } else {
    res.end(JSON.stringify({
      success: false,
      error: 'Not logged in.'
    }));
  }
});

app.delete('/api/entry', (req, res) => {
  if(req.cookies['name']) {
    mongo.connect(mongodbURI, (err, db) => {
      if(err) throw err;

      let posts = db.collection('posts');
      let id = new ObjectId(req.body.id);
      posts.findOne({ _id: id}).then(entry => {
        if(req.cookies['name'] === entry.autor) {
          posts.remove({_id: id}, err => {
            res.end(JSON.stringify({
              success: true
            }));
          });
        }
      });
    });
  }
});

const getGridItem = entry => `
  <div class="grid-item">
    ${entry.userIsOwner ? `<img class="delete-icon" src="/resources/cross.svg" data-id="${entry._id}">` : ""}
    <img src="${entry.image}" />
    <p class="description">${entry.description}</p>
    <div class="author">
      <p>${entry.author}</p>
    </div>
    <div class="upvotes">
      <p>${entry.votes} Votes</p>
    </div>
  </div>
`;

app.use(express.static(__dirname + '/public'));
app.listen(8080);
console.log('started');
