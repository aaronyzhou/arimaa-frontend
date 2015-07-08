var React = require('./lib/react.js');
var Arimaa = require('./lib/arimaa.js');
var Board = require('./board.js');

var arimaa = new Arimaa();
arimaa.set_position("3/8/3R4/3r4/8/8/8/8");

React.render(<Board arimaa={arimaa}/>, document.getElementById('board_container'));
