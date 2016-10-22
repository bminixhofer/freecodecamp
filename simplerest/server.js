'use strict';

const express = require('express');
const login = require('./lib/login.js');
const mongodb = require('mongodb');
const mongo = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('then-fs');
const handlebars = require('handlebars');
const request = require('request');
const isImageURL = require('is-image-url');

const placeholderURL = '/resources/placeholder.png';
const mongodbURI = process.env.mongodbURI;
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

        let user = req.cookies['name'];
        posts = posts.map(post => {
          return {
            html: getGridItem(post, user)
          };
        });
        res.send(template({
          user: user,
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
  let user = req.cookies['name'];
  if(user) {
    mongo.connect(mongodbURI, (err, db) => {
      if(err) throw err;

      let posts = db.collection('posts');
      let image = req.body.image;
      if(!isImageURL(image)) {
        insertImage(placeholderURL);
      } else {
        request(image, (err, response) => {
          if(err || response.statusCode !== 200) {
            insertImage(placeholderURL);
          } else {
            insertImage(image);
          }
        });
      }
      function insertImage(img) {
        posts.insert({
          image: img,
          description: req.body.description,
          author: user,
          voters: []
        }, (err, post) => {
          if(err) throw err;

          let entry = post.ops[0];
          res.end(JSON.stringify({
            success: true,
            html: getGridItem(entry, user),
            id: entry._id
          }));
        });
      }
    });
  } else {
    res.end(JSON.stringify({
      success: false,
      error: 'Not logged in.'
    }));
  }
});

app.patch('/api/vote', (req, res) => {
  if(req.cookies['name']) {
    mongo.connect(mongodbURI, (err, db) => {
      if(err) throw err;

      let id = ObjectId(req.body.id);
      let name = req.cookies['name'];
      let posts = db.collection('posts');

      posts.findOne({ _id: id}).then(entry => {
        let voters = entry.voters;
        let index = voters.indexOf(name);
        if(index !== -1) {
          voters.splice(index, 1);
        } else {
          voters.push(name);
        }
        delete voters._id;

        posts.update({
          _id: id
        }, entry).then(() => {
          res.end(JSON.stringify({
            success: true
          }));
        });
      });
    });
  }
});

app.delete('/api/entry', (req, res) => {
  let user = req.cookies['name'];
  if(user) {
    mongo.connect(mongodbURI, (err, db) => {
      if(err) throw err;
      let posts = db.collection('posts');
      let id = new ObjectId(req.body.id);
      posts.findOne({ _id: id}).then(entry => {
        if(entry.author === user) {
          posts.remove({_id: id}, err => {
            if(err) throw err;

            res.end(JSON.stringify({
              success: true
            }));
          });
        } else {
          res.end(JSON.stringify({
            success: false,
            error: 'Not logged in.'
          }));
        }
      });
    });
  }
});

const getGridItem = (entry, user) => `
    <div class="grid-item" data-id="${entry._id}">
      ${user === entry.author ? `<img class="delete-icon" src="/resources/cross.svg">` : ""}
      <img class="entry" src="${entry.image}" />
      <p class="description">${entry.description}</p>
      <div class="author">
        <a href="/entries/${entry.author}">${entry.author}</a>
      </div>
      <div class="upvotes">
        <span class="vote-counter">${entry.voters.length}</span>
        <img src="/resources/heart.svg" class="svg vote ${entry.voters.includes(user) ? "full" : "empty"}">
      </div>
    </div>
`;
app.use(express.static(__dirname + '/public'));
app.listen(process.env.PORT || 8080);
console.log('started');
