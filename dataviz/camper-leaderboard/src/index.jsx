var Entries = React.createClass({
  getInitialState: function() {
    return {
      top: {
        alltime: [],
        recent: []
      },
      selected: 'alltime'
    }
  },
  sortList: function(criteria) {
    this.setState({selected: criteria});
  },
  componentDidMount: function() {
    var _this = this;
    $.ajax({
      url: 'https://fcctop100.herokuapp.com/api/fccusers/top/alltime',
      method: 'GET',
      dataType: 'json',
      success: function(alltime) {
        $.ajax({
          url: 'https://fcctop100.herokuapp.com/api/fccusers/top/recent',
          method: 'GET',
          dataType: 'json',
          success: function(recent) {
            _this.setState({
              top: {
                alltime: alltime,
                recent: recent
              }
            });
          }
        });
      }
    });
  },
  render: function() {
    var entries = this.state.top[this.state.selected].map(function(entry, index) {
      return (
        <tr key={entry.name + entry.alltime + entry.lastUpdate}>
          <td>{index + 1}</td>
          <td><img src={entry.img}/><span className="username">{entry.username}</span></td>
          <td>{entry.recent}</td>
          <td>{entry.alltime}</td>
        </tr>
      );
    });
    return (
      <table className="entries">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th data-selected={this.state.selected === 'recent' ? 'true' : 'false'} onClick={this.sortList.bind(this, 'recent')}>Points[last 30 days]</th>
            <th data-selected={this.state.selected === 'alltime' ? 'true' : 'false'} onClick={this.sortList.bind(this, 'alltime')}>Points[all time]</th>
          </tr>
        </thead>
        <tbody>
          {entries}
        </tbody>
      </table>
    );
  }
});

ReactDOM.render(
  <div className="leaderboard">
    <h1>Camper Leaderboard</h1>
    <Entries />
  </div>,
  document.getElementById('app')
);
