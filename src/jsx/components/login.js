var React = require('react');

var loginBox = React.createClass({
  getInitialState: function() {
    return {user: "", pass: ""};
  },
  handleUsernameChange: function(event) {
    this.setState({user: event.target.value});
  },
  handlePasswordChange: function(event) {
    this.setState({pass: event.target.value});
  },
  submitLogin: function(event) {
    event.preventDefault();
    alert("login");
  },

  render: function() {
    //var value = this.state.value;
    //return <input type="text" value={value} onChange={this.handleChange} />;
    return (
      <div>
        <div className="login">
          <h1>Login</h1>
          <form method="post" action="index.html">
            <input type="text" name="login" value={this.state.user} onChange={this.handleUsernameChange} placeholder="Username"/>
            <input type="password" name="password" value={this.state.pass} onChange={this.handlePasswordChange} placeholder="Password"/>
            <input type="submit" className="submit" name="commit" value="Login" onClick={this.submitLogin}/>
          </form>
                      <p><a href="index.html">Forgot Password?</a></p>
        </div>
      </div>
    )



  }
});

module.exports = loginBox;
