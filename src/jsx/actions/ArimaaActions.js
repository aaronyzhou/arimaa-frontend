var ArimaaDispatcher = require('../dispatcher/ArimaaDispatcher.js');
var ArimaaConstants = require('../constants/ArimaaConstants.js')

var ArimaaActions = {
  clickSquare: function(sqNum, sqName) {
    ArimaaDispatcher.dispatch({
      actionType: ArimaaConstants.ACTIONS.GAME_CLICK_SQUARE,
      squareNum: sqNum,
      squareName: sqName
    });
  },

  undoStep: function() {
    ArimaaDispatcher.dispatch({
      actionType: ArimaaConstants.ACTIONS.GAME_UNDO_STEP
    })
  },

  addStep: function(stepString) {
    ArimaaDispatcher.dispatch({
      actionType: ArimaaConstants.ACTIONS.GAME_ADD_STEP,
      text: stepString
    });
  },

  completeMove: function() {
    ArimaaDispatcher.dispatch({
      actionType: ArimaaConstants.ACTIONS.GAME_COMPLETE_MOVE
    });
  },

  viewPrevBoardState: function(plyNum) {

  }

};

module.exports = ArimaaActions;
