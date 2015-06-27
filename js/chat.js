var App = React.createClass({
	render: function() {
		return <div>hello {this.props.name}</div>;
	}	


});

/*
var Hello = React.Component {
	render() {
		return <div>Hello {this.props.name}</div>;
	}
}
*/

var container = Document.getElementById("container");
React.render(<App user={user}/>, container);