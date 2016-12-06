if(window.location.search.indexOf('all') > 0){
  JSON_FILE = '/json/combined-all.json';
} else if(window.location.search.indexOf('100') > 0){
  JSON_FILE = '/json/combined-100.json';
} else {
  JSON_FILE = '/json/combined-30.json';
}

var IssuesApp = React.createClass({
  getInitialState: function() {
    return {
      searchText: '',
      issues: []
    };
  },
  componentDidMount: function() {
    const that = this;
    fetch(JSON_FILE)
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
      React.createElement('div', {}, [
        React.createElement(SearchElement, {searchText: this.state.searchText, handleChange: this.handleChange}),
        React.createElement(TableElement, {searchText: this.state.searchText, issues: this.state.issues, searchFilter: this.searchFilter})
        ])
      );
  }
});

var SearchElement = React.createClass({
  render: function() {
    const handleChange = this.props.handleChange;
    return (
      React.createElement('input', {type: 'text', className: 'form-control', placeholder: 'Search...', value: this.props.searchText, onChange: handleChange})
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
        issueRows.push(React.createElement(TableRow, {issue: issues[i], key: issues[i].id.toString()}));
      }
    }
    const t1 = performance.now();
    console.log("search " + searchText + ' - ' + (t1 - t0) + " milliseconds.")
    return issueRows;
  },
  render: function() {
    const tableRows = this.renderTableRows();
    tableRows.unshift(
      React.createElement('thead', {key: 'head'}, 
        React.createElement('tr', {className: 'issue-metadata-row'}, [
          React.createElement('th', {}, '#'),
          React.createElement('th', {}, 'Name'),
          React.createElement('th', {}, 'Author'),
          React.createElement('th', {}, 'Timestamp')
        ])
      ));
    return (
      React.createElement('table', {className: 'table table-hover table-striped', id: 'issue-list'}, tableRows)
    );
  }
});

var TableRow = React.createClass({
  render: function() {
    const issue = this.props.issue;
    return (
      React.createElement('tbody', {}, 
        React.createElement('tr', {className: 'issue-metadata-row'}, [
          React.createElement('td', {}, issue.number),
          React.createElement('td', {}, issue.title),
          React.createElement('td', {}, issue.user.login),
          React.createElement('td', {}, issue.created_at)
        ])
      )
    );
  }
});

ReactDOM.render(React.createElement(IssuesApp), document.getElementById('react-app'))
