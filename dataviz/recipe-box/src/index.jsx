function generateKey(name) {
  var key = Date.now() + name;
  for(var i = 0; i < 8; i++) {
    key += Math.floor(Math.random() * 10);
  }
  return key;
}

var Popup = React.createClass({
  sendData: function(e) {
    var parent = $(e.target.parentNode);
    var data = {
      name: parent.children('input[name=Name]').val(),
      ingredients: parent.children('input[name=Ingredients]').val().split(/,\s?/)
    }
    if(this.props.defaultData) {
      data.key = this.props.defaultData.key;
    }
    if(data.name && data.ingredients) {
      this.props.onSend(data);
      this.props.changeState(false);
    }
  },
  render: function() {
    var data = this.props.defaultData;
    return (
      <div className="popup" style={{display: this.props.display ? 'block' : 'none'}}>
        <h2>Name</h2><br />
        <input defaultValue={data ? data.name : ""} type="text" name="Name" /><br />
        <h2>Ingredients</h2><p>separated by a comma</p><br />
        <input defaultValue={data ? data.ingredients.join(', ') : ""}type="text" name="Ingredients" /><br />
        <input onClick={this.sendData} type="button" value="Submit" />
      </div>
    );
  }
});

var ListElement = React.createClass({
  getInitialState: function() {
    return {
      display: false,
    }
  },
  setPopupState: function(state) {
    this.setState({
      display: state
    });
  },
  render: function() {
    var ingredients = this.props.data.ingredients.map(function(ingredient) {
      return (
        <p key={generateKey(ingredient)}>{ingredient}</p>
      );
    });
    return (
      <div className="recipe">
        <h3 onClick={this.props.setDisplay.bind(null, this.props.data.key)}>{this.props.data.name}</h3>
        <div style={{display: this.props.displayed === this.props.data.key ? 'block' : 'none'}} className="info">
          <h2>{this.props.data.name}</h2>
          {ingredients}
          <input name="Edit" type="button" value="Edit" onClick={this.setPopupState.bind(null, true)}/>
          <input name="Delete" type="button" value="Delete" onClick={this.props.onDelete.bind(null, this.props.data.key)}/>
        </div>
        <Popup changeState={this.setPopupState} display={this.state.display} defaultData={this.props.data} onSend={this.props.onChange}/>
      </div>
    );
  }
});

var List = React.createClass({
  getInitialState: function() {
    return {
      displayed: ""
    }
  },
  setDisplay: function(key) {
    this.setState({
      displayed: this.state.displayed === key ? "" : key
    });
  },
  render: function() {
    var _this = this;
    var nodes = this.props.data.map(function(node) {
      return (
        <ListElement setDisplay={_this.setDisplay} displayed={_this.state.displayed} onDelete={_this.props.onDelete} onChange={_this.props.onChange} key={node.key} data={node} />
      );
    });
    return (
      <div className="container">
        {nodes}
      </div>
    );
  }
});

var AddButton = React.createClass({
  getInitialState: function() {
    return {
      display: false
    }
  },
  dataIsSent: function(data) {
    this.props.onAdd(data);
  },
  setPopupState: function(state) {
    this.setState({display: state});
  },
  render: function() {
    return (
      <div>
        <input className="addButton" onClick={this.setPopupState.bind(null, true)} type="button" value="Add" />
        <Popup changeState={this.setPopupState} onSend={this.dataIsSent} display={this.state.display}/>
      </div>
    );
  }
});

var RecipeBox = React.createClass({
  getInitialState: function() {
    var prev = localStorage.getItem('recipes');
    return {
      recipes: prev ? JSON.parse(prev) : []
    }
  },
  addItem: function(item) {
    item.key = generateKey(item.name);
    var recipes = JSON.parse(JSON.stringify(this.state.recipes));
    recipes.push(item);

    this.setState({
      recipes: recipes
    });
    localStorage.setItem('recipes', JSON.stringify(recipes));
  },
  changeItem: function(item) {
    var recipes = JSON.parse(JSON.stringify(this.state.recipes));
    recipes = recipes.map(function(recipe) {
      if(recipe.key === item.key) {
        return item;
      }
      return recipe;
    });

    this.setState({
      recipes: recipes
    });
    localStorage.setItem('recipes', JSON.stringify(recipes));
  },
  deleteItem: function(key) {
    var recipes = JSON.parse(JSON.stringify(this.state.recipes));
    recipes.forEach(function(recipe, index) {
      if(recipe.key === key) {
        recipes.splice(index, 1);
        return;
      }
    });

    this.setState({
      recipes: recipes
    });
    localStorage.setItem('recipes', JSON.stringify(recipes));
  },
  render: function() {
    return (
      <div>
        <List data={this.state.recipes} onDelete={this.deleteItem} onChange={this.changeItem}/>
        <AddButton onAdd={this.addItem}/>
      </div>
    );
  }
});

ReactDOM.render(
  <div>
    <h1>Recipe Box</h1>
    <RecipeBox />
  </div>, document.getElementById('app')
);
