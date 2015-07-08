var BlackElephant = React.createClass({
  render: function () {
    return <img src="../images/be.gif" alt="be"></img>;
  }
});

var WhiteElephant = React.createClass({
  render: function () {
    return <img src="../images/we.gif" alt="be"></img>;
  }
});

var ArimaaPiece = React.createClass({
  render: function() {
    var pieceName = this.props.pieceName;
    return <img src={"../images/"+pieceName+".gif"} alt={pieceName}></img>;
  }
});

module.exports = ArimaaPiece
