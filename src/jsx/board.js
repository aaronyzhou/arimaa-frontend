var React = require('react');
var Arimaa = require('./lib/arimaa.js');
var Square = require('./square.js');
var Piece = require('./piece.js');

function numberToPieceName(n) {
  switch(n) {
    case 1:
      return "wr";
    case 2:
      return "wc";
    case 3:
      return "wd";
    case 4:
      return "wh";
    case 5:
      return "wm";
    case 6:
      return "we";
    case 9:
      return "br";
    case 10:
      return "bc";
    case 11:
      return "bd";
    case 12:
      return "bh";
    case 13:
      return "bm";
    case 14:
      return "be";
    default:
      return "";
  }
}


var Board = React.createClass({
  getInitialState: function() {
    var a = new Arimaa();
    a.set_position("8/8/3R4/3r4/8/8/8/8");
    return {arimaa: a};
  },

  renderSquare: function(i) {
    var x = i%8;
    var y = Math.floor(i/8);

    var ranks = "87654321";
    var files = "abcdefgh";
    var squareName =  files.charAt(x)+ranks.charAt(y);
    var piece = this.state.arimaa.get_piece_on_square(squareName);

    var pieceName = numberToPieceName(piece);
    var p = pieceName != "" ? <Piece pieceName={pieceName}></Piece> : null

    var black = (x+y) % 2 === 1;
    var trap = (x === 2 || x === 5) && (y === 2 || y === 5);

    return (
      <div key={i} style={{width:'12.5%', height:'12.5%'}}>
        <Square black={black} trap={trap}>
          {p}
        </Square>
      </div>
    );
  },

  render: function() {
    var squares = [];
    for(var i=0;i<64;i++) {
      squares.push(this.renderSquare(i));
    }

    return (
      <div style={{width:'100%',height:'100%',display:'flex',flexWrap:'wrap'}}>
        {squares}
      </div>
    );
  }
});

module.exports = Board;
