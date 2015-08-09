var $ = require('jquery');


function POST(url, data, success, error) {
  $.ajax({type: 'POST',
    url: url,
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(data),
    success: success,
    error: error
  });
}

function GET(url, data, success, error) {

}


var APIUtils = {
  bot_register_request: function(username, email, password) {
    //NOT YET IMPLEMENTED!
  },

  register_request: function(username, email, password) {
    POST('api/accounts/register', {username:username, email:email, password:password,isBot:false}, function(){}, function(){});
  },

  complete_move: function() {
    $.ajax({
      type : 'POST',
      url : 'api/game/12345/complete', //CHANGE THIS!!!!!!!!!!!!!!
      contentType: "application/json; charset=utf-8",
      dataType : 'json',
      data : JSON.stringify({username:this.state.username,auth:this.state.auth,text:comment}),
      success : function(data) {
        //console.log("post chat success",data);
        if(data.error) {
          alert(data.error);
        } else {
          console.log("no error");
        }
      });
  },
  do_something_else: 0
}


module.exports = APIUtils;
