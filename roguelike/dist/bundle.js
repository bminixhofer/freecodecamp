/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	const size = [40, 100];
	const avgRoomCount = 6;

	var DungeonMap = React.createClass({displayName: "DungeonMap",
	  render: function() {
	    console.log(this.props.map);
	    return (
	      React.createElement("div", null
	      )
	    );
	  }
	});

	var Info = React.createClass({displayName: "Info",
	  render: function() {
	    return (
	      React.createElement("div", null
	      )
	    );
	  }
	});

	var Game = React.createClass({displayName: "Game",
	  getInitialState: function() {
	    //2 = wall
	    //1 = floor
	    return {
	      map: [],
	    }
	  },
	  componentWillMount: function() {
	    this.setState({
	      map: Dungeon.Generate()
	    });
	  },
	  render: function() {
	    return (
	      React.createElement("div", null,
	        React.createElement(Info, null),
	        React.createElement(DungeonMap, {map: this.state.map})
	      )
	    );
	  }
	});

	ReactDOM.render(
	  React.createElement("div", null,
	    React.createElement(Game, {size: 64})
	  ), document.getElementById('app')
	);


/***/ }
/******/ ]);
