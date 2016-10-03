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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcC5qc3giXSwibmFtZXMiOlsiU2lnblVwIiwicHJvcHMiLCJzdGF0ZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJmaXJzdE5hbWUiLCJsYXN0TmFtZSIsImVycm9yTXNnIiwic3VjY2Vzc01zZyIsImV2ZW50IiwidGFyIiwidGFyZ2V0IiwidmFsdWUiLCJuYW1lIiwic2V0U3RhdGUiLCJsZW5ndGgiLCJ1c2VyT2JqIiwiJCIsInBvc3QiLCJ0aGVuIiwiY2hhbmdlVmlld3MiLCJzZXRDdXJyZW50VXNlciIsImNhdGNoIiwiaGFuZGxlQ2hhbmdlIiwiYmluZCIsImVudGVyTmV3VXNlciIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLE07OztBQUVKLGFBQVlDLENBQVosRUFBbUI7QUFBQTs7QUFFckI7QUFGcUIsa0dBQ1hBLENBRFc7O0FBR2pCLE1BQUtDLEtBQUwsR0FBYTtBQUNYQyxnQkFBVSxFQURDO0FBRVhDLGdCQUFVLEVBRkM7QUFHWEMsaUJBQVcsRUFIQTtBQUlYQyxnQkFBVSxFQUpDO0FBS1hDLGdCQUFVLEVBTEM7QUFNWEMsa0JBQVk7QUFORCxLQUFiO0FBSGlCO0FBV2xCOzs7O2lDQUVZQyxDLEVBQU87QUFDbEIsVUFBTUMsSUFBTUQsRUFBTUUsTUFBTixDQUFhQyxLQUF6QjtBQUNBLGNBQVFILEVBQU1FLE1BQU4sQ0FBYUUsSUFBckI7QUFDRSxhQUFLLFlBQUw7QUFDQSxlQUFLQyxRQUFMLENBQWM7QUFDWlgsc0JBQVVPO0FBREUsV0FBZDtBQUdBO0FBQ0MsYUFBSyxnQkFBTDtBQUNELGVBQUtJLFFBQUwsQ0FBYztBQUNaVixzQkFBVU07QUFERSxXQUFkO0FBR0E7QUFDQyxhQUFLLGlCQUFMO0FBQ0QsZUFBS0ksUUFBTCxDQUFjO0FBQ1pULHVCQUFXSztBQURDLFdBQWQ7QUFHQTtBQUNDLGFBQUssZ0JBQUw7QUFDRCxlQUFLSSxR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QUFMLENBQWtCRCxJQUFsQixDQUF1QixJQUF2QixDQUFyRDtBQUFBO0FBQUE7QUFiRjtBQUhGO0FBUEYsT0FEQTtBQTRCRDs7OztFQTlHa0JFLE1BQU1DLFM7O0FBa0gzQkMsT0FBTzVCLE1BQVAsR0FBZ0JBLE1BQWhCIiwiZmlsZSI6IlNpZ25VcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNpZ25VcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcbi8vXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB1c2VybmFtZTogJycsXHJcbiAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgZmlyc3ROYW1lOiAnJyxcclxuICAgICAgbGFzdE5hbWU6ICcnLFxyXG4gICAgICBlcnJvck1zZzogJycsXHJcbiAgICAgIHN1Y2Nlc3NNc2c6ICcnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICBjb25zdCB0YXIgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBzd2l0Y2ggKGV2ZW50LnRhcmdldC5uYW1lKXtcclxuICAgICAgY2FzZSAnU2lnblVwTmFtZSc6XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHVzZXJuYW1lOiB0YXJcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgICAgY2FzZSAnU2lnblVwUGFzc3dvcmQnOlxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBwYXNzd29yZDogdGFyXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgICAgIGNhc2UgJ1NpZ25VcEZpcnN0bmFtZSc6XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGZpcnN0TmFtZTogdGFyXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgICAgIGNhc2UgJ1NpZ25VcExhc3RuYW1lJzpcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbGFzdE5hbWU6IHRhclxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBlbnRlck5ld1VzZXIoKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcImVudSBiZWluZyBydW5cIik7XHJcbiAgICBpZiAoIXRoaXMuc3RhdGUudXNlcm5hbWUubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIGEgdXNlcm5hbWUnXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS5wYXNzd29yZC5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZXJyb3JNc2c6ICdwbGVhc2UgZW50ZXIgYSBwYXNzd29yZCdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgdXNlck9iaiA9IHsgXHJcbiAgICAgICAgbmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcclxuICAgICAgICBwYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZCxcclxuICAgICAgICBmaXJzdE5hbWU6IHRoaXMuc3RhdGUuZmlyc3ROYW1lLFxyXG4gICAgICAgIGxhc3ROYW1lOiB0aGlzLnN0YXRlLmxhc3ROYW1lXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkLnBvc3QoJy9zaWdudXAnLCB1c2VyT2JqKVxyXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgLy9hZnRlciBzaWdudXAgc2hvdWxkIHByb21wdCB1c2VyIHRvIHNlbGVjdCB0aGVpciBmYXZvcml0ZSB0aHJlZSBtb3ZpZXNcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGVycm9yTXNnOiAnJyxcclxuICAgICAgICAgIHN1Y2Nlc3NNc2c6ICduZXcgbG9naW4gY3JlYXRlZCdcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLCcgdGhpcycpXHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMuY2hhbmdlVmlld3MoXCJIb21lXCIpO1xyXG4gICAgICAgIHRoaXMucHJvcHMuc2V0Q3VycmVudFVzZXIodGhpcy5zdGF0ZS51c2VybmFtZSk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnI9PiB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBlcnJvck1zZzogJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIHBsZWFzZSB1c2UgYSBkaWZmZXJlbnQgdXNlcm5hbWUnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBcclxuICAgIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nbGFuZGluZyByb3cnPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0naWNvbi1ibG9jayBjb2wgczcnPlxyXG4gICAgICAgIDxoMiBjbGFzc05hbWU9XCJoZWFkZXIgbG9nb1wiPldlbGNvbWUgdG8gUmVlbFBhbHM8L2gyPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJoZWFkZXIgY29sIHMxMiBsaWdodCBkZXNjcmlwdGlvblwiPlxyXG4gICAgICAgICAgTGV0J3MgZmluZCB5b3VyIG5leHQgYnVkZHkgYnkgeW91ciBtb3ZpZSB0YXN0ZSFcclxuICAgICAgICA8L2g1PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9J2xvZ2luIGljb24tYmxvY2snPlxyXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLmNoYW5nZVZpZXdzKCdMb2dpbicpfT5HbyB0byBMb2cgSW48L2E+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvclwiPk9SPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xvZ2luRm9ybSc+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxyXG4gICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJ1c2VybmFtZVwiIGlkPVwidXNlcl9uYW1lXCIgbmFtZT0nU2lnblVwTmFtZScgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ1c2VyX25hbWVcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5Vc2VybmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxyXG4gICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJwYXNzd29yZFwiIGlkPVwicGFzc3dvcmRcIiBuYW1lPSdTaWduVXBQYXNzd29yZCcgdHlwZT1cInBhc3N3b3JkXCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPnt0aGlzLnN0YXRlLmVycm9yTXNnfTwvZGl2PlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9e3RoaXMuZW50ZXJOZXdVc2VyLmJpbmQodGhpcyl9PlNpZ24gVXAhPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PilcclxuICB9XHJcblxyXG59XHJcblxyXG53aW5kb3cuU2lnblVwID0gU2lnblVwO1xyXG5cclxuXHJcblxyXG5cclxuIl19