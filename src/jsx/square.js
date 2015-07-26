var React = require('react');
var PropTypes = React.PropTypes;

var Square = React.createClass({
  propTypes: {
    black: PropTypes.bool,
    trap: PropTypes.bool
  },

  render: function () {
    var black = this.props.black;
    var trap = this.props.trap;
    var fill = black ? '#999' : '#ccc';
    var stroke = black ? '#ccc' : '#999';

    if(trap) {
      fill = black ? '#866' : '#dbb';
      stroke = black ? '#dbb' : '#866';
    }

    return (
      <div style={{backgroundColor: fill,color:stroke, width:'100%',height:'100%'}}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Square;
