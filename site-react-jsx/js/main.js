'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var IssuesApp = React.createClass({
  getInitialState: function() {
    return {
      searchText: '',
      issues: []
    };
  },
  componentDidMount: function() {
    var jsonFile = '';
    if(window.location.search.indexOf('all') > 0){
      jsonFile = '/json/combined-all.json';
    } else if(window.location.search.indexOf('100') > 0){
      jsonFile = '/json/combined-100.json';
    } else {
      jsonFile = '/json/combined-30.json';
    }

    const that = this;
    fetch(jsonFile)
      .then((response) => response.json())
      .then(function(issues){
        that.setState({issues: issues});
      });
  },
  handleChange: function(event) {
    this.setState({searchText: event.target.value});
  },
  searchFilter: function(issue) {
    const searchText = this.state.searchText;
    if(!searchText.length) return true;
    return issue.title.indexOf(searchText) >= 0 || (issue.body && issue.body.indexOf(searchText) >= 0);
  },
  render: function() {
    return (
      <div>
        <SearchElement searchText={this.state.searchText}  handleChange={this.handleChange} />
        <TableElement searchText={this.state.searchText}  issues={this.state.issues} searchFilter={this.searchFilter} />
      </div>
    );
  }
});

var SearchElement = React.createClass({
  render: function() {
    const handleChange = this.props.handleChange;
    return (
      <input type="text" className="form-control" placeholder="Search..." value={this.props.searchText} onChange={handleChange} />
    );
  }
});

var TableElement = React.createClass({
  renderTableRows: function() {
    const t0 = performance.now();
    const issues = this.props.issues;
    const searchFilter = this.props.searchFilter;
    const searchText = this.props.searchText;
    const issueRows = [];
    for(var i=0; i<issues.length; i++){
      if(searchFilter(issues[i])){
        issueRows.push(<TableRow issue={issues[i]} key={issues[i].id.toString()} />);
      }
    }
    const t1 = performance.now();
    console.log("search " + searchText + ' - ' + (t1 - t0) + " milliseconds.")
    return issueRows;
  },
  render: function() {
    const tableRows = this.renderTableRows();
    return (
      <table className="table table-hover table-striped" id="issue-list">
        <thead>
          <tr className="issue-metadata-row">
            <th>#</th>
            <th>Name</th>
            <th>Author</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        {tableRows}
      </table>
    );
  }
});

var TableRow = React.createClass({
  render: function() {
    const issue = this.props.issue;
    return (
      <tbody>
        <tr>
          <td>{issue.number}</td>
          <td>{issue.title}</td>
          <td>{issue.user.login}</td>
          <td>{issue.created_at}</td>
        </tr>
      </tbody>
    );
  }
});

ReactDOM.render(<IssuesApp />, document.getElementById('react-app'))
