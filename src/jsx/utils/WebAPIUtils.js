var $ = require('jquery');


function POST(url, data, success, error) {
  $.ajax({type: 'POST',
    url: url,
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(data),
    success: function(data, textStatus, xhr) {
      console.log(data);
      success(data);
    },
    error: function(xhr, textStatus, err) {
      if(xhr.status === 400) {
        //authentication fail
        console.log('auth fail');
        //logout();
      }
    }
  });
}

function GET(url, data, success, error) {

}


var APIUtils = {
  register_bot: function(username, email, password) {
    //NOT YET IMPLEMENTED!
  },

  login: function(username, password, success, error) {
    POST('api/accounts/login', {username:username, password:password}, success, error);
  },

  register: function(username, email, password) {
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
