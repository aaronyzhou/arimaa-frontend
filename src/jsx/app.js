var React = require('react');
var Arimaa = require('./lib/arimaa.js');
var Board = require('./components/board.js');
var Movelist = require('./components/movelist.js');
var Game = require('./components/arimaa_game.js');

var Header = require('./components/header.js');
var Login = require('./components/login.js');


React.render(<Login/>, document.getElementById('board_container'));
//React.render(<Header/>, document.getElementById('board_container'));
