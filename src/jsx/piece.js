var React = require('react');

var ArimaaPiece = React.createClass({
  render: function() {
    var pieceName = this.props.pieceName;
    return <img src={"../images/"+pieceName+".gif"} alt={pieceName}></img>;
  }
});

module.exports = ArimaaPiece
