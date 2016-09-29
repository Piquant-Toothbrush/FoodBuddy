'use strict';

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var d = c[i]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(b, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var SignUp = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    //
    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      errorMsg: '',
      successMsg: ''
    };
    return d;
  }

  _createClass(b, [{
    key: 'handleChange',
    value: function handleChange(c) {
      var d = c.target.value;
      switch (c.target.name) {
        case 'SignUpName':
          this.setState({
            username: d
          });
          break;
        case 'SignUpPassword':
          this.setState({
            password: d
          });
          break;
        case 'SignUpFirstname':
          this.setState({
            firstName: d
          });
          break;
        case 'SignUpLastname':
          this.setState({
            lastName: d
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
        var c = {
          name: this.state.username,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName
        };

        $.post('/signup', c).then(function (d) {
          //after signup should prompt user to select their favorite three movies
          _this2.setState({
            errorMsg: '',
            successMsg: 'new login created'
          });
          // console.log(this,' this')

          _this2.props.changeViews("Home");
          _this2.props.setCurrentUser(_this2.state.username);
        }).catch(function (d) {
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

  return b;
}(React.Component);

window.SignUp = SignUp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcC5qcyJdLCJuYW1lcyI6WyJTaWduVXAiLCJwcm9wcyIsInN0YXRlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiZXJyb3JNc2ciLCJzdWNjZXNzTXNnIiwiZXZlbnQiLCJ0YXIiLCJ0YXJnZXQiLCJ2YWx1ZSIsIm5hbWUiLCJzZXRTdGF0ZSIsImxlbmd0aCIsInVzZXJPYmoiLCIkIiwicG9zdCIsInRoZW4iLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiY2F0Y2giLCJoYW5kbGVDaGFuZ2UiLCJiaW5kIiwiZW50ZXJOZXdVc2VyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsTTs7O0FBRUosYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUVyQjtBQUZxQixrR0FDWEEsQ0FEVzs7QUFHakIsTUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGdCQUFVLEVBREM7QUFFWEMsZ0JBQVUsRUFGQztBQUdYQyxpQkFBVyxFQUhBO0FBSVhDLGdCQUFVLEVBSkM7QUFLWEMsZ0JBQVUsRUFMQztBQU1YQyxrQkFBWTtBQU5ELEtBQWI7QUFIaUI7QUFXbEI7Ozs7aUNBRVlDLEMsRUFBTztBQUNsQixVQUFNQyxJQUFNRCxFQUFNRSxNQUFOLENBQWFDLEtBQXpCO0FBQ0EsY0FBUUgsRUFBTUUsTUFBTixDQUFhRSxJQUFyQjtBQUNFLGFBQUssWUFBTDtBQUNBLGVBQUtDLFFBQUwsQ0FBYztBQUNaWCxzQkFBVU87QUFERSxXQUFkO0FBR0E7QUFDQyxhQUFLLGdCQUFMO0FBQ0QsZUFBS0ksUUFBTCxDQUFjO0FBQ1pWLHNCQUFVTTtBQURFLFdBQWQ7QUFHQTtBQUNDLGFBQUssaUJBQUw7QUFDRCxlQUFLSSxRQUFMLENBQWM7QUFDWlQsdUJBQVdLO0FBREMsV0FBZDtBQUdBO0FBQ0MsYUFBSyxnQkFBTDtBQUNELGVBQUtJLFFB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QUwsQ0FBa0JELElBQWxCLENBQXVCLElBQXZCLENBQXJEO0FBQUE7QUFBQTtBQWJGO0FBSEY7QUFQRixPQURBO0FBNEJEOzs7O0VBOUdrQkUsTUFBTUMsUzs7QUFrSDNCQyxPQUFPNUIsTUFBUCxHQUFnQkEsTUFBaEIiLCJmaWxlIjoiU2lnblVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2lnblVwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuLy9cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHVzZXJuYW1lOiAnJyxcclxuICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICBmaXJzdE5hbWU6ICcnLFxyXG4gICAgICBsYXN0TmFtZTogJycsXHJcbiAgICAgIGVycm9yTXNnOiAnJyxcclxuICAgICAgc3VjY2Vzc01zZzogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIGNvbnN0IHRhciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIHN3aXRjaCAoZXZlbnQudGFyZ2V0Lm5hbWUpe1xyXG4gICAgICBjYXNlICdTaWduVXBOYW1lJzpcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHRhclxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICAgICBjYXNlICdTaWduVXBQYXNzd29yZCc6XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBhc3N3b3JkOiB0YXJcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgICAgY2FzZSAnU2lnblVwRmlyc3RuYW1lJzpcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZmlyc3ROYW1lOiB0YXJcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgICAgY2FzZSAnU2lnblVwTGFzdG5hbWUnOlxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBsYXN0TmFtZTogdGFyXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGVudGVyTmV3VXNlcigpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwiZW51IGJlaW5nIHJ1blwiKTtcclxuICAgIGlmICghdGhpcy5zdGF0ZS51c2VybmFtZS5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZXJyb3JNc2c6ICdwbGVhc2UgZW50ZXIgYSB1c2VybmFtZSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLnBhc3N3b3JkLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciBhIHBhc3N3b3JkJ1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCB1c2VyT2JqID0geyBcclxuICAgICAgICBuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiB0aGlzLnN0YXRlLnBhc3N3b3JkLFxyXG4gICAgICAgIGZpcnN0TmFtZTogdGhpcy5zdGF0ZS5maXJzdE5hbWUsXHJcbiAgICAgICAgbGFzdE5hbWU6IHRoaXMuc3RhdGUubGFzdE5hbWVcclxuICAgICAgfTtcclxuXHJcbiAgICAgICQucG9zdCgnL3NpZ251cCcsIHVzZXJPYmopXHJcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAvL2FmdGVyIHNpZ251cCBzaG91bGQgcHJvbXB0IHVzZXIgdG8gc2VsZWN0IHRoZWlyIGZhdm9yaXRlIHRocmVlIG1vdmllc1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgZXJyb3JNc2c6ICcnLFxyXG4gICAgICAgICAgc3VjY2Vzc01zZzogJ25ldyBsb2dpbiBjcmVhdGVkJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMsJyB0aGlzJylcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5jaGFuZ2VWaWV3cyhcIkhvbWVcIik7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRDdXJyZW50VXNlcih0aGlzLnN0YXRlLnVzZXJuYW1lKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycj0+IHtcclxuICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGVycm9yTXNnOiAndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgcGxlYXNlIHVzZSBhIGRpZmZlcmVudCB1c2VybmFtZSdcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIFxyXG4gICAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSdsYW5kaW5nIHJvdyc+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdpY29uLWJsb2NrIGNvbCBzNyc+XHJcbiAgICAgICAgPGgyIGNsYXNzTmFtZT1cImhlYWRlciBsb2dvXCI+V2VsY29tZSB0byBSZWVsUGFsczwvaDI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cImhlYWRlciBjb2wgczEyIGxpZ2h0IGRlc2NyaXB0aW9uXCI+XHJcbiAgICAgICAgICBMZXQncyBmaW5kIHlvdXIgbmV4dCBidWRkeSBieSB5b3VyIG1vdmllIHRhc3RlIVxyXG4gICAgICAgIDwvaDU+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbG9naW4gaWNvbi1ibG9jayc+XHJcbiAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMuY2hhbmdlVmlld3MoJ0xvZ2luJyl9PkdvIHRvIExvZyBJbjwvYT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yXCI+T1I8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbG9naW5Gb3JtJz5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInVzZXJuYW1lXCIgaWQ9XCJ1c2VyX25hbWVcIiBuYW1lPSdTaWduVXBOYW1lJyB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInVzZXJfbmFtZVwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPlVzZXJuYW1lPC9sYWJlbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInBhc3N3b3JkXCIgaWQ9XCJwYXNzd29yZFwiIG5hbWU9J1NpZ25VcFBhc3N3b3JkJyB0eXBlPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwYXNzd29yZFwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPlBhc3N3b3JkPC9sYWJlbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+e3RoaXMuc3RhdGUuZXJyb3JNc2d9PC9kaXY+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17dGhpcy5lbnRlck5ld1VzZXIuYmluZCh0aGlzKX0+U2lnbiBVcCE8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+KVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbndpbmRvdy5TaWduVXAgPSBTaWduVXA7XHJcblxyXG5cclxuXHJcblxyXG4iXX0=