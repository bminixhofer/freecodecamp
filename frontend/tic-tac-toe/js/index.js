//parts of the code written following this tic tac toe ai tutorial: https://mostafa-samir.github.io/Tic-Tac-Toe-AI/

var chosenSymbol;
var aiSymbol;

var game;

window.onload = function() {
  startNewGame();

  $('#prompt button').click(function() {
    if ($(this).hasClass("button-x")) {
      chosenSymbol = "X";
      aiSymbol = "O";
    } else if ($(this).hasClass("button-o")) {
      chosenSymbol = "O";
      aiSymbol = "X";
    }
    $('#prompt').removeClass('loaded');
    setTimeout(function() { $('#prompt').addClass('hidden'); }, 500);
  });

  $('#container div').click(function() {
    if (chosenSymbol !== "") {
      for (var i = 0; i < 9; i++) {
        if ($(this).hasClass("field" + i) && game.currentState.board[i] === "E") {
          $(this).html("<h3>" + chosenSymbol + "</h3>");
          var next = new State(game.currentState);
          next.board[i] = chosenSymbol;
          next.advanceTurn();
          
          next.turn = aiSymbol;
          game.advanceTo(next);
        }
      }
    }
  });

  $('#gameoverScreen button').click(function() {
    $("#gameoverScreen").removeClass("loaded");
    setTimeout(function() {
      $("#gameoverScreen").addClass("hidden")
    }, 500);
    startNewGame();
  });
}

var startNewGame = function() {
  for (var i = 0; i < 9; i++) {
    $(".field" + i).html("");
  }
  setTimeout(function() { $('#prompt').addClass('loaded'); }, 300);

  game = new Game();
}

var AIAction = function(pos) {

  this.movePosition = pos;
  this.minimaxVal = 0;

  this.applyTo = function(state) {
    var next = new State(state);

    next.board[this.movePosition] = state.turn;

    if (state.turn === aiSymbol)
      next.aiMovesCount++;

    next.advanceTurn();

    return next;
  }
};

function minimaxValue(state) {
    if (state.isTerminal()) {
      
      return Game.score(state);
    } else {
      var stateScore;

      if (state.turn === chosenSymbol) {
        stateScore = -100;
      }
      else {
        stateScore = 100;
      }
      
      var availableNextStates = state.emptyCells().map(function(pos) {
        var action = new AIAction(pos);

        var nextState = action.applyTo(state);

        return nextState;
      });

      availableNextStates.forEach(function(nextState) {
        var nextScore = minimaxValue(nextState);
        if (state.turn === chosenSymbol) {
          if (nextScore > stateScore)
            stateScore = nextScore;
        } else {
          if (nextScore < stateScore)
            stateScore = nextScore;
        }
      });

      return stateScore;
    }
  }

  function takeMove(turn) {
   
    var availableActions = game.currentState.emptyCells().map(function(pos) {
      var action = new AIAction(pos);
      var next = action.applyTo(game.currentState);

      action.minimaxVal = minimaxValue(next);

      return action;
    });

     var chosenAction = availableActions.sort(function(a, b) {
      if (a.minimaxVal < b.minimaxVal) {
        return -1; 
      }
      else if (a.minimaxVal > b.minimaxVal) {
        return 1;
      }
      else {
        return 0;
      }
    })[0];

    var nextAction = chosenAction.applyTo(game.currentState);

    $(".field" + chosenAction.movePosition).html("<h3>" + aiSymbol + "</h3>");

    game.advanceTo(nextAction);
  }

var State = function(old) {
  this.turn = "";

  this.aiMovesCount = 0;

  this.board = [];

  
  if (typeof old !== "undefined") {
   
    var len = old.board.length;
    this.board = new Array(len);
    for (var i = 0; i < len; i++) {
      this.board[i] = old.board[i];
    }

    this.aiMovesCount = old.aiMovesCount;
    this.result = old.result;
    this.turn = old.turn;
  }
 
  this.advanceTurn = function() {
    this.turn = (this.turn === chosenSymbol) ? aiSymbol : chosenSymbol;
  }

  this.emptyCells = function() {
    var indxs = [];
    for (var itr = 0; itr < 9; itr++) {
      if (this.board[itr] === "E") {
        indxs.push(itr);
      }
    }
    return indxs;
  }

  this.isTerminal = function() {
  
    var board = this.board.map(function(value) {
      if(value === aiSymbol) {
        return 1;
      } else if(value === chosenSymbol) {
        return -1;
      } else {
        return 0;
      } 
    });
    
    var board2D = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    
    
    for(var i = 0; i < 9; i++) {
      board2D[i % 3][Math.floor(i / 3)] = board[i];
    }
    
    var counts = [0, 0, 0, 0, 0, 0, 0, 0];
    
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
         counts[i] += board2D[i][j];
         counts[3 + i] += board2D[j][i];
      }
    }
    
    counts[6] = board2D[0][0] + board2D[1][1] + board2D[2][2];
    counts[7] = board2D[2][0] + board2D[1][1] + board2D[0][2];
    
    if(counts.indexOf(3) !== -1) {
      this.result = aiSymbol;
      return true;
    } else if(counts.indexOf(-3) !== -1) {
      this.result = chosenSymbol;
      return true;
    }
    
    if (this.emptyCells().length === 0) {
      this.result = "draw";
      return true;
    } else {
      return false;
    }
  };

};

var Game = function() {
  
  this.currentState = new State();
  
  this.currentState.board = 
    ["E", "E", "E",
    "E", "E", "E",
    "E", "E", "E"
  ];

  this.currentState.turn = "";

  this.advanceTo = function(_state) {
    this.currentState = _state;
    if (_state.isTerminal()) {
      $("#gameoverScreen").removeClass("hidden");
      setTimeout(function() {
        $("#gameoverScreen").addClass("loaded");
      }, 10);

      var text = "";

      if (_state.result === chosenSymbol) {
        text = "You won.";
      } else if (_state.result === aiSymbol) {
        text = "You lost.";
      } else {
        text = "Its a draw.";
      }
      $(".informationText").text(text);
    } else if(_state.turn === aiSymbol) {    
      takeMove(aiSymbol);
    }
  };

  
  this.start = function() {
    this.advanceTo(this.currentState);
  }

};

Game.score = function(_state) {
  if (_state.result === chosenSymbol) {
    return 10 - _state.aiMovesCount;
  } else if (_state.result === aiSymbol) {
    return -10 + _state.aiMovesCount;
  } else {
    return 0;
  }
}