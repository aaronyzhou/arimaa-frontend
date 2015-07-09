var React = require('./lib/react.js');

function numberToPieceClass(n) {
  switch(n) {
    case 1:
      return "animal GoldRabbit";
    case 2:
      return "animal GoldCat";
    case 3:
      return "animal GoldDog";
    case 4:
      return "animal GoldHorse";
    case 5:
      return "animal GoldCamel";
    case 6:
      return "animal GoldElephant";
    case 9:
      return "animal SilverRabbit";
    case 10:
      return "animal SilverCat";
    case 11:
      return "animal SilverDog";
    case 12:
      return "animal SilverHorse";
    case 13:
      return "animal SilverCamel";
    case 14:
      return "animal SilverElephant";
    default:
      return "";
  }
}

var Board = React.createClass({
  render: function() {
    var rows = [];
    var ranks = "87654321";
    var files = "abcdefgh";

    for(var i=0;i<8;i++) {
      var sqs = [];
      for(var j=0;j<8;j++) {
        var squareName =  files.charAt(j)+ranks.charAt(i);
        var sqNum = 16*i+j;
        var piece = this.props.arimaa.get_piece_on_square(squareName);
        var pieceClassName = numberToPieceClass(piece);
        var sqColor = ((i+j)%2) ? "bl" : "wh";
        var c = sqColor + " " + pieceClassName;

        sqs.push(<div className={c} key={squareName}></div>);
      }
      rows.push(<div className="row" key={i}>{sqs}</div>);
    }
    return <div id="board">{rows}</div>;
  }
});

module.exports = Board;
