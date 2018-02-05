var Input = React.createClass({
  textChanged: function() {
    var text = document.querySelector('.input > textarea');
    text.value = text.value.replace(/\\n/g, '\n');
    this.props.onChange(text);
  },
  componentDidMount: function() {
    this.textChanged();
  },
  render: function() {
    return (
      <div className="input">
        <textarea type="text" onLoad={this.textChanged} onChange={this.textChanged} defaultValue="
        Heading\n
        =======\n
        \n
        Sub-heading\n
        -----------\n
        \n
        ### Another deeper heading\n
        \n
        Paragraphs are separated by a blank line.\n
        \n
        Leave 2 spaces at the end of a line to do a\n
        line break\n
        \n
        Text attributes *italic*, **bold**,\n
        `monospace`, ~~strikethrough~~ .\n
        \n
        *[Benjamin Minixhofer](https://github.com/bminixhofer)*"/>
      </div>
    );
  }
});

var Output = React.createClass({
  render: function() {
    return (
      <div className="output" dangerouslySetInnerHTML={this.props.text}></div>
    );
  }
});

var Previewer = React.createClass({
  getInitialState: function() {
    return {text: ``};
  },
  setText: function(e) {
    var md = new Remarkable();
    var markdown = md.render(e.value.toString());
    this.setState({text: markdown});
  },
  render: function() {
    return (
      <div className="previewer">
        <Input onChange={this.setText}/>
        <Output text={{__html: this.state.text}}/>
      </div>
    );
  }
});

ReactDOM.render(
  <div>
    <h1 className="title">Markdown Previewer</h1>
    <Previewer />
  </div>,
  document.getElementById('app')
)
