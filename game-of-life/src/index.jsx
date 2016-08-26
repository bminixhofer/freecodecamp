var Field = React.createClass({
  render: function() {
    var y = 0;
    var _this = this;
    var board = this.props.board.reduce(function(a, b) {
      b = b.map(function(element, x) {
        return (
          <div onClick={_this.props.setCell.bind(null, x, y)} className={"cell " + (element === 1 ? 'alive' : 'dead')}>
          </div>
        );
      });
      b.push((
        <br />
      ));
      y++;
      return b.concat(a);
    }, []);
    return (
      <div className="field">
        {board}
      </div>
    );
  }
});

var Game = React.createClass({
  getInitialState: function() {
    var state =  {
      options: {
        speed: 3,
        size: 10
      },
      fromUpdate: 0,
      board: [],
      runState: 'Run'
    }
    state.board = this.generateBoard(state.options);
    setInterval(this.updateBoard, 200);
    return state;
  },
  updateBoard: function(count) {
    this.state.fromUpdate++;
    var _this = this;
    var board = JSON.parse(JSON.stringify(this.state.board));
    if(this.state.fromUpdate >= this.state.options.speed && this.state.runState === 'Run') {
      board.forEach(function(row, y) {
        row.forEach(function(_, x) {
          board[x][y] = takeTurn(board, x, y);
        });
      });
      this.setState({
        fromUpdate: 0,
        board: board
      });
    }
    function takeTurn(board, x, y) {
      var neighbourCount = 0;
      neighbourCount +=
        getPos(board, x + 1, y) +
        getPos(board, x - 1, y) +
        getPos(board, x, y - 1) +
        getPos(board, x, y + 1) +
        getPos(board, x + 1, y + 1) +
        getPos(board, x - 1, y - 1) +
        getPos(board, x + 1, y - 1) +
        getPos(board, x - 1, y + 1);

      if(neighbourCount < 2 || neighbourCount > 3) {
        return 0;
      }
      if(neighbourCount === 3) {
        return 1;
      }
      return board[x][y];
    }
    function getPos(board, x, y) {
      return board[x] ? (board[x][y] || 0) : 0;
    }
  },
  generateBoard: function(options) {
    var board = [];
    for(var i = 0; i < options.size; i++) {
      var column = [];
      for(var j = 0; j < options.size; j++) {
        column.push(Math.round(Math.random() * 10) <= 3 ? 1 : 0);
      }
      board.push(column);
    }
    return board;
  },
  clearBoard: function() {
    var board = this.state.board;
    board = board.map(function(row) {
      return row.map(function() {
        return 0;
      })
    });
    this.setState({
      board: board
    });
  },
  changeSize: function(e) {
    var options = this.state.options;
    options.size = e.target.dataset.size;
    this.setState({
      options: options,
      board: this.generateBoard(options)
    });
  },
  changeSpeed: function(e) {
    this.setState({
      options: {
        speed: e.target.dataset.speed
      }
    });
  },
  toggleRunState: function() {
    this.setState({
      runState: this.state.runState === 'Run' ? 'Pause' : 'Run'
    });
  },
  setCell: function(x, y) {
    var board = this.state.board;
    board[y][x] = 1;
    this.setState({
      board: board
    });
  },
  render: function() {
    return (
      <div className="game">
        <div className="headline">
          <input onClick={this.toggleRunState} type="button" value={this.state.runState === 'Run' ? 'Pause' : 'Run'}></input>
          <input onClick={this.clearBoard} type="button" value="Clear"></input>
        </div>
        <Field setCell={this.setCell} board={this.state.board}/>

        <div className="settings">
          <div className="size">
            <input type="radio" name="size" data-size={10} onChange={this.changeSize} defaultChecked/>10x10<br />
            <input type="radio" name="size" data-size={20} onChange={this.changeSize}/>20x20<br />
            <input type="radio" name="size" data-size={30} onChange={this.changeSize}/>30x30<br />
          </div>
          <div className="speed">
            Slow<input type="radio" name="speed" data-speed={5} onChange={this.changeSpeed}/><br />
            Normal<input type="radio" name="speed" data-speed={3} onChange={this.changeSpeed} defaultChecked/><br />
            Fast<input type="radio" name="speed" data-speed={1} onChange={this.changeSpeed}/><br />
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <div>
    <Game />
  </div>, document.getElementById('app')
);
