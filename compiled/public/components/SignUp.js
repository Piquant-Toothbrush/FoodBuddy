'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SignUp = function (_React$Component) {
  _inherits(SignUp, _React$Component);

  function SignUp(props) {
    _classCallCheck(this, SignUp);

    var _this = _possibleConstructorReturn(this, (SignUp.__proto__ || Object.getPrototypeOf(SignUp)).call(this, props));

    _this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      errorMsg: '',
      successMsg: ''
    };
    return _this;
  }

  _createClass(SignUp, [{
    key: 'handleChange',
    value: function handleChange(event) {
      var tar = event.target.value;
      switch (event.target.name) {
        case 'SignUpName':
          this.setState({
            username: tar
          });
          break;
        case 'SignUpPassword':
          this.setState({
            password: tar
          });
          break;
        case 'SignUpFirstname':
          this.setState({
            firstName: tar
          });
          break;
        case 'SignUpLastname':
          this.setState({
            lastName: tar
          });
          break;
      }
    }
  }, {
    key: 'enterNewUser',
    value: function enterNewUser() {
      var _this2 = this;

      // console.log("enu being run");
      if (!this.state.username.length) {
        this.setState({
          errorMsg: 'please enter a username'
        });
      } else if (!this.state.password.length) {
        this.setState({
          errorMsg: 'please enter a password'
        });
      } else {
        var userObj = {
          name: this.state.username,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName
        };

        $.post('/signup', userObj).then(function (response) {
          //after signup should prompt user to select their favorite three movies
          _this2.setState({
            errorMsg: '',
            successMsg: 'new login created'
          });
          // console.log(this,' this')

          _this2.props.changeViews("Home");
          _this2.props.setCurrentUser(_this2.state.username);
        }).catch(function (err) {
          console.log(err);
          _this2.setState({
            errorMsg: 'username already exist, please use a different username'
          });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return React.createElement(
        'div',
        { className: 'landing row' },
        React.createElement(
          'div',
          { className: 'icon-block col s7' },
          React.createElement(
            'h2',
            { className: 'header logo' },
            'Welcome to ReelPals'
          ),
          React.createElement(
            'h5',
            { className: 'header col s12 light description' },
            'Let\'s find your next buddy by your movie taste!'
          )
        ),
        React.createElement(
          'div',
          { className: 'login icon-block' },
          React.createElement(
            'a',
            { className: 'waves-effect waves-light btn', onClick: function onClick() {
                return _this3.props.changeViews('Login');
              } },
            'Go to Log In'
          ),
          React.createElement(
            'div',
            { className: 'or' },
            'OR'
          ),
          React.createElement(
            'div',
            { className: 'loginForm' },
            React.createElement(
              'div',
              { className: 'input-field col s6' },
              React.createElement('input', { placeholder: 'username', id: 'user_name', name: 'SignUpName', type: 'text', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { 'for': 'user_name', className: 'active' },
                'Username'
              )
            ),
            React.createElement(
              'div',
              { className: 'input-field col s6' },
              React.createElement('input', { placeholder: 'password', id: 'password', name: 'SignUpPassword', type: 'password', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { 'for': 'password', className: 'active' },
                'Password'
              )
            ),
            React.createElement(
              'div',
              { className: 'errorMsg' },
              this.state.errorMsg
            ),
            React.createElement(
              'a',
              { className: 'waves-effect waves-light btn', onClick: this.enterNewUser.bind(this) },
              'Sign Up!'
            )
          )
        )
      );
    }
  }]);

  return SignUp;
}(React.Component);

window.SignUp = SignUp;

// <div className="input-field col s6">
//   <input placeholder="last name" id="last_name" name='SignUpLastname' type="text" className="validate" onChange={this.handleChange.bind(this)}/>
//   <label for="last_name" className="active">last name</label>
// </div>


//    <div className="input-field col s6">
//   <input placeholder="first name" id="first_name" name='SignUpFirstname' type="text" className="validate" onChange={this.handleChange.bind(this)}/>
//   <label for="first_name" className="active">first name</label>
// </div>
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcC5qcyJdLCJuYW1lcyI6WyJTaWduVXAiLCJwcm9wcyIsInN0YXRlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiZXJyb3JNc2ciLCJzdWNjZXNzTXNnIiwiZXZlbnQiLCJ0YXIiLCJ0YXJnZXQiLCJ2YWx1ZSIsIm5hbWUiLCJzZXRTdGF0ZSIsImxlbmd0aCIsInVzZXJPYmoiLCIkIiwicG9zdCIsInRoZW4iLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwiZXJyIiwiaGFuZGxlQ2hhbmdlIiwiYmluZCIsImVudGVyTmV3VXNlciIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLE07OztBQUVKLGtCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsZ0hBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxnQkFBVSxFQURDO0FBRVhDLGdCQUFVLEVBRkM7QUFHWEMsaUJBQVcsRUFIQTtBQUlYQyxnQkFBVSxFQUpDO0FBS1hDLGdCQUFVLEVBTEM7QUFNWEMsa0JBQVk7QUFORCxLQUFiO0FBSGlCO0FBV2xCOzs7O2lDQUVZQyxLLEVBQU87QUFDbEIsVUFBTUMsTUFBTUQsTUFBTUUsTUFBTixDQUFhQyxLQUF6QjtBQUNBLGNBQVFILE1BQU1FLE1BQU4sQ0FBYUUsSUFBckI7QUFDRSxhQUFLLFlBQUw7QUFDQSxlQUFLQyxRQUFMLENBQWM7QUFDWlgsc0JBQVVPO0FBREUsV0FBZDtBQUdBO0FBQ0MsYUFBSyxnQkFBTDtBQUNELGVBQUtJLFFBQUwsQ0FBYztBQUNaVixzQkFBVU07QUFERSxXQUFkO0FBR0E7QUFDQyxhQUFLLGlCQUFMO0FBQ0QsZUFBS0ksUUFBTCxDQUFjO0FBQ1pULHVCQUFXSztBQURDLFdBQWQ7QUFHQTtBQUNDLGFBQUssZ0JB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QUFBO0FBQUEsZ0JBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTLEtBQUtxQixZQUFMLENBQWtCRCxJQUFsQixDQUF1QixJQUF2QixDQUFyRDtBQUFBO0FBQUE7QUFiRjtBQUhGO0FBUEYsT0FEQTtBQTRCRDs7OztFQTlHa0JFLE1BQU1DLFM7O0FBa0gzQkMsT0FBTy9CLE1BQVAsR0FBZ0JBLE1BQWhCOztBQUtBO0FBQ1U7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJTaWduVXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTaWduVXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHVzZXJuYW1lOiAnJyxcclxuICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICBmaXJzdE5hbWU6ICcnLFxyXG4gICAgICBsYXN0TmFtZTogJycsXHJcbiAgICAgIGVycm9yTXNnOiAnJyxcclxuICAgICAgc3VjY2Vzc01zZzogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIGNvbnN0IHRhciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIHN3aXRjaCAoZXZlbnQudGFyZ2V0Lm5hbWUpe1xyXG4gICAgICBjYXNlICdTaWduVXBOYW1lJzpcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHRhclxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICAgICBjYXNlICdTaWduVXBQYXNzd29yZCc6XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBhc3N3b3JkOiB0YXJcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgICAgY2FzZSAnU2lnblVwRmlyc3RuYW1lJzpcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZmlyc3ROYW1lOiB0YXJcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgICAgY2FzZSAnU2lnblVwTGFzdG5hbWUnOlxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBsYXN0TmFtZTogdGFyXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGVudGVyTmV3VXNlcigpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwiZW51IGJlaW5nIHJ1blwiKTtcclxuICAgIGlmICghdGhpcy5zdGF0ZS51c2VybmFtZS5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZXJyb3JNc2c6ICdwbGVhc2UgZW50ZXIgYSB1c2VybmFtZSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLnBhc3N3b3JkLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciBhIHBhc3N3b3JkJ1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCB1c2VyT2JqID0geyBcclxuICAgICAgICBuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiB0aGlzLnN0YXRlLnBhc3N3b3JkLFxyXG4gICAgICAgIGZpcnN0TmFtZTogdGhpcy5zdGF0ZS5maXJzdE5hbWUsXHJcbiAgICAgICAgbGFzdE5hbWU6IHRoaXMuc3RhdGUubGFzdE5hbWVcclxuICAgICAgfTtcclxuXHJcbiAgICAgICQucG9zdCgnL3NpZ251cCcsIHVzZXJPYmopXHJcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAvL2FmdGVyIHNpZ251cCBzaG91bGQgcHJvbXB0IHVzZXIgdG8gc2VsZWN0IHRoZWlyIGZhdm9yaXRlIHRocmVlIG1vdmllc1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgZXJyb3JNc2c6ICcnLFxyXG4gICAgICAgICAgc3VjY2Vzc01zZzogJ25ldyBsb2dpbiBjcmVhdGVkJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMsJyB0aGlzJylcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5jaGFuZ2VWaWV3cyhcIkhvbWVcIik7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRDdXJyZW50VXNlcih0aGlzLnN0YXRlLnVzZXJuYW1lKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycj0+IHtcclxuICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGVycm9yTXNnOiAndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgcGxlYXNlIHVzZSBhIGRpZmZlcmVudCB1c2VybmFtZSdcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIFxyXG4gICAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSdsYW5kaW5nIHJvdyc+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdpY29uLWJsb2NrIGNvbCBzNyc+XHJcbiAgICAgICAgPGgyIGNsYXNzTmFtZT1cImhlYWRlciBsb2dvXCI+V2VsY29tZSB0byBSZWVsUGFsczwvaDI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cImhlYWRlciBjb2wgczEyIGxpZ2h0IGRlc2NyaXB0aW9uXCI+XHJcbiAgICAgICAgICBMZXQncyBmaW5kIHlvdXIgbmV4dCBidWRkeSBieSB5b3VyIG1vdmllIHRhc3RlIVxyXG4gICAgICAgIDwvaDU+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbG9naW4gaWNvbi1ibG9jayc+XHJcbiAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMuY2hhbmdlVmlld3MoJ0xvZ2luJyl9PkdvIHRvIExvZyBJbjwvYT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yXCI+T1I8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbG9naW5Gb3JtJz5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInVzZXJuYW1lXCIgaWQ9XCJ1c2VyX25hbWVcIiBuYW1lPSdTaWduVXBOYW1lJyB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInVzZXJfbmFtZVwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPlVzZXJuYW1lPC9sYWJlbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInBhc3N3b3JkXCIgaWQ9XCJwYXNzd29yZFwiIG5hbWU9J1NpZ25VcFBhc3N3b3JkJyB0eXBlPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwYXNzd29yZFwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPlBhc3N3b3JkPC9sYWJlbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+e3RoaXMuc3RhdGUuZXJyb3JNc2d9PC9kaXY+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17dGhpcy5lbnRlck5ld1VzZXIuYmluZCh0aGlzKX0+U2lnbiBVcCE8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+KVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbndpbmRvdy5TaWduVXAgPSBTaWduVXA7XHJcblxyXG5cclxuXHJcblxyXG4vLyA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxyXG4gICAgICAgICAgLy8gICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJsYXN0IG5hbWVcIiBpZD1cImxhc3RfbmFtZVwiIG5hbWU9J1NpZ25VcExhc3RuYW1lJyB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgIC8vICAgPGxhYmVsIGZvcj1cImxhc3RfbmFtZVwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPmxhc3QgbmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICAvLyA8L2Rpdj5cclxuXHJcblxyXG4gICAgICAgICAgLy8gICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cclxuICAgICAgICAgIC8vICAgPGlucHV0IHBsYWNlaG9sZGVyPVwiZmlyc3QgbmFtZVwiIGlkPVwiZmlyc3RfbmFtZVwiIG5hbWU9J1NpZ25VcEZpcnN0bmFtZScgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAvLyAgIDxsYWJlbCBmb3I9XCJmaXJzdF9uYW1lXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+Zmlyc3QgbmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICAvLyA8L2Rpdj4iXX0=