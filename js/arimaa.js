var Arimaa = function(options) {
	//Constants
	var GOLD = 0;
	var SILVER = 1;

 	var SQUARES = {
      a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
      a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
      a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
      a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
      a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
      a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
      a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
      a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
 	};

	var EMPTY = 0;
	var GRABBIT = 1;
	var GCAT = 2;
	var GDOG = 3;
	var GHORSE = 4;
	var GCAMEL = 5;
	var GELEPHANT = 6;
	var COLOR = 8;
	var SRABBIT = 9;
	var SCAT = 10;
	var SDOG = 11;
	var SHORSE = 12;
	var SCAMEL = 13;
	var SELEPHANT = 14;
	var COUNT = 15;
	var PIECES = " RCDHME  rcdhme"

	const DIRECTIONS = {
		NORTH:-16,
		EAST:1,
		WEST:-1,
		SOUTH:16,
		'-16':'n',
		'1':'e',
		'-1':'w',
		'16':'s'
	};

	var DECOLOR = ~0x8;

	const Piece = {
	  EMPTY: 0,
	  GRABBIT: 1,
	  GCAT: 2,
	  GDOG: 3,
	  GHORSE: 4,
	  GCAMEL: 5,
	  GELEPHANT: 6,
	  COLOR: 8,
	  SRABBIT: 9,
	  SCAT: 10,
	  SDOG: 11,
	  SHORSE: 12,
	  SCAMEL: 13,
	  SELEPHANT: 14,
	  COUNT: 15,
	  PCHARS: " RCDHMExxrcdhme",
	  DECOLOR: ~0x8, // ~COLOR
	};

	var options = options || {
		fen: "8/8/8/8/8/8/8/8",
		moveNumber:1,
		colorToMove:GOLD,
		inPush:false,
		stepsLeft:4,
		ongoingMove:[],
		history:[],
	};

	var fen = options['fen'] || "8/8/8/8/8/8/8/8";
	var board = new Array(128);
	for(var i=0;i<128;i++) {board[i] = 0;}

	parse_fen(fen);
	
	var history = options['history'] || []; //nb empty array is truthy
	var ongoingMove = options['ongoingMove'] || [];
	var moveNumber = options['moveNumber'] || 1; 
	var colorToMove = GOLD || options['colorToMove']; //GOLD == 0 is falsey

	//need to do this since 0 is falsey
	//though we probably never need to consider starting a position
	//where the player has 0 steps left
	var stepsLeft = 4;
	if(options['stepsLeft'] != undefined) {
		stepsLeft = options['stepsLeft'];
	}

	//don't want to default to undefined
	var inPush = false || options['inPush'];



	//returns true if move can be completed
	//reasons for false:position same, 3x repetition
	function complete_move() {

	}


	//move is a list of steps
	function add_move(move) {
		for(var i=0;i<move.length;i++) {
			step = move[i];

			console.log(step);
		}
	}

	//assumes valid square_num
	function get_neighboring_pieces(squareNum) {
		var pieces = [];
		var npiece = get_piece_on_square(squareNum+DIRECTIONS.NORTH);
		var spiece = get_piece_on_square(squareNum+DIRECTIONS.SOUTH);
		var epiece = get_piece_on_square(squareNum+DIRECTIONS.EAST);
		var wpiece = get_piece_on_square(squareNum+DIRECTIONS.WEST);

		if(npiece) pieces.push({piece:npiece,offset:DIRECTIONS.NORTH});
		if(spiece) pieces.push({piece:spiece,offset:DIRECTIONS.SOUTH});
		if(epiece) pieces.push({piece:epiece,offset:DIRECTIONS.EAST});
		if(wpiece) pieces.push({piece:wpiece,offset:DIRECTIONS.WEST});

		return pieces;
	}

	//doesn't take into account who's turn to move, only color of piece on square
	//maybe change it later?
	function is_frozen(squareNum) {
		var piece = get_piece_on_square(squareNum);
		if(piece === EMPTY) {return false;}

		var neighbors = get_neighboring_pieces(squareNum);
		var nextToLargerEnemy = false;
		for(var i=0;i<neighbors.length;i++) {
			var neighbor = neighbors[i]['piece'];
			if((piece & COLOR) === (neighbor & COLOR)) {
				return false;
			} else if( (neighbor & DECOLOR) > (piece & DECOLOR)  ) {
				nextToLargerEnemy = true;
			}

		}
		return nextToLargerEnemy;
	}

	function is_adjacent_to(squareNum, otherSquareNum) {
		var d = squareNum - otherSquareNum;
		return (d==DIRECTIONS.NORTH) || (d==DIRECTIONS.SOUTH) 
								 || (d==DIRECTIONS.EAST)
								 || (d==DIRECTIONS.WEST);
	}

	/************************************
	 * can_be_pushed and can_be_pulled are only dependent on color;
	 * no checks on steps left, inPush, etc
	 ***********************************/
	function can_be_pushed(squareNum) {
		var piece = board[squareNum];
		if(piece === EMPTY) return false;
		if(((piece & COLOR)>>3) == colorToMove) return false;
		if(inPush) return false;
		var neighbors = get_neighboring_pieces(squareNum);
		for(var i=0;i<neighbors.length;i++) {
			var neighbor = neighbors[i];
			if( ((neighbor['piece'] & COLOR) != (piece & COLOR)) //different color, & has higher precedence than !=
				&& (!is_frozen(squareNum+neighbor['offset'])) //frozen pieces can't push
                && ((neighbor['piece'] & DECOLOR) > (piece & DECOLOR)) //must be a heavier piece
			) {
				return true;
			}
		}
		return false;
	}

	//TEST THIS FUNCTION
	function can_be_pulled(squareNum) {
		var piece = board[squareNum];
		if(piece === EMPTY) return false;
		if(((piece & COLOR)>>3) == colorToMove) return false;
		if(ongoingMove.length == 0) return false;
		if(inPush) return false;
		var prevStep = ongoingMove[ongoingMove.length-1];
		var prevSquare = prevSquare['location'];
		var pullingPiece = prevSquare['piece'];
		if(!is_adjacent_to(squareNum, prevSquare)) return false;
		if((pullingPiece & DECOLOR) == (piece & DECOLOR)) return false; //this check could be better?
		return (pullingPiece & DECOLOR) > (piece & DECOLOR);
	}

	//returns all possible steps from current position
	function generate_steps() {
		var steps = [];
		//for all piece on board
		//  stepsForPiece = steps_for_piece(piece)
		//  steps.append(stepsForPiece)
		return steps;
	}

	//currently assumes valid square
	function generate_steps_for_piece_on_square(squareNum) {
		var piece = board[squareNum];
		var steps = [];
		if(piece === EMPTY || stepsLeft === 0) {
			return steps;
		}
		var prevMove = null;
		if(ongoingMove.length > 0) {
			prevMove = ongoingMove[ongoingMove.length-1];
		}

		//same color
		if((piece & COLOR) >> 3 == colorToMove && !is_frozen(squareNum)) {
			if ((((squareNum + DIRECTIONS.NORTH) & 0x88) === 0) && (board[squareNum+DIRECTIONS.NORTH] === EMPTY))
				steps.push({piece:piece,square:squareNum,direction:'n'});
			if ((((squareNum + DIRECTIONS.SOUTH) & 0x88) === 0) && (board[squareNum+DIRECTIONS.SOUTH] === EMPTY))
				steps.push({piece:piece,square:squareNum,direction:'s'});
			if ((((squareNum + DIRECTIONS.EAST) & 0x88) === 0) && (board[squareNum+DIRECTIONS.EAST] === EMPTY))
				steps.push({piece:piece,square:squareNum,direction:'e'});
			if ((((squareNum + DIRECTIONS.WEST) & 0x88) === 0) && (board[squareNum+DIRECTIONS.WEST] === EMPTY))
				steps.push({piece:piece,square:squareNum,direction:'w'});
		} else { //enemy piece

		}
		return steps;
	}


	//must be valid piece string and square string
	//square must be empty
	function place_piece(piece, square) {
		if(!(square in SQUARES)) return false;
		if(piece == " ") return false;
		if(PIECES.indexOf(piece) == -1) return false;
		if(board[SQUARES[square]]) return false;
		board[SQUARES[square]] = piece;
		return true;
	}

	//returns the piece removed
	//returns null for invalid square and EMPTY for empty square
	function remove_piece_from_square(square) {
		if(!(square in SQUARES)) {return null;}
		var p = get_piece_on_square(square);
		board[SQUARES[square]] = EMPTY;
		return p;
	}

	//supports short fens generated by http://arimaa.com/arimaa/notconv/old/boardtools.php
	//example: http://arimaa.com/arimaa/notconv/old/boardimg.php?orient=s&size=500&imgtype=jpeg&ranks=1rr1r1rr/1d3c/3c//1H1r1Ehd/1M1e2DC/RRrRRDRR/2hR1R
	function parse_fen(fen) {
		var b = new Array(128);
		for(var i=0;i<128;i++) {b[i] = 0;}
		if(fen.charAt(0) == '/') {
    		fen = '/'+fen;
		}
		if(fen.charAt(fen.length-1) == '/') {
			fen += '/';
		}
		while(fen.indexOf('//') != -1) {
	    	fen = fen.replace('//','/8/');
		}

		var i=0;
		var index=0;
		while(i<64 && index < fen.length) {
			var x = i % 8;
			var y = Math.floor(i/8);
			var c = fen.charAt(index);

			index++;

			var p = PIECES.indexOf(c);
			var n = '12345678'.indexOf(c);

			if(c == '/') {
				i = Math.floor((i-1)/8)*8+8;
			} else if(p != -1) {
				b[16*y+x] = p;
				i++;
			} else if(n != -1) {
				i+=n+1;
			}
		}
		board = b;
		return b;
    }

    function generate_fen() {
		var empty = 0;
		var fen = '';

		for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
			if (board[i] === EMPTY) {
				empty++;
			} else {
				if (empty > 0) {
					fen += empty;
					empty = 0;
				}
				var piece = board[i];
				fen += PIECES.charAt(piece);
  			}

			if ((i + 1) & 0x88) {
				if (empty > 0) {
					fen += empty;
    			}

				if (i !== SQUARES.h1) {
					fen += '/';
				}
				empty = 0;
				i += 8;
			}
		}
		return fen;
    }

	function is_goal() {
		var gGoal = false;
	  	for (var ix = 0x70; ix < 0x78; ix++) {
	    	if (board[ix] == Piece.GRABBIT) { gGoal = true; break }
	  	}
	  	var sGoal = false;
	  	for (var ix = 0; ix < 8; ix++) {
	    	if (board[ix] == Piece.SRABBIT) { sGoal = true; break }
	  	}
	  	if (gGoal || sGoal) {
	    	if (this.color == Color.GOLD) {
	      		if (sGoal) { return -1 } else { return 1 }
	    	} else {
	      		if (gGoal) { return 1 } else { return -1 }
	    	}
	  	} else {
	    	return false;
	  	}
	}

	function get_piece_on_square(squareNum) {
		if(squareNum & 0x88) return false;
		return board[squareNum];
	}

	function ascii() {
		var s = ' +-----------------+\n';
		var row = "87654321";
		var file = "abcdefgh";
		for(var i=0;i<8;i++) {
			s += row[i] + "| ";
			for(var j=0;j<8;j++) {
				var sq = file[j] + row[i];
				s += PIECES.charAt(get_piece_on_square(SQUARES[sq]));
				s += " ";
			}
			s += "|\n";
		}
		s += ' +-----------------+\n';
        s += '   a b c d e f g h\n';
        return s;
	}


	return {


		/*
			The order of checking for win/lose conditions is as follows assuming player A just made the move and player B now needs to move:
			Check if a rabbit of player A reached goal. If so player A wins.
			Check if a rabbit of player B reached goal. If so player B wins.
			Check if player B lost all rabbits. If so player A wins.
			Check if player A lost all rabbits. If so player B wins.
			Check if player B has no possible move (all pieces are frozen or have no place to move). If so player A wins.
			Check if the only moves player B has are 3rd time repetitions. If so player A wins.
		*/
		is_goal: function() {
			return is_goal();
		},

		is_frozen: function(square) {
			return is_frozen(square);
		},

		add_move: function(move) {
			return add_move(move);
		},

		is_game_over: function() {
			return false;
		},

		//probably should rename one of these functions
		set_position: function(fen) {
			return parse_fen(fen);
		},

		//probably rename this later too
		get_fen: function() {
			return generate_fen();
		},

		can_be_pushed: function(squareNum) {
			return can_be_pushed(squareNum);
		},	

		get_turn_num: function() {
      		return "1g";
    	},

    	generate_steps_for_piece_on_square: function(squareNum) {
			return generate_steps_for_piece_on_square(squareNum);
    	},

    	get_piece_on_square: function(squareNum) {
    		return get_piece_on_square(squareNum);
    	},

    	ascii: function() {
    		return ascii();
    	},

    	clear: function() {
    		return null;
    	},


	};
};


if (typeof exports !== 'undefined') exports.Arimaa = Arimaa;
/* export Chess object for any RequireJS compatible environment */
if (typeof define !== 'undefined') define( function () { return Arimaa;  });



/*

use these later?

var ArimaaPiece = function(weight, color, location) {
	function isHeavierThan(other) {
		return weight > other['weight'];
	}

	return {weight:weight, color:color, location:location};
}

//E e4 n, + flags for push/pull
var ArimaaStep = function(piece, from, direction, special) {
	return {piece:piece, from:from, direction:direction, special:special};
}

var DIRECTIONS = {
	'n':-16,
	's':16,
	'e':1,
	'w':-1
}


*/
