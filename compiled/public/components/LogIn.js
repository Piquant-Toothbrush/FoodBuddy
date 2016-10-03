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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0xvZ0luLmpzeCJdLCJuYW1lcyI6WyJMb2dJbiIsInByb3BzIiwic3RhdGUiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiZXJyb3JNc2ciLCJldmVudCIsInRhciIsInRhcmdldCIsInZhbHVlIiwibmFtZSIsInNldFN0YXRlIiwibGVuZ3RoIiwidXNlck9iaiIsIiQiLCJwb3N0IiwiVXJsIiwidGhlbiIsInJlc3BvbnNlIiwiY2hhbmdlVmlld3MiLCJzZXRDdXJyZW50VXNlciIsImNhdGNoIiwiaGFuZGxlQ2hhbmdlIiwiYmluZCIsImhhbmRsZUxvZ0luIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsSzs7O0FBRUosYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUdqQixNQUFLQyxLQUFMLEdBQWE7QUFDWEMsZ0JBQVUsRUFEQztBQUVYQyxnQkFBVSxFQUZDO0FBR1hDLGdCQUFVO0FBSEMsS0FBYjtBQUhpQjtBQVFsQjs7OztpQ0FFWUMsQyxFQUFPO0FBQ2xCLFVBQU1DLElBQU1ELEVBQU1FLE1BQU4sQ0FBYUMsS0FBekI7QUFDQSxVQUFJSCxFQUFNRSxNQUFOLENBQWFFLElBQWIsS0FBc0IsV0FBMUIsRUFBdUM7QUFDckMsYUFBS0MsUUFBTCxDQUFjO0FBQ1pSLG9CQUFVSTtBQURFLFNBQWQ7QUFHRCxPQUpELE1BSU87QUFDTCxhQUFLSSxRQUFMLENBQWM7QUFDWlAsb0JBQVVHO0FBREUsU0FBZDtBQUdEO0FBQ0Y7OztrQ0FFYTtBQUFBOztBQUNaLFVBQUksQ0FBQyxLQUFLTCxLQUFMLENBQVdDLFFBQVgsQ0FBb0JTLE1BQXJCLElBQStCLENBQUMsS0FBS1YsS0FBTCxDQUFXRSxRQUFYLENBQW9CUSxNQUF4RCxFQUFnRTtBQUM5RCxhQUFLRCxRQUFMLENBQWM7QUFDWk4sb0JBQVU7QUFERSxTQUFkO0FBR0QsT0FKRCxN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S0FBUCxHQUFlQSxLQUFmIiwiZmlsZSI6IkxvZ0luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTG9nSW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHVzZXJuYW1lOiAnJyxcclxuICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICBlcnJvck1zZzogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIGNvbnN0IHRhciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGlmIChldmVudC50YXJnZXQubmFtZSA9PT0gJ0xvZ0luTmFtZScpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHRhclxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBhc3N3b3JkOiB0YXJcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVMb2dJbigpIHtcclxuICAgIGlmICghdGhpcy5zdGF0ZS51c2VybmFtZS5sZW5ndGggJiYgIXRoaXMuc3RhdGUucGFzc3dvcmQubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAnbG9naW4gaXMgZW1wdHknXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS51c2VybmFtZS5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZXJyb3JNc2c6ICdwbGVhc2UgZW50ZXIgYSB1c2VybmFtZSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLnBhc3N3b3JkLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciBhIHBhc3N3b3JkJ1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCB1c2VyT2JqID0ge1xyXG4gICAgICAgIG5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHRoaXMuc3RhdGUucGFzc3dvcmRcclxuICAgICAgfTtcclxuXHJcblxyXG4gICAgICAkLnBvc3QoVXJsICsgJy9sb2dpbicsIHVzZXJPYmopXHJcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICBpZiAocmVzcG9uc2VbMF0gPT09ICdpdCB3b3JrZWQnKSB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaGknKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIGVycm9yTXNnOiAnJ1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGhpcy5wcm9wcy5jaGFuZ2VWaWV3cygnSG9tZScpO1xyXG4gICAgICAgICAgdGhpcy5wcm9wcy5zZXRDdXJyZW50VXNlcihyZXNwb25zZVsxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICAvLyBjb25zb2xlLmxvZygndGhpcy5zdGF0ZS52aWV3IGFmdGVyIHN0YXRlIGlzIHNldCBhZ2FpbicsdGhpcy5zdGF0ZS52aWV3KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycj0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgZXJyb3JNc2c6ICdpbnZhbGlkIGxvZ2luIGluZm9ybWF0aW9uJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdsYW5kaW5nIHJvdyc+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ljb24tYmxvY2sgY29sIHM3Jz5cclxuICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJoZWFkZXIgbG9nb1wiPldlbGNvbWUgdG8gUmVlbFBhbHM8L2gyPlxyXG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cImhlYWRlciBjb2wgczEyIGxpZ2h0IGRlc2NyaXB0aW9uXCI+XHJcbiAgICAgICAgICAgIExldCdzIGZpbmQgeW91ciBuZXh0IGJ1ZGR5IGJ5IHlvdXIgbW92aWUgdGFzdGUhXHJcbiAgICAgICAgICA8L2g1PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdsb2dpbiBpY29uLWJsb2NrJz5cclxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLmNoYW5nZVZpZXdzKCdTaWduVXAnKX0+R28gdG8gU2lnbiBVcDwvYT5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JcIj5PUjwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xvZ2luRm9ybSc+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XHJcbiAgICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwidXNlcm5hbWVcIiBpZD1cInVzZXJfbmFtZVwiIG5hbWU9J0xvZ0luTmFtZScgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJ1c2VyX25hbWVcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5Vc2VybmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cclxuICAgICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJwYXNzd29yZFwiIGlkPVwicGFzc3dvcmRcIiBuYW1lPSdMb2dJblBhc3N3b3JkJyB0eXBlPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJwYXNzd29yZFwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPlBhc3N3b3JkPC9sYWJlbD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj57dGhpcy5zdGF0ZS5lcnJvck1zZ308L2Rpdj5cclxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTG9nSW4uYmluZCh0aGlzKX0+bG9nIGluPC9hPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PilcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5Mb2dJbiA9IExvZ0luO1xyXG4iXX0=