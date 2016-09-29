'use strict';

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var d = c[i]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(b, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var LogIn = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      username: '',
      password: '',
      errorMsg: ''
    };
    return d;
  }

  _createClass(b, [{
    key: 'handleChange',
    value: function handleChange(c) {
      var d = c.target.value;
      if (c.target.name === 'LogInName') {
        this.setState({
          username: d
        });
      } else {
        this.setState({
          password: d
        });
      }
    }
  }, {
    key: 'handleLogIn',
    value: function handleLogIn() {
      var _this2 = this;

      if (!this.state.username.length && !this.state.password.length) {
        this.setState({
          errorMsg: 'login is empty'
        });
      } else if (!this.state.username.length) {
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
          password: this.state.password
        };

        $.post(Url + '/login', c).then(function (d) {
          if (d[0] === 'it worked') {
            // console.log('hi');

            _this2.setState({
              errorMsg: ''
            });

            _this2.props.changeViews('Home');
            _this2.props.setCurrentUser(d[1]);
          }
          // console.log('this.state.view after state is set again',this.state.view);
        }).catch(function (d) {
          // console.log(err);
          _this2.setState({
            errorMsg: 'invalid login information'
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
                return _this3.props.changeViews('SignUp');
              } },
            'Go to Sign Up'
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
              React.createElement('input', { placeholder: 'username', id: 'user_name', name: 'LogInName', type: 'text', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { htmlFor: 'user_name', className: 'active' },
                'Username'
              )
            ),
            React.createElement(
              'div',
              { className: 'input-field col s6' },
              React.createElement('input', { placeholder: 'password', id: 'password', name: 'LogInPassword', type: 'password', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { htmlFor: 'password', className: 'active' },
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
              { className: 'waves-effect waves-light btn', onClick: this.handleLogIn.bind(this) },
              'log in'
            )
          )
        )
      );
    }
  }]);

  return b;
}(React.Component);

