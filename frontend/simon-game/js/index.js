var app = angular.module("SimonGame", []);

app.controller("SimonCtrl", ["$timeout", function($timeout) {
  var _this = this;
  var audios = {
    green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
  }
  started = false;
  this.buttonText = "Start";
  this.currentSequence = [];
  userInput = [];
  this.clicked = function(color) {
    highlight(color);
    if (started) {
      userInput.push(color);
      if (userInput.join() !== _this.currentSequence.slice(0, userInput.length).join()) {
          displaySequence(0, function() {
            $timeout(function() {
              _this.buttonText = "Try Again";
              started = false;
            userInput = [];
            _this.currentSequence = [];
          }, 500);
        });
      }
      else if(userInput.length === _this.currentSequence.length) {
        _this.currentSequence.push(Object.keys(_this.state) [Math.floor(Math.random() * 4)]);
        $timeout(function() {
          userInput = [];
          displaySequence();
        }, 800);
      } 
    }
  };

  highlight = function(color) {
    console.log(color);
    audios[color].play();
    _this.state[color] = color + "-targeted";
    $timeout(function() {
      _this.state[color] = "normal";
    }, 750);
  };
  this.startGame = function() {
    if (!started) {
      started = true;
      _this.buttonText = "";
      _this.currentSequence.push(Object.keys(_this.state)[Math.floor(Math.random() * 4)]);
      displaySequence();
    }
  };
  displaySequence = function(index, callback) {
    console.log(_this.currentSequence);
    index = index || 0;
    $timeout(function() {
      console.log(index);
      highlight(_this.currentSequence[index]);
      if (index + 1 < _this.currentSequence.length) {
        displaySequence(index + 1, callback || null);
      }
      else {
        if(callback) {
          console.log("Called");
          callback();
        }
      }
    }, 750);
  }
  this.state = {
    green: "normal",
    red: "normal",
    yellow: "normal",
    blue: "normal"
  };
  this.original = JSON.parse(JSON.stringify(this.state));
}]);