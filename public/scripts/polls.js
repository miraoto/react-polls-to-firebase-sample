var baasRef = new Firebase('https://amber-torch-384.firebaseio.com/');

var PollBox = React.createClass({
  loadPollsFromServer: function() {
    baasRef.child('polls').child('question-1').on('child_added', function(snapshot) {
      var poll = snapshot.val();
      poll.id = snapshot.key();
      var data = this.state.data;
      data.push(poll);
      this.setState({data: data});
    }.bind(this));
  },
  handlePollSubmit: function(poll) {
    console.log(poll)
    poll.id = Date.now();
    baasRef.child('polls').child('question-1').push(poll);
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadPollsFromServer();
    setInterval(this.loadPollsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="pollBox">
        <h1>Polls sample</h1>
        <PollList data={this.state.data} />
        <PollForm onPollSubmit={this.handlePollSubmit} />
      </div>
    );
  }
});

var PollList = React.createClass({
  render: function() {
    var pollNodes = this.props.data.map(function(poll) {
      return (
        <Poll author={poll.author} key={poll.id}>
          {poll.text}
        </Poll>
      );
    });
    return (
      <div className="pollList">
        {pollNodes.reverse()}
      </div>
    );
  }
});

var PollForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onPollSubmit({author: author, text: text});
    this.refs.author.value = '';
    this.refs.text.value = '';
  },
  render: function() {
    return (
      <form className="pollForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Poll = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="poll">
        <h2 className="pollAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

ReactDOM.render(
  <PollBox pollInterval={200000} />,
  document.getElementById('content')
);
