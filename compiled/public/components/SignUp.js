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
      } else if (!this.state.firstName.length) {
        this.setState({
          errorMsg: 'please enter your first name'
        });
      } else if (!this.state.lastName.length) {
        this.setState({
          errorMsg: 'please enter your last name'
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
              { className: 'input-field col s6' },
              React.createElement('input', { placeholder: 'first name', id: 'first_name', name: 'SignUpFirstname', type: 'text', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { 'for': 'first_name', className: 'active' },
                'first name'
              )
            ),
            React.createElement(
              'div',
              { className: 'input-field col s6' },
              React.createElement('input', { placeholder: 'last name', id: 'last_name', name: 'SignUpLastname', type: 'text', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { 'for': 'last_name', className: 'active' },
                'last name'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcC5qcyJdLCJuYW1lcyI6WyJTaWduVXAiLCJwcm9wcyIsInN0YXRlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiZXJyb3JNc2ciLCJzdWNjZXNzTXNnIiwiZXZlbnQiLCJ0YXIiLCJ0YXJnZXQiLCJ2YWx1ZSIsIm5hbWUiLCJzZXRTdGF0ZSIsImxlbmd0aCIsInVzZXJPYmoiLCIkIiwicG9zdCIsInRoZW4iLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwiZXJyIiwiaGFuZGxlQ2hhbmdlIiwiYmluZCIsImVudGVyTmV3VXNlciIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLE07OztBQUVKLGtCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsZ0hBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxnQkFBVSxFQURDO0FBRVhDLGdCQUFVLEVBRkM7QUFHWEMsaUJBQVcsRUFIQTtBQUlYQyxnQkFBVSxFQUpDO0FBS1hDLGdCQUFVLEVBTEM7QUFNWEMsa0JBQVk7QUFORCxLQUFiO0FBSGlCO0FBV2xCOzs7O2lDQUVZQyxLLEVBQU87QUFDbEIsVUFBTUMsTUFBTUQsTUFBTUUsTUFBTixDQUFhQyxLQUF6QjtBQUNBLGNBQVFILE1BQU1FLE1BQU4sQ0FBYUUsSUFBckI7QUFDRSxhQUFLLFlBQUw7QUFDQSxlQUFLQyxRQUFMLENBQWM7QUFDWlgsc0JBQVVPO0FBREUsV0FBZDtBQUdBO0FBQ0MsYUFBSyxnQkFBTDtBQUNELGVBQUtJLFFBQUwsQ0FBYztBQUNaVixzQkFBVU07QUFERSxXQUFkO0FBR0E7QUFDQyxhQUFLLGlCQUFMO0FBQ0QsZUFBS0ksUUFBTCxDQUFjO0FBQ1pULHVCQUFXSztBQURDLFdBQWQ7QUFHQTtBQUNDLGFBQUssZ0JBQUw7QUFDRCxlQUFLSSxRQUFMLENBQWM7QUFDWlIsc0JBQVVJO0FBREUsV0FBZDtBQUdBO0FBcEJGO0FBc0JEOzs7bUNBRWM7QUFBQTs7QUFDYjtBQUNBLFVBQUksQ0FBQyxLQUFLUixLQUFMLENBQVdDLFFBQVgsQ0FBb0JZLE1BQXpCLEVBQWlDO0FBQy9CLGFBQUtELFFBQUwsQ0FBYztBQUNaUCxvQkFBVTtBQURFLFNBQWQ7QUFHRCxPQUpELE1BSU8sSUFBSSxDQUFDLEtBQUtMLEtBQUwsQ0FBV0UsUUFBWCxDQUFvQlcsTUFBekIsRUFBaUM7QUFDdEMsYUFBS0QsUUFBTCxDQUFjO0FBQ1pQLG9CQUFVO0FBREUsU0FBZDtBQUdELE9BSk0sTUFJQSxJQUFJLENBQUMsS0FBS0wsS0FBTCxDQUFXRyxTQUFYLENBQXFCVSxNQUExQixFQUFrQztBQUN2QyxhQUFLRCxRQUFMLENBQWM7QUFDWlAsb0JBQVU7QUFERSxTQUFkO0FBR0QsT0FKTSxNQUlBLElBQUksQ0FBQyxLQUFLTCxLQUFMLENBQVdJLFFBQVgsQ0FBb0JTLE1BQXpCLEVBQWlDO0FBQ3RDLGFBQUtELFFBQUwsQ0FBYztBQUNaUCxvQkFBVTtBQURFLFNBQWQ7QUFHRCxPQUpNLE1BSUE7QUFDTCxZQUFJUyxVQUFVO0FBQ1pILGdCQUFNLEtBQUtYLEtBQUwsQ0FBV0MsUUFETDtBQUVaQyxvQkFBVSxLQUFLRixLQUFMLENBQVdFLFFBRlQ7QUFHWkMscUJBQVcsS0FBS0gsS0FBTCxDQUFXRyxTQUhWO0FBSVpDLG9CQUFVLEtBQUtKLEtBQUwsQ0FBV0k7QUFKVCxTQUFkOztBQU9BVyxVQUFFQyxJQUFGLENBQU8sU0FBUCxFQUFrQkYsT0FBbEIsRUFDQ0csSUFERCxDQUNNLG9CQUFZO0FBQ2hCO0FBQ0EsaUJBQUtMLFFBQUwsQ0FBYztBQUNaUCxzQkFBVSxFQURFO0FBRVpDLHdCQUFZO0FBRkEsV0FBZDtBQUlBOztBQUVBLGlCQUFLUCxLQUFMLENBQVdtQixXQUFYLENBQXVCLE1BQXZCO0FBQ0EsaUJBQUtuQixLQUFMLENBQVdvQixjQUFYLENBQTBCLE9BQUtuQixLQUFMLENBQVdDLFFBQXJDO0FBQ0QsU0FYRCxFQVlDbUIsS0FaRCxDQVlPLGVBQU07QUFDVkMsa0JBQVFDLEdBQVIsQ0FBWUMsR0FBWjtBQUNELGlCQUFLWCxRQUFMLENBQWM7QUFDWlAsc0JBQVU7QUFERSxXQUFkO0FBR0QsU0FqQkQ7QUFrQkQ7QUFDRjs7OzZCQUVRO0FBQUE7O0FBRVAsYUFDQTtBQUFBO0FBQUEsVUFBSyxXQUFVLGFBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLG1CQUFmO0FBQ0U7QUFBQTtBQUFBLGNBQUksV0FBVSxhQUFkO0FBQUE7QUFBQSxXQURGO0FBRUU7QUFBQTtBQUFBLGNBQUksV0FBVSxrQ0FBZDtBQUFBO0FBQUE7QUFGRixTQURGO0FBT0U7QUFBQTtBQUFBLFlBQUssV0FBVSxrQkFBZjtBQUNFO0FBQUE7QUFBQSxjQUFHLFdBQVUsOEJBQWIsRUFBNEMsU0FBUztBQUFBLHVCQUFNLE9BQUtOLEtBQUwsQ0FBV21CLFdBQVgsQ0FBdUIsT0FBdkIsQ0FBTjtBQUFBLGVBQXJEO0FBQUE7QUFBQSxXQURGO0FBRUU7QUFBQTtBQUFBLGNBQUssV0FBVSxJQUFmO0FBQUE7QUFBQSxXQUZGO0FBR0U7QUFBQTtBQUFBLGNBQUssV0FBVSxXQUFmO0FBQ0U7QUFBQTtBQUFBLGdCQUFLLFdBQVUsb0JBQWY7QUFDRSw2Q0FBTyxhQUFZLFVBQW5CLEVBQThCLElBQUcsV0FBakMsRUFBNkMsTUFBSyxZQUFsRCxFQUErRCxNQUFLLE1BQXBFLEVBQTJFLFdBQVUsVUFBckYsRUFBZ0csVUFBVSxLQUFLTSxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixJQUF2QixDQUExRyxHQURGO0FBRUU7QUFBQTtBQUFBLGtCQUFPLE9BQUksV0FBWCxFQUF1QixXQUFVLFFBQWpDO0FBQUE7QUFBQTtBQUZGLGFBREY7QUFNRTtBQUFBO0FBQUEsZ0JBQUssV0FBVSxvQkFBZjtBQUNFLDZDQUFPLGFBQVksVUFBbkIsRUFBOEIsSUFBRyxVQUFqQyxFQUE0QyxNQUFLLGdCQUFqRCxFQUFrRSxNQUFLLFVBQXZFLEVBQWtGLFdBQVUsVUFBNUYsRUFBdUcsVUFBVSxLQUFLRCxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixJQUF2QixDQUFqSCxHQURGO0FBRUU7QUFBQTtBQUFBLGtCQUFPLE9BQUksVUFBWCxFQUFzQixXQUFVLFFBQWhDO0FBQUE7QUFBQTtBQUZGLGFBTkY7QUFXRTtBQUFBO0FBQUEsZ0JBQUssV0FBVSxvQkFBZjtBQUNFLDZDQUFPLGFBQVksWUFBbkIsRUFBZ0MsSUFBRyxZQUFuQyxFQUFnRCxNQUFLLGlCQUFyRCxFQUF1RSxNQUFLLE1BQTVFLEVBQW1GLFdBQVUsVUFBN0YsRUFBd0csVUFBVSxLQUFLRCxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixJQUF2QixDQUFsSCxHQURGO0FBRUU7QUFBQTtBQUFBLGtCQUFPLE9BQUksWUFBWCxFQUF3QixXQUFVLFFBQWxDO0FBQUE7QUFBQTtBQUZGLGFBWEY7QUFnQkU7QUFBQTtBQUFBLGdCQUFLLFdBQVUsb0JBQWY7QUFDRSw2Q0FBTyxhQUFZLFdBQW5CLEVBQStCLElBQUcsV0FBbEMsRUFBOEMsTUFBSyxnQkFBbkQsRUFBb0UsTUFBSyxNQUF6RSxFQUFnRixXQUFVLFVBQTFGLEVBQXFHLFVBQVUsS0FBS0QsWUFBTCxDQUFrQkMsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBL0csR0FERjtBQUVFO0FBQUE7QUFBQSxrQkFBTyxPQUFJLFdBQVgsRUFBdUIsV0FBVSxRQUFqQztBQUFBO0FBQUE7QUFGRixhQWhCRjtBQXFCRTtBQUFBO0FBQUEsZ0JBQUssV0FBVSxVQUFmO0FBQTJCLG1CQUFLekIsS0FBTCxDQUFXSztBQUF0QyxhQXJCRjtBQXNCRTtBQUFBO0FBQUEsZ0JBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTLEtBQUtxQixZQUFMLENBQWtCRCxJQUFsQixDQUF1QixJQUF2QixDQUFyRDtBQUFBO0FBQUE7QUF0QkY7QUFIRjtBQVBGLE9BREE7QUFxQ0Q7Ozs7RUEvSGtCRSxNQUFNQyxTOztBQW1JM0JDLE9BQU8vQixNQUFQLEdBQWdCQSxNQUFoQiIsImZpbGUiOiJTaWduVXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTaWduVXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHVzZXJuYW1lOiAnJyxcclxuICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICBmaXJzdE5hbWU6ICcnLFxyXG4gICAgICBsYXN0TmFtZTogJycsXHJcbiAgICAgIGVycm9yTXNnOiAnJyxcclxuICAgICAgc3VjY2Vzc01zZzogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIGNvbnN0IHRhciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIHN3aXRjaCAoZXZlbnQudGFyZ2V0Lm5hbWUpe1xyXG4gICAgICBjYXNlICdTaWduVXBOYW1lJzpcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHRhclxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICAgICBjYXNlICdTaWduVXBQYXNzd29yZCc6XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBhc3N3b3JkOiB0YXJcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgICAgY2FzZSAnU2lnblVwRmlyc3RuYW1lJzpcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZmlyc3ROYW1lOiB0YXJcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgICAgY2FzZSAnU2lnblVwTGFzdG5hbWUnOlxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBsYXN0TmFtZTogdGFyXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGVudGVyTmV3VXNlcigpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKFwiZW51IGJlaW5nIHJ1blwiKTtcclxuICAgIGlmICghdGhpcy5zdGF0ZS51c2VybmFtZS5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZXJyb3JNc2c6ICdwbGVhc2UgZW50ZXIgYSB1c2VybmFtZSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLnBhc3N3b3JkLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciBhIHBhc3N3b3JkJ1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUuZmlyc3ROYW1lLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciB5b3VyIGZpcnN0IG5hbWUnXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS5sYXN0TmFtZS5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZXJyb3JNc2c6ICdwbGVhc2UgZW50ZXIgeW91ciBsYXN0IG5hbWUnXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IHVzZXJPYmogPSB7IFxyXG4gICAgICAgIG5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHRoaXMuc3RhdGUucGFzc3dvcmQsXHJcbiAgICAgICAgZmlyc3ROYW1lOiB0aGlzLnN0YXRlLmZpcnN0TmFtZSxcclxuICAgICAgICBsYXN0TmFtZTogdGhpcy5zdGF0ZS5sYXN0TmFtZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgJC5wb3N0KCcvc2lnbnVwJywgdXNlck9iailcclxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIC8vYWZ0ZXIgc2lnbnVwIHNob3VsZCBwcm9tcHQgdXNlciB0byBzZWxlY3QgdGhlaXIgZmF2b3JpdGUgdGhyZWUgbW92aWVzXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBlcnJvck1zZzogJycsXHJcbiAgICAgICAgICBzdWNjZXNzTXNnOiAnbmV3IGxvZ2luIGNyZWF0ZWQnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcywnIHRoaXMnKVxyXG5cclxuICAgICAgICB0aGlzLnByb3BzLmNoYW5nZVZpZXdzKFwiSG9tZVwiKTtcclxuICAgICAgICB0aGlzLnByb3BzLnNldEN1cnJlbnRVc2VyKHRoaXMuc3RhdGUudXNlcm5hbWUpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyPT4ge1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgZXJyb3JNc2c6ICd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBwbGVhc2UgdXNlIGEgZGlmZmVyZW50IHVzZXJuYW1lJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgXHJcbiAgICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J2xhbmRpbmcgcm93Jz5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9J2ljb24tYmxvY2sgY29sIHM3Jz5cclxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwiaGVhZGVyIGxvZ29cIj5XZWxjb21lIHRvIFJlZWxQYWxzPC9oMj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwiaGVhZGVyIGNvbCBzMTIgbGlnaHQgZGVzY3JpcHRpb25cIj5cclxuICAgICAgICAgIExldCdzIGZpbmQgeW91ciBuZXh0IGJ1ZGR5IGJ5IHlvdXIgbW92aWUgdGFzdGUhXHJcbiAgICAgICAgPC9oNT5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdsb2dpbiBpY29uLWJsb2NrJz5cclxuICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5jaGFuZ2VWaWV3cygnTG9naW4nKX0+R28gdG8gTG9nIEluPC9hPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JcIj5PUjwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdsb2dpbkZvcm0nPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cclxuICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwidXNlcm5hbWVcIiBpZD1cInVzZXJfbmFtZVwiIG5hbWU9J1NpZ25VcE5hbWUnIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwidXNlcl9uYW1lXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+VXNlcm5hbWU8L2xhYmVsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cclxuICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwicGFzc3dvcmRcIiBpZD1cInBhc3N3b3JkXCIgbmFtZT0nU2lnblVwUGFzc3dvcmQnIHR5cGU9XCJwYXNzd29yZFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBhc3N3b3JkXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+UGFzc3dvcmQ8L2xhYmVsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cclxuICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwiZmlyc3QgbmFtZVwiIGlkPVwiZmlyc3RfbmFtZVwiIG5hbWU9J1NpZ25VcEZpcnN0bmFtZScgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmaXJzdF9uYW1lXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+Zmlyc3QgbmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxyXG4gICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJsYXN0IG5hbWVcIiBpZD1cImxhc3RfbmFtZVwiIG5hbWU9J1NpZ25VcExhc3RuYW1lJyB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImxhc3RfbmFtZVwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPmxhc3QgbmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+e3RoaXMuc3RhdGUuZXJyb3JNc2d9PC9kaXY+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17dGhpcy5lbnRlck5ld1VzZXIuYmluZCh0aGlzKX0+U2lnbiBVcCE8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+KVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbndpbmRvdy5TaWduVXAgPSBTaWduVXA7Il19