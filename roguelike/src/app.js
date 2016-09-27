var React = require('react');
var ReactDOM = require('react-dom');
var Game = require('./Game.jsx');

ReactDOM.render(
  <Game size={64}/>
  ,document.getElementById('app')
);
