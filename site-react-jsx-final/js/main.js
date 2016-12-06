'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var classNames = require('classnames');

class IssuesApp extends React.Component {
  constructor(config){
    super(config)
    this.state = {
      searchText: '',
      issues: [],
      displayIssues: [],
      limit: 20,
      page: 0,
      pages: 0,
      activeIssue: undefined
    };
    this.handleChange = this.handleChange.bind(this);
    this.runSearch = this.runSearch.bind(this);
    this.setActiveIssue = this.setActiveIssue.bind(this);
    this.setPage = this.setPage.bind(this);
  }
  componentDidMount() {
    let jsonFile = '';
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
        that.setState({issues: issues}, that.runSearch);
      });
  }
  handleChange(event) {
    const searchText = event.target.value;
    this.setState({
      searchText: searchText
    }, this.runSearch);
  }
  runSearch(){
    const {searchText, issues, limit} = this.state;
    let displayIssues = issues;
    if(searchText && searchText.length > 0){
      displayIssues = issues.filter((i) =>
        i.title.indexOf(searchText) >= 0 || 
        (i.body && i.body.indexOf(searchText) >= 0) ||
        (i.user && i.user.login.indexOf(searchText) >= 0)
      );
    }
    this.setState({
      displayIssues: displayIssues,
      page: 0,
      pages: Math.floor(displayIssues.length / limit)
    });
  }
  setActiveIssue(issue) {
    this.setState({ activeIssue: issue });
  }
  setPage(page) {
    this.setState({ page: page });
  }
  render() {
    const {searchText, displayIssues, issues, page, pages, limit, activeIssue} = this.state;
    return (
      <div className="row">
        <div className="col-xs-4">
          Showing {displayIssues.length} / {issues.length}
          <SearchElement searchText={searchText} issues={issues} displayIssues={displayIssues} handleChange={this.handleChange} />
          <Pagination page={page} pages={pages} setPage={this.setPage} />
          <TableElement issues={displayIssues} page={page} limit={limit} activeIssue={activeIssue} setActiveIssue={this.setActiveIssue} />
        </div>
        <div className="col-xs-8">
          <ViewElement activeIssue={activeIssue} />
        </div>
      </div>
    );
  }
}

var SearchElement = React.createClass({
  render: function() {
    const { handleChange, displayIssues, issues, searchText } = this.props;
    return (
      <input type="text" className="form-control" placeholder="Search..." value={searchText} onChange={handleChange} />
    );
  }
});

var Pagination = React.createClass({
  renderPages: function(){
    const { page, pages, setPage } = this.props;
    const pageNumbers = [];
    if(page - 3 > 0){
      const lastPage = pages;
      pageNumbers.push(<li><a href="#" key={'0'} onClick={() => (setPage(0))}>1</a></li>);
    }
    for(var i = -3; i < 3; i++){
      const pageNumber = i + page;
      const pageClass = classNames({active: pageNumber == page});
      if(pageNumber >= 0 && pageNumber <= pages) {
        pageNumbers.push(<li className={pageClass}><a href="#" key={pageNumber.toString()} onClick={() => (setPage(pageNumber))}>{pageNumber+1}</a></li>);
      }
    }
    if(page + 3 <= pages){
      const lastPage = pages;
      pageNumbers.push(<li><a href="#" key={lastPage.toString()} onClick={() => (setPage(lastPage))}>{lastPage+1}</a></li>);
    }
    return pageNumbers;
  },
  render: function(){ 
    const { page, pages, setPage } = this.props;
    const prevPage = page - 1;
    const hasPrevPage = page > 0;
    const nextPage = page + 1;
    const hasNextPage = page < pages;
    return (
      <nav aria-label="Page navigation">
        <ul className="pagination">
          { hasPrevPage && <li>
            <a href="#" onClick={() => setPage(prevPage)} aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li> }
          {this.renderPages()}
          { hasNextPage && <li>
            <a href="#" onClick={() => setPage(nextPage)} aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li> }
        </ul>
      </nav>
    );
  }
});

var TableElement = React.createClass({
  renderTableRows: function() {
    const { issues, activeIssue, setActiveIssue, page, limit } = this.props;
    const limitIssues = issues.slice(page * limit, page * limit + limit);
    return limitIssues.map((i) => <TableRow issue={i} key={i.id.toString()} setActiveIssue={setActiveIssue} activeIssue={activeIssue} />);
  },
  render: function() {
    const tableRows = this.renderTableRows();
    return (
      <table className="table table-hover" id="issue-list">
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
    const { issue, setActiveIssue, activeIssue } = this.props;
    const tableRowClasses = classNames({active: activeIssue && issue.id == activeIssue.id});
    return (
      <tbody>
        <tr className={tableRowClasses} onClick={() => setActiveIssue(issue)}>
          <td>{issue.number}</td>
          <td>{issue.title}</td>
          <td>{issue.user.login}</td>
          <td>{issue.created_at}</td>
        </tr>
      </tbody>
    );
  }
});

var ViewElement = React.createClass({
  render: function(){
    const { activeIssue } = this.props;
    if(!activeIssue) return null;
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          { activeIssue.title }
          <div className="pull-right">
            #{ activeIssue.number }
          </div>
        </div>
        <div className="panel-body">
          <pre>{ activeIssue.body }</pre>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<IssuesApp />, document.getElementById('react-app'))