window.LogIn = LogIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0xvZ0luLmpzIl0sIm5hbWVzIjpbIkxvZ0luIiwicHJvcHMiLCJzdGF0ZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJlcnJvck1zZyIsImV2ZW50IiwidGFyIiwidGFyZ2V0IiwidmFsdWUiLCJuYW1lIiwic2V0U3RhdGUiLCJsZW5ndGgiLCJ1c2VyT2JqIiwiJCIsInBvc3QiLCJVcmwiLCJ0aGVuIiwicmVzcG9uc2UiLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiY2F0Y2giLCJoYW5kbGVDaGFuZ2UiLCJiaW5kIiwiaGFuZGxlTG9nSW4iLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxLOzs7QUFFSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBR2pCLE1BQUtDLEtBQUwsR0FBYTtBQUNYQyxnQkFBVSxFQURDO0FBRVhDLGdCQUFVLEVBRkM7QUFHWEMsZ0JBQVU7QUFIQyxLQUFiO0FBSGlCO0FBUWxCOzs7O2lDQUVZQyxDLEVBQU87QUFDbEIsVUFBTUMsSUFBTUQsRUFBTUUsTUFBTixDQUFhQyxLQUF6QjtBQUNBLFVBQUlILEVBQU1FLE1BQU4sQ0FBYUUsSUFBYixLQUFzQixXQUExQixFQUF1QztBQUNyQyxhQUFLQyxRQUFMLENBQWM7QUFDWlIsb0JBQVVJO0FBREUsU0FBZDtBQUdELE9BSkQsTUFJTztBQUNMLGFBQUtJLFFBQUwsQ0FBYztBQUNaUCxvQkFBVUc7QUFERSxTQUFkO0FBR0Q7QUFDRjs7O2tDQUVhO0FBQUE7O0FBQ1osVUFBSSxDQUFDLEtBQUtMLEtBQUwsQ0FBV0MsUUFBWCxDQUFvQlMsTUFBckIsSUFBK0IsQ0FBQyxLQUFLVixLQUFMLENBQVdFLFFBQVgsQ0FBb0JRLE1BQXhELEVBQWdFO0FBQzlELGFBQUtELFFBQUwsQ0FBYztBQUNaTixvQkFBVTtBQURFLFNBQWQ7QUFHRCxPQUpELE1B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QUFQLEdBQWVBLEtBQWYiLCJmaWxlIjoiTG9nSW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBMb2dJbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdXNlcm5hbWU6ICcnLFxyXG4gICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgIGVycm9yTXNnOiAnJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNoYW5nZShldmVudCkge1xyXG4gICAgY29uc3QgdGFyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgaWYgKGV2ZW50LnRhcmdldC5uYW1lID09PSAnTG9nSW5OYW1lJykge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB1c2VybmFtZTogdGFyXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgcGFzc3dvcmQ6IHRhclxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhhbmRsZUxvZ0luKCkge1xyXG4gICAgaWYgKCF0aGlzLnN0YXRlLnVzZXJuYW1lLmxlbmd0aCAmJiAhdGhpcy5zdGF0ZS5wYXNzd29yZC5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZXJyb3JNc2c6ICdsb2dpbiBpcyBlbXB0eSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLnVzZXJuYW1lLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciBhIHVzZXJuYW1lJ1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUucGFzc3dvcmQubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIGEgcGFzc3dvcmQnXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IHVzZXJPYmogPSB7XHJcbiAgICAgICAgbmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcclxuICAgICAgICBwYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZFxyXG4gICAgICB9O1xyXG5cclxuXHJcbiAgICAgICQucG9zdChVcmwgKyAnL2xvZ2luJywgdXNlck9iailcclxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIGlmIChyZXNwb25zZVswXSA9PT0gJ2l0IHdvcmtlZCcpIHtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdoaScpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgZXJyb3JNc2c6ICcnXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLnByb3BzLmNoYW5nZVZpZXdzKCdIb21lJyk7XHJcbiAgICAgICAgICB0aGlzLnByb3BzLnNldEN1cnJlbnRVc2VyKHJlc3BvbnNlWzFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzLnN0YXRlLnZpZXcgYWZ0ZXIgc3RhdGUgaXMgc2V0IGFnYWluJyx0aGlzLnN0YXRlLnZpZXcpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBlcnJvck1zZzogJ2ludmFsaWQgbG9naW4gaW5mb3JtYXRpb24nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9J2xhbmRpbmcgcm93Jz5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naWNvbi1ibG9jayBjb2wgczcnPlxyXG4gICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImhlYWRlciBsb2dvXCI+V2VsY29tZSB0byBSZWVsUGFsczwvaDI+XHJcbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwiaGVhZGVyIGNvbCBzMTIgbGlnaHQgZGVzY3JpcHRpb25cIj5cclxuICAgICAgICAgICAgTGV0J3MgZmluZCB5b3VyIG5leHQgYnVkZHkgYnkgeW91ciBtb3ZpZSB0YXN0ZSFcclxuICAgICAgICAgIDwvaDU+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xvZ2luIGljb24tYmxvY2snPlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMuY2hhbmdlVmlld3MoJ1NpZ25VcCcpfT5HbyB0byBTaWduIFVwPC9hPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvclwiPk9SPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbG9naW5Gb3JtJz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cclxuICAgICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJ1c2VybmFtZVwiIGlkPVwidXNlcl9uYW1lXCIgbmFtZT0nTG9nSW5OYW1lJyB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInVzZXJfbmFtZVwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPlVzZXJuYW1lPC9sYWJlbD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxyXG4gICAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInBhc3N3b3JkXCIgaWQ9XCJwYXNzd29yZFwiIG5hbWU9J0xvZ0luUGFzc3dvcmQnIHR5cGU9XCJwYXNzd29yZFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInBhc3N3b3JkXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+UGFzc3dvcmQ8L2xhYmVsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPnt0aGlzLnN0YXRlLmVycm9yTXNnfTwvZGl2PlxyXG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17dGhpcy5oYW5kbGVMb2dJbi5iaW5kKHRoaXMpfT5sb2cgaW48L2E+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+KVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LkxvZ0luID0gTG9nSW47XHJcbiJdfQ==