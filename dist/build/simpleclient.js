//OLD CLIENT

document.addEventListener("DOMContentLoaded", startGame, false);
//document.addEventListener("keydown", doKeyDown, true);
var tiles = new Image();
tiles.src = "../images/animals.png";
var arrows = new Image();
arrows.src = "../images/tiles.png";

var canvas;
var ctx;
var offsetLeft;
var offsetTop;
//tracks mouse pointer
var prevX = -1;
var prevY = -1;
//tracks the previous piece mouse was over
var prevPieceX = -1;
var prevPieceY = -1;
//square a opponent's piece was pushed from or can be pulled to
var pSquareX = -1;
var pSquareY = -1;
var pullingPiece = 0;
var pushedPiece = 0;

var moveList = [];
var previousGamestates = [];
var currentTurnNumber = 0;
var currentMove = [];
var currentMoveStepsTaken = 0;
var myColor = -1; //1 = silver, -1 = gold
var needToCompletePush = false;
var canPull = false;


var solution = [];

var view = 'south'; //north, east, south, west


var gameState = "animals"; //????
var boardArray = [[1,1,1,1,1,1,1,1],
                  [2,3,4,5,6,4,3,2],
                  [0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0],
                  [-2,-3,-4,-5,-6,-4,-3,-2],
                  [-1,-1,-1,-1,-1,-1,-1,-1]];



function startGame() {
  gameState = "title";
  canvas = document.getElementById('board');
  ctx = document.getElementById('board').getContext('2d');

  var sendButton = document.getElementById('send_button');
  sendButton.addEventListener("click", function(evt) {
    //alert(currentMove);
    moveList.push(currentMove);
    addToMoveList();

    needToCompletePush = false;
    currentMove = [];
    currentMoveStepsTaken = 0;
    myColor = -myColor;
  }, true)


  offsetLeft = canvas.offsetLeft;
  offsetTop = canvas.offsetTop;
  canvas.addEventListener("mousemove",onMouseMove, true);
  canvas.addEventListener("click", onMouseClick, true);
  canvas.addEventListener("mouseout", onMouseOut, true);
  renderBoard();

  addToMoveList();
}

function checkSolution() {
  if(solution.length != currentMove.length) {
    return false;
  }
  for(var i=0;i<solution.length;i++) {
    if (solution[i] != currentMove[i]) {return false;}
  }
  return true;
}

function getPieceInital(p) {
  return ['E','M','H','D','C','R','','r','c','d','h','m','e'][p+6];
}

function getSquareName(x, y) {
  return 'abcdefgh'.charAt(x)+(8-y);
}

function onMouseOut(evt) {
  renderBoard();
  prevX = -1;
  prevY = -1;
  prevPieceX = -1;
  prevPieceY = -1;
}

//assumes there is a piece on x, y
function isFrozen(x, y) {
  var piece = boardArray[y][x];
  if(!piece) return 0;
  var color = 2*(piece > 0)-1;
  var nextToBigEnemy = 0;
  var nextToFriendly = 0;
  nextToFriendly = nextToFriendly || (y>0 && (boardArray[y-1][x]*piece > 0))
                                  || (y<7 && (boardArray[y+1][x]*piece > 0))
                                  || (x>0 && (boardArray[y][x-1]*piece > 0))
                                  || (x<7 && (boardArray[y][x+1]*piece > 0));
  nextToBigEnemy = nextToBigEnemy || (y>0 && !((boardArray[y-1][x]+piece)*color >= 0))
                                  || (y<7 && !((boardArray[y+1][x]+piece)*color >= 0))
                                  || (x>0 && !((boardArray[y][x-1]+piece)*color >= 0))
                                  || (x<7 && !((boardArray[y][x+1]+piece)*color >= 0));
  return nextToBigEnemy && !nextToFriendly;
}

function canBePushed(x, y) {
  if(currentMoveStepsTaken > 2) return 0;
  if(needToCompletePush) return 0;

  try {
    var piece = boardArray[y][x];
  } catch(e) {
    //console.log("push:" + x+","+y);
  }
  if(!piece) return false;
  if(piece*myColor > 0) return false; //can only push opponent's pieces

  var color = 2*(piece > 0)-1;
  return (y>0 && !((boardArray[y-1][x]+piece)*color >= 0) && !isFrozen(x, y-1))
      || (y<7 && !((boardArray[y+1][x]+piece)*color >= 0) && !isFrozen(x, y+1))
      || (x>0 && !((boardArray[y][x-1]+piece)*color >= 0) && !isFrozen(x-1, y))
      || (x<7 && !((boardArray[y][x+1]+piece)*color >= 0) && !isFrozen(x+1, y));
}

function canBePulled(x, y) {
  //console.log(x+","+y);
  if(!canPull) return false;
  var piece = boardArray[y][x];
  if(!piece) return false;
  if(piece*myColor > 0) return false;
  if((piece+pullingPiece)*myColor <= 0) return false;
  return (Math.abs(x-pSquareX)+Math.abs(y-pSquareY) == 1);
}

function onMouseClick(evt) {
  if(currentMoveStepsTaken == 4) return;

  var x = Math.floor((evt.pageX-offsetLeft)/40);
  var y = Math.floor((evt.pageY-offsetTop)/40);
  var piece = boardArray[prevPieceY][prevPieceX];

  //need to complete push but clicked square that didn't
  if(needToCompletePush && (pSquareX != x || pSquareY != y || !Math.abs(piece)>Math.abs(pushedPiece))) return; 

  var validPush = canBePushed(prevPieceX,prevPieceY);
  var validPull = canBePulled(prevPieceX,prevPieceY);

  //pushing opponent piece
  if(Math.abs(x-prevPieceX) + Math.abs(y-prevPieceY) == 1 && validPush || validPull) {
    var step = getPieceInital(boardArray[prevPieceY][prevPieceX]).concat(getSquareName(prevPieceX,prevPieceY));

    canPull = false;
    pushedPiece = piece;
    boardArray[y][x] = piece;
    boardArray[prevPieceY][prevPieceX] = 0;
    renderBoard();    

    if(x-prevPieceX == 1) {
      step = step.concat('e');
    } else if (x-prevPieceX == -1) {
      step = step.concat('w');
    } else if (y-prevPieceY == 1) {
      step = step.concat('s');
    } else if (y-prevPieceY == -1) {
      step= step.concat('n');
    }

    //pull if possible
    if(!validPull) {
      needToCompletePush = true;
    }

    currentMove.push(step);
    currentMoveStepsTaken += 1;

    pSquareY = prevPieceY;
    pSquareX = prevPieceX;

    prevPieceY = y;
    prevPieceX = x;
  }

  //moving one of your pieces 
  //rabbits can't move backwards
  if(piece*(y-prevPieceY) != -1 && Math.abs(x-prevPieceX) + Math.abs(y-prevPieceY) == 1 && !boardArray[y][x] && !isFrozen(prevPieceX,prevPieceY)) { 

    if(needToCompletePush) {
      needToCompletePush = false;
      canPull = false;
    } else {
      pSquareX = prevPieceX;
      pSquareY = prevPieceY; //where the piece was before moving
      canPull = true;
      pullingPiece = boardArray[prevPieceY][prevPieceX];
    }

    var step = getPieceInital(boardArray[prevPieceY][prevPieceX]).concat(getSquareName(prevPieceX,prevPieceY));

    boardArray[y][x] = boardArray[prevPieceY][prevPieceX];
    boardArray[prevPieceY][prevPieceX] = 0;
    renderBoard();
    if(!isFrozen(x,y) && currentMoveStepsTaken != 3) {
      if(piece != 1 && y > 0 && !boardArray[y-1][x]) {
        ctx.drawImage(arrows, 0, 13*40, 40, 40, 40*x, 40*y-40, 40, 40);
      } 
      if(piece != -1 && y < 7 && !boardArray[y+1][x]) {
        ctx.drawImage(arrows, 0, 14*40, 40, 40, 40*x, 40*y+40, 40, 40);
      }
      if(x > 0 && !boardArray[y][x-1]) {
        ctx.drawImage(arrows, 0, 15*40, 40, 40, 40*x-40, 40*y, 40, 40);
      } 
      if(x < 7 && !boardArray[y][x+1]) {
        ctx.drawImage(arrows, 0, 12*40, 40, 40, 40*x+40, 40*y, 40, 40);
      }
    }
    
    if(x-prevPieceX == 1) {
      step = step.concat('e');
    } else if (x-prevPieceX == -1) {
      step = step.concat('w');
    } else if (y-prevPieceY == 1) {
      step = step.concat('s');
    } else if (y-prevPieceY == -1) {
      step = step.concat('n');
    }

    currentMove.push(step);
    currentMoveStepsTaken += 1;

    prevPieceY = y;
    prevPieceX = x;
  } 

  removeTrappedPieces();
}

function onMouseMove(evt) {
  if (currentMoveStepsTaken == 4) return;

  var x = Math.floor((evt.pageX-offsetLeft)/40);
  var y = Math.floor((evt.pageY-offsetTop)/40);
  var piece = boardArray[y][x];
  if(x != prevX || y != prevY) {
    //clear movement arrows if we move cursor away from a piece
    if(Math.abs(x-prevPieceX) + Math.abs(y-prevPieceY) > 1) {
      renderBoard();
      prevPieceX = -1;
      prevPieceY = -1;
    }

    //pulls
    if(canBePulled(x,y)) {
      renderBoard();
      if(y > 0 && !boardArray[y-1][x] && (pSquareX==x && pSquareY==y-1)) {
        ctx.drawImage(arrows, 0, 13*40, 40, 40, 40*x, 40*y-40, 40, 40);
      } 
      if(y < 7 && !boardArray[y+1][x] && (pSquareX==x && pSquareY==y+1)) {
        ctx.drawImage(arrows, 0, 14*40, 40, 40, 40*x, 40*y+40, 40, 40);
      }
      if(x > 0 && !boardArray[y][x-1] && (pSquareX==x-1 && pSquareY==y)) {
        ctx.drawImage(arrows, 0, 15*40, 40, 40, 40*x-40, 40*y, 40, 40);
      } 
      if(x < 7 && !boardArray[y][x+1] && (pSquareX==x+1 && pSquareY==y)) {
        ctx.drawImage(arrows, 0, 12*40, 40, 40, 40*x+40, 40*y, 40, 40);
      }
      prevPieceY = y;
      prevPieceX = x;
    } else if((boardArray[y][x]*myColor > 0 && !isFrozen(x,y)) || canBePushed(x,y)) {
      renderBoard();
      if(piece != 1 && y > 0 && !boardArray[y-1][x] && (!needToCompletePush || (pSquareX==x && pSquareY==y-1 && Math.abs(piece)>Math.abs(pushedPiece)))) {
        ctx.drawImage(arrows, 0, 13*40, 40, 40, 40*x, 40*y-40, 40, 40);
      } 
      if(piece != -1 && y < 7 && !boardArray[y+1][x] && (!needToCompletePush || (pSquareX==x && pSquareY==y+1 && Math.abs(piece)>Math.abs(pushedPiece)))) {
        ctx.drawImage(arrows, 0, 14*40, 40, 40, 40*x, 40*y+40, 40, 40);
      }
      if(x > 0 && !boardArray[y][x-1] && (!needToCompletePush || (pSquareX==x-1 && pSquareY==y && Math.abs(piece)>Math.abs(pushedPiece)))) {
        ctx.drawImage(arrows, 0, 15*40, 40, 40, 40*x-40, 40*y, 40, 40);
      } 
      if(x < 7 && !boardArray[y][x+1] && (!needToCompletePush || (pSquareX==x+1 && pSquareY==y && Math.abs(piece)>Math.abs(pushedPiece)))) {
        ctx.drawImage(arrows, 0, 12*40, 40, 40, 40*x+40, 40*y, 40, 40);
      }
      prevPieceY = y;
      prevPieceX = x;
    }
    prevX = x;
    prevY = y;
  }
}

//TODO: Add animation for removing trapped pieces
function removeTrappedPieces() {
  traps = [[2,2],[2,5],[5,2],[5,5]];
  for(var i=0;i<4;i++) {
    var tx = traps[i][0];
    var ty = traps[i][1];
    var trappedPiece = boardArray[ty][tx];
    if(trappedPiece && !(boardArray[ty-1][tx]*trappedPiece > 0
                      || boardArray[ty+1][tx]*trappedPiece > 0 
                      || boardArray[ty][tx-1]*trappedPiece > 0
                      || boardArray[ty][tx+1]*trappedPiece > 0)) {
      step = getPieceInital(trappedPiece)+getSquareName(tx, ty)+"x";
      currentMove.push(step);
      boardArray[ty][tx] = 0;
      renderBoard();
    }
  }
}

//RENAME TOO? chooseMoveFromMovelist?
function chooseMove(i) {
  var rows = document.getElementById('moveList').rows;
  rows[currentTurnNumber+1].className = "";
  rows[i+1].className = "selected";
  currentTurnNumber = i;
}

//used for javascirpt block scoping thing
function createFun(i) {
  return function() {chooseMove(i);};
}

//RENAME THIS FUNCTION!!!
function addToMoveList() {
  var tableRef = document.getElementById('moveList').getElementsByTagName('tbody')[0];
  tableRef.innerHTML = "";

  var turn = "g";
  var turnNum = 1;
  for(var i=0;i<moveList.length;i++) {

    var newRow  = tableRef.insertRow(tableRef.rows.length);

    newRow.addEventListener("click", createFun(i), true);

    if(i == currentTurnNumber) {
      newRow.className = "selected";
    }

    var newCell  = newRow.insertCell(0);
    var c = newRow.insertCell(1);

    var newText  = document.createTextNode(turnNum + turn);
    var t = document.createTextNode(moveList[i]);

    if(turn == "g") {
      turn = "s";
    } else {
      turn = "g";
      turnNum += 1;
    }

    newCell.appendChild(newText);
    c.appendChild(t);
  }
}

function renderBoard() {
  var r;
  for(var i=0;i<8;i++) {
    for(var j=0;j<8;j++) {
      if ((i == 2 || i == 5) && (j == 2 || j == 5)) {
        ctx.fillStyle = 'rgb(52,40,40)';
      } else if(!((i+j)%2)) {
        ctx.fillStyle = 'rgb(96,100,104)';
      } else {
        ctx.fillStyle = 'rgb(64,70,70)';
      }
      ctx.fillRect(40*i,40*j, 40, 40);

      c = boardArray[j][i];
      if(c > 0) {
        ctx.drawImage(tiles, 0, (c-1)*40,40,40,40*i,40*j,40,40);
      } else if(c < 0) {
        ctx.drawImage(tiles, 0, (c+12)*40,40,40,40*i,40*j,40,40);
      }
    }
  }
}