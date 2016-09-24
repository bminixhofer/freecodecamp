const size = [40, 100];
const avgRoomCount = 6;
const React = require('react');
const ReactDOM = require('react-dom');
const DungeonGenerator = require('./DungeonGenerator.js');

var DungeonMap = React.createClass({
  componentDidMount: function() {
    console.log(this.refs);
    DungeonGenerator.renderer.initialize(this.props.dungeon, this.refs.canvas);
    this.updateMap();
  },
  updateMap: function() {
    this.forceUpdate();
  },
  render: function() {
    var width = window.innerWidth * 0.7;
    var height = window.innerHeight * 0.7;
    DungeonGenerator.renderer.update();
    return (
      <div>
        <canvas ref="canvas" width={width} height={height}/>
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
    return (
      <div>
        <Player dungeon={this.state.dungeon}/>
        <DungeonMap dungeon={this.state.dungeon}/>
      </div>
    );
  }
});

ReactDOM.render(
  <div>
    <Game size={64}/>
  </div>, document.getElementById('app')
);
