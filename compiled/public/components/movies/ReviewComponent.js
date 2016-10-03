'use strict';

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var d = c[i]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(b, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var ReviewComponent = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      userReview: d.props.review,
      editMode: !1,
      reviewSubmitted: !1,
      currentInput: d.props.review
    };
    return d;
  }

  _createClass(b, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(c) {
      this.setState({
        userReview: c.review,
        editMode: !1
      });
    }
  }, {
    key: 'handleEdit',
    value: function handleEdit() {
      this.setState({
        editMode: !0,
        reviewSubmitted: !1
      });
    }
  }, {
    key: 'closeEdit',
    value: function closeEdit() {
      this.setState({
        editMode: !1,
        currentInput: this.state.userReview
      });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit() {
      this.setState({
        editMode: !1,
        userReview: this.state.currentInput
      });
      this.updateReview(this.state.currentInput);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(c) {
      this.setState({
        currentInput: c.target.value
      });
    }
  }, {
    key: 'updateReview',
    value: function updateReview(c) {
      var _this2 = this,
          d = {
        title: this.props.title,
        id: this.props.id,
        review: c
      };

      $.post(Url + '/ratemovie', d).done(function (e) {
        // console.log('movie rating updated');
        _this2.setState({
          reviewSubmitted: !0
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.editMode) {
        return React.createElement(
          'div',
          { className: 'review' },
          'Enter your review, 255 characters maximum',
          React.createElement('textarea', { cols: '40', rows: '5', value: this.state.currentInput, onChange: this.handleChange.bind(this), maxlength: '255' }),
          React.createElement(
            'button',
            { onClick: this.handleSubmit.bind(this) },
            'submit review'
          ),
          React.createElement(
            'button',
            { onClick: this.closeEdit.bind(this) },
            'cancel'
          )
        );
      } else {
        return React.createElement(
          'div',
          { className: 'userReview' },
          React.createElement(
            'div',
            { className: 'review' },
            'Your Review:',
            React.createElement(
              'button',
              { className: 'editReviewButton', onClick: this.handleEdit.bind(this) },
              'Edit Review'
            )
          ),
          React.createElement(
            'div',
            { className: 'theReview' },
            this.state.userReview === '' || this.state.userReview === null ? 'You have not reviewed the movie yet' : this.state.userReview
          ),
          this.state.reviewSubmitted ? React.createElement(
            'div',
            { className: 'updateMsg' },
            'review submitted'
          ) : ''
        );
      }
    }
  }]);

  return b;
}(React.Component);

window.ReviewComponent = ReviewComponent;
////
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9SZXZpZXdDb21wb25lbnQuanN4Il0sIm5hbWVzIjpbIlJldmlld0NvbXBvbmVudCIsInByb3BzIiwic3RhdGUiLCJ1c2VyUmV2aWV3IiwicmV2aWV3IiwiZWRpdE1vZGUiLCJyZXZpZXdTdWJtaXR0ZWQiLCJjdXJyZW50SW5wdXQiLCJuZXh0UHJvcHMiLCJzZXRTdGF0ZSIsInVwZGF0ZVJldmlldyIsImV2ZW50IiwidGFyZ2V0IiwidmFsdWUiLCJtb3ZpZU9iaiIsInRpdGxlIiwiaWQiLCIkIiwicG9zdCIsIlVybCIsImRvbmUiLCJoYW5kbGVDaGFuZ2UiLCJiaW5kIiwiaGFuZGxlU3VibWl0IiwiY2xvc2VFZGl0IiwiaGFuZGxlRWRpdCIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLGU7OztBQUVKLGFBQVlDLENBQVosRUFBbUI7QUFBQTs7QUFBQSxrR0FDWEEsQ0FEVzs7QUFFakIsTUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGtCQUFZLEVBQUtGLEtBQUwsQ0FBV0csTUFEWjtBQUVYQyxrQkFGVztBQUdYQyx5QkFIVztBQUlYQyxvQkFBYyxFQUFLTixLQUFMLENBQVdHO0FBSmQsS0FBYjtBQUZpQjtBQVFsQjs7Ozs4Q0FFeUJJLEMsRUFBVztBQUNuQyxXQUFLQyxRQUFMLENBQWM7QUFDWk4sb0JBQVlLLEVBQVVKLE1BRFY7QUFFWkM7QUFGWSxPQUFkO0FBSUQ7OztpQ0FFWTtBQUNYLFdBQUtJLFFBQUwsQ0FBYztBQUNaSixvQkFEWTtBQUVaQztBQUZZLE9BQWQ7QUFJRDs7O2dDQUVXO0FBQ1YsV0FBS0csUUFBTCxDQUFjO0FBQ1pKLG9CQURZO0FBRVpFLHNCQUFjLEtBQUtMLEtBQUwsQ0FBV0M7QUFGYixPQUFkO0FBSUQ7OzttQ0FFYztBQUNiLFdBQUtNLFFBQUwsQ0FBYztBQUNaSixvQkFEWTtBQUVaRixvQkFBWSxLQUFLRCxLQUFMLENBQVdLO0FBRlgsT0FBZDtBQUlBLFdBQUtHLFlBQUwsQ0FBa0IsS0FBS1IsS0FBTCxDQUFXSyxZQUE3QjtBQUNEOzs7aUNBRVlJLEMsRUFBTztBQUNsQixXQUFLRixRQUFMLENBQWM7QUFDWkYsc0JBQWNJLEVBQU1DLE1BQU4sQ0FBYUM7QUFEZixPQUFkO0FBR0Q7OztpQ0FFWVQsQyxFQUFRO0FBQUE7QUFBQSxVQUNmVSxJQUFXO0FBQ2JDLGVBQU8sS0FBS2QsS0FBTCxDQUFXYyxLQURMO0FBRWJDLFlBQUksS0FBS2YsS0FBTCxDQUFXZSxFQUZGO0FBR2JaLGdCQUFRQTtBQUhLLE9BREk7O0FBTW5CYSxRQUFFQyxJQUFGLENBQU9DLE1BQU0sWUFBYixFQUEyQkwsQ0FBM0IsRUFDQ00sSUFERCxDQUNNLGFBQVk7QUFDaEI7QUFDQSxlQUFLWCxRQUFMLENBQWM7QUFDWkg7QUFEWSxTQUFkO0FBR0QsT0FORDtBQU9EOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUtKLEtBQUwsQ0FBV0csUUFBZixFQUF5QjtBQUN6QixlQUNJO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZjtBQUFBO0FBRUcsNENBQVUsTUFBSyxJQUFmLEVBQW9CLE1BQUssR0FBekIsRUFBNkIsT0FBTyxLQUFLSCxLQUFMLENBQVdLLFlBQS9DLEVBQTZELFVBQVUsS0FBS2MsWUFBTCxDQUFrQkMsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBdkUsRUFBcUcsV0FBVSxLQUEvRyxHQUZIO0FBR0c7QUFBQTtBQUFBLGNBQVEsU0FBUyxLQUFLQyxZQUFMLENBQWtCRCxJQUFsQixDQUF1QixJQUF2QixDQUFqQjtBQUFBO0FBQUEsV0FISDtBQUlHO0FBQUE7QUFBQSxjQUFRLFNBQVMsS0FBS0UsU0FBTCxDQUFlRixJQUFmLENBQW9CLElBQXBCLENBQWpCO0FBQUE7QUFBQTtBQUpILFNBREo7QUFPQyxPQVJELE1BUU87QUFDTCxlQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsWUFBZjtBQUNFO0FBQUE7QUFBQSxjQUFLLFdBQVUsUUFBZjtBQUFBO0FBQW9DO0FBQUE7QUFBQSxnQkFBUSxXQUFVLGtCQUFsQixFQUFxQyxTQUFTLEtBQUtHLFVBQUwsQ0FBZ0JILElBQWhCLENBQXFCLElBQXJCLENBQTlDO0FBQUE7QUFBQTtBQUFwQyxXQURGO0FBRUU7QUFBQTtBQUFBLGNBQUssV0FBVSxXQUFmO0FBQTZCLGlCQUFLcEIsS0FBTCxDQUFXQyxVQUFYLEtBQTBCLEVBQTFCLElBQWdDLEtBQUtELEtBQUwsQ0FBV0MsVUFBWCxLQUEwQixJQUEzRCxHQUFtRSxxQ0FBbkUsR0FBMkcsS0FBS0QsS0FBTCxDQUFXQztBQUFsSixXQUZGO0FBR0ksZUFBS0QsS0FBTCxDQUFXSSxlQUFaLEdBQStCO0FBQUE7QUFBQSxjQUFLLFdBQVUsV0FBZjtBQUFBO0FBQUEsV0FBL0IsR0FBbUY7QUFIdEYsU0FERjtBQU1EO0FBQ0g7Ozs7RUEvRTRCb0IsTUFBTUMsUzs7QUFrRnBDQyxPQUFPNUIsZUFBUCxHQUF5QkEsZUFBekI7QUFDQSIsImZpbGUiOiJSZXZpZXdDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBSZXZpZXdDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdXNlclJldmlldzogdGhpcy5wcm9wcy5yZXZpZXcsXHJcbiAgICAgIGVkaXRNb2RlOiBmYWxzZSxcclxuICAgICAgcmV2aWV3U3VibWl0dGVkOiBmYWxzZSxcclxuICAgICAgY3VycmVudElucHV0OiB0aGlzLnByb3BzLnJldmlld1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdXNlclJldmlldzogbmV4dFByb3BzLnJldmlldyxcclxuICAgICAgZWRpdE1vZGU6IGZhbHNlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUVkaXQoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZWRpdE1vZGU6IHRydWUsXHJcbiAgICAgIHJldmlld1N1Ym1pdHRlZDogZmFsc2VcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VFZGl0KCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGVkaXRNb2RlOiBmYWxzZSxcclxuICAgICAgY3VycmVudElucHV0OiB0aGlzLnN0YXRlLnVzZXJSZXZpZXdcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlU3VibWl0KCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGVkaXRNb2RlOiBmYWxzZSxcclxuICAgICAgdXNlclJldmlldzogdGhpcy5zdGF0ZS5jdXJyZW50SW5wdXRcclxuICAgIH0pO1xyXG4gICAgdGhpcy51cGRhdGVSZXZpZXcodGhpcy5zdGF0ZS5jdXJyZW50SW5wdXQpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgY3VycmVudElucHV0OiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUmV2aWV3KHJldmlldykge1xyXG4gICAgdmFyIG1vdmllT2JqID0ge1xyXG4gICAgICB0aXRsZTogdGhpcy5wcm9wcy50aXRsZSwgXHJcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxyXG4gICAgICByZXZpZXc6IHJldmlld1xyXG4gICAgfTtcclxuICAgICQucG9zdChVcmwgKyAnL3JhdGVtb3ZpZScsIG1vdmllT2JqKVxyXG4gICAgLmRvbmUocmVzcG9uc2UgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnbW92aWUgcmF0aW5nIHVwZGF0ZWQnKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgcmV2aWV3U3VibWl0dGVkOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdE1vZGUpIHtcclxuICBcdFx0cmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncmV2aWV3Jz5cclxuICAgICAgICAgIEVudGVyIHlvdXIgcmV2aWV3LCAyNTUgY2hhcmFjdGVycyBtYXhpbXVtXHJcbiAgICAgICAgICAgPHRleHRhcmVhIGNvbHM9XCI0MFwiIHJvd3M9XCI1XCIgdmFsdWU9e3RoaXMuc3RhdGUuY3VycmVudElucHV0fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0gbWF4bGVuZ3RoPVwiMjU1XCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyl9PnN1Ym1pdCByZXZpZXc8L2J1dHRvbj5cclxuICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuY2xvc2VFZGl0LmJpbmQodGhpcyl9PmNhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2Pik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSd1c2VyUmV2aWV3Jz5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyZXZpZXcnPllvdXIgUmV2aWV3OjxidXR0b24gY2xhc3NOYW1lPSdlZGl0UmV2aWV3QnV0dG9uJyBvbkNsaWNrPXt0aGlzLmhhbmRsZUVkaXQuYmluZCh0aGlzKX0+RWRpdCBSZXZpZXc8L2J1dHRvbj48L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0aGVSZXZpZXcnPnsodGhpcy5zdGF0ZS51c2VyUmV2aWV3ID09PSAnJyB8fCB0aGlzLnN0YXRlLnVzZXJSZXZpZXcgPT09IG51bGwpID8gJ1lvdSBoYXZlIG5vdCByZXZpZXdlZCB0aGUgbW92aWUgeWV0JyA6IHRoaXMuc3RhdGUudXNlclJldmlld308L2Rpdj5cclxuICAgICAgICAgIHsodGhpcy5zdGF0ZS5yZXZpZXdTdWJtaXR0ZWQpID8gPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj5yZXZpZXcgc3VibWl0dGVkPC9kaXY+IDogJyd9XHJcbiAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxuXHR9XHJcbn1cclxuXHJcbndpbmRvdy5SZXZpZXdDb21wb25lbnQgPSBSZXZpZXdDb21wb25lbnQ7XHJcbi8vLy8iXX0=