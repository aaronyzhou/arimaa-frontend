var React = require('react');
var Board = require('./board.js');
var Movelist = require('./movelist.js');

var Game = React.createClass({
  render: function() {
    return (
      <div>
        <Board/>
        <Movelist/>
      </div>
    );
  }
});

module.exports = Game;
