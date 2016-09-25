const size = [40, 100];
const avgRoomCount = 6;
const React = require('react');
const ReactDOM = require('react-dom');
const DungeonGenerator = require('./DungeonGenerator.js');
const PlayerRenderer = require('./PlayerRenderer.js');

var DungeonMap = React.createClass({
  componentDidMount: function() {
    DungeonGenerator.renderer.initialize(this.props.dungeon, this.refs.canvas);
    this.updateMap();
  },
  updateMap: function() {
    this.forceUpdate();
  },
  render: function() {
    DungeonGenerator.renderer.update();
    return (
      <div>
        <canvas style={{zIndex: 0, position: "absolute"}} ref="canvas" width={this.props.width} height={this.props.height}/>
      </div>
    );
  }
});

var Player = React.createClass({
  getInitialState: function() {
    var [x, y] = this.props.dungeon.getRandomFreeSpace();
    return {
      health: 100,
      weapon: {
        attack: 5,
        name: "Stick"
      },
      x: x,
      y: y
    };
  },
  componentDidMount: function() {
    PlayerRenderer.initialize(this.refs.canvas, this.props.dungeon.mapSize);
    this.forceUpdate();
    window.addEventListener('keydown', this.movePlayer);
  },
  componentWillUnmount: function() {
    window.removeEventListener('keydown', this.movePlayer);
  },
  movePlayer: function(e) {
    var x = this.state.x;
    var y = this.state.y;
    switch (e.code) {
      case 'ArrowUp': y--; break;
      case 'ArrowDown': y++; break;
      case 'ArrowLeft': x--; break;
      case 'ArrowRight': x++; break;
      default: return;
    }
    switch(this.props.dungeon.map[x][y]) {
      case 3:
        PlayerRenderer.update(x, y);
        this.setState({
          x: x,
          y: y
        });
        break;
      case 4:
        let enemy = this.props.dungeon.enemies.filter(function(enemy) {
          return enemy.x === x && enemy.y === y;
        })[0];
        this.setState({
          health: enemy.attackPlayer(this.state)
        });
        break;
      case 5:
        let pickup = this.props.dungeon.pickups.filter(function(pickup) {
          return pickup.x === x && pickup.y === y;
        })[0];
        this.setState({
          x: x,
          y: y,
          weapon: pickup.getTaken()
        })
        break;
    }
  },
  render: function() {
    PlayerRenderer.update(this.state.x, this.state.y);
    return (
      <div>
        <Info data={this.state}/>
        <canvas style={{zIndex: 1, position: "absolute"}} ref="canvas" width={this.props.width} height={this.props.height}/>
      </div>
    );
  }
});

var Info = React.createClass({
  render: function() {
    return (
      <div>
        <p>Health: {this.props.data.health}</p>
        <p>Weapon: {this.props.data.weapon.name}</p>
        <p>Attack: {this.props.data.weapon.attack}</p>
      </div>
    );
  }
});

var Game = React.createClass({
  getInitialState: function() {
    //2 = wall
    //1 = floor
    return {
      map: [],
    }
  },
  componentWillMount: function() {
    var dungeon = new DungeonGenerator.Dungeon();
    dungeon.generate();
    this.setState({
      dungeon: dungeon
    });
  },
  render: function() {
    var height = window.innerHeight * 0.7;
    var width = window.innerWidth * 0.7;
    return (
      <div>
        <Player dungeon={this.state.dungeon} width={width} height={height}/>
        <DungeonMap dungeon={this.state.dungeon} width={width} height={height}/>
      </div>
    );
  }
});

ReactDOM.render(
  <div>
    <Game size={64}/>
  </div>, document.getElementById('app')
);
