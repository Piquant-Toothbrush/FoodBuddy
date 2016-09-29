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
//
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9SZXZpZXdDb21wb25lbnQuanMiXSwibmFtZXMiOlsiUmV2aWV3Q29tcG9uZW50IiwicHJvcHMiLCJzdGF0ZSIsInVzZXJSZXZpZXciLCJyZXZpZXciLCJlZGl0TW9kZSIsInJldmlld1N1Ym1pdHRlZCIsImN1cnJlbnRJbnB1dCIsIm5leHRQcm9wcyIsInNldFN0YXRlIiwidXBkYXRlUmV2aWV3IiwiZXZlbnQiLCJ0YXJnZXQiLCJ2YWx1ZSIsIm1vdmllT2JqIiwidGl0bGUiLCJpZCIsIiQiLCJwb3N0IiwiVXJsIiwiZG9uZSIsImhhbmRsZUNoYW5nZSIsImJpbmQiLCJoYW5kbGVTdWJtaXQiLCJjbG9zZUVkaXQiLCJoYW5kbGVFZGl0IiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsZTs7O0FBRUosYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUVqQixNQUFLQyxLQUFMLEdBQWE7QUFDWEMsa0JBQVksRUFBS0YsS0FBTCxDQUFXRyxNQURaO0FBRVhDLGtCQUZXO0FBR1hDLHlCQUhXO0FBSVhDLG9CQUFjLEVBQUtOLEtBQUwsQ0FBV0c7QUFKZCxLQUFiO0FBRmlCO0FBUWxCOzs7OzhDQUV5QkksQyxFQUFXO0FBQ25DLFdBQUtDLFFBQUwsQ0FBYztBQUNaTixvQkFBWUssRUFBVUosTUFEVjtBQUVaQztBQUZZLE9BQWQ7QUFJRDs7O2lDQUVZO0FBQ1gsV0FBS0ksUUFBTCxDQUFjO0FBQ1pKLG9CQURZO0FBRVpDO0FBRlksT0FBZDtBQUlEOzs7Z0NBRVc7QUFDVixXQUFLRyxRQUFMLENBQWM7QUFDWkosb0JBRFk7QUFFWkUsc0JBQWMsS0FBS0wsS0FBTCxDQUFXQztBQUZiLE9BQWQ7QUFJRDs7O21DQUVjO0FBQ2IsV0FBS00sUUFBTCxDQUFjO0FBQ1pKLG9CQURZO0FBRVpGLG9CQUFZLEtBQUtELEtBQUwsQ0FBV0s7QUFGWCxPQUFkO0FBSUEsV0FBS0csWUFBTCxDQUFrQixLQUFLUixLQUFMLENBQVdLLFlBQTdCO0FBQ0Q7OztpQ0FFWUksQyxFQUFPO0FBQ2xCLFdBQUtGLFFBQUwsQ0FBYztBQUNaRixzQkFBY0ksRUFBTUMsTUFBTixDQUFhQztBQURmLE9BQWQ7QUFHRDs7O2lDQUVZVCxDLEVBQVE7QUFBQTtBQUFBLFVBQ2ZVLElBQVc7QUFDYkMsZUFBTyxLQUFLZCxLQUFMLENBQVdjLEtBREw7QUFFYkMsWUFBSSxLQUFLZixLQUFMLENBQVdlLEVBRkY7QUFHYlosZ0JBQVFBO0FBSEssT0FESTs7QUFNbkJhLFFBQUVDLElBQUYsQ0FBT0MsTUFBTSxZQUFiLEVBQTJCTCxDQUEzQixFQUNDTSxJQURELENBQ00sYUFBWTtBQUNoQjtBQUNBLGVBQUtYLFFBQUwsQ0FBYztBQUNaSDtBQURZLFNBQWQ7QUFHRCxPQU5EO0FBT0Q7Ozs2QkFFUTtBQUNQLFVBQUksS0FBS0osS0FBTCxDQUFXRyxRQUFmLEVBQXlCO0FBQ3pCLGVBQ0k7QUFBQTtBQUFBLFlBQUssV0FBVSxRQUFmO0FBQUE7QUFFRyw0Q0FBVSxNQUFLLElBQWYsRUFBb0IsTUFBSyxHQUF6QixFQUE2QixPQUFPLEtBQUtILEtBQUwsQ0FBV0ssWUFBL0MsRUFBNkQsVUFBVSxLQUFLYyxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixJQUF2QixDQUF2RSxFQUFxRyxXQUFVLEtBQS9HLEdBRkg7QUFHRztBQUFBO0FBQUEsY0FBUSxTQUFTLEtBQUtDLFlBQUwsQ0FBa0JELElBQWxCLENBQXVCLElBQXZCLENBQWpCO0FBQUE7QUFBQSxXQUhIO0FBSUc7QUFBQTtBQUFBLGNBQVEsU0FBUyxLQUFLRSxTQUFMLENBQWVGLElBQWYsQ0FBb0IsSUFBcEIsQ0FBakI7QUFBQTtBQUFBO0FBSkgsU0FESjtBQU9DLE9BUkQsTUFRTztBQUNMLGVBQ0U7QUFBQTtBQUFBLFlBQUssV0FBVSxZQUFmO0FBQ0U7QUFBQTtBQUFBLGNBQUssV0FBVSxRQUFmO0FBQUE7QUFBb0M7QUFBQTtBQUFBLGdCQUFRLFdBQVUsa0JBQWxCLEVBQXFDLFNBQVMsS0FBS0csVUFBTCxDQUFnQkgsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBOUM7QUFBQTtBQUFBO0FBQXBDLFdBREY7QUFFRTtBQUFBO0FBQUEsY0FBSyxXQUFVLFdBQWY7QUFBNkIsaUJBQUtwQixLQUFMLENBQVdDLFVBQVgsS0FBMEIsRUFBMUIsSUFBZ0MsS0FBS0QsS0FBTCxDQUFXQyxVQUFYLEtBQTBCLElBQTNELEdBQW1FLHFDQUFuRSxHQUEyRyxLQUFLRCxLQUFMLENBQVdDO0FBQWxKLFdBRkY7QUFHSSxlQUFLRCxLQUFMLENBQVdJLGVBQVosR0FBK0I7QUFBQTtBQUFBLGNBQUssV0FBVSxXQUFmO0FBQUE7QUFBQSxXQUEvQixHQUFtRjtBQUh0RixTQURGO0FBTUQ7QUFDSDs7OztFQS9FNEJvQixNQUFNQyxTOztBQWtGcENDLE9BQU81QixlQUFQLEdBQXlCQSxlQUF6QjtBQUNBIiwiZmlsZSI6IlJldmlld0NvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFJldmlld0NvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB1c2VyUmV2aWV3OiB0aGlzLnByb3BzLnJldmlldyxcclxuICAgICAgZWRpdE1vZGU6IGZhbHNlLFxyXG4gICAgICByZXZpZXdTdWJtaXR0ZWQ6IGZhbHNlLFxyXG4gICAgICBjdXJyZW50SW5wdXQ6IHRoaXMucHJvcHMucmV2aWV3XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB1c2VyUmV2aWV3OiBuZXh0UHJvcHMucmV2aWV3LFxyXG4gICAgICBlZGl0TW9kZTogZmFsc2VcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlRWRpdCgpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBlZGl0TW9kZTogdHJ1ZSxcclxuICAgICAgcmV2aWV3U3VibWl0dGVkOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbG9zZUVkaXQoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZWRpdE1vZGU6IGZhbHNlLFxyXG4gICAgICBjdXJyZW50SW5wdXQ6IHRoaXMuc3RhdGUudXNlclJldmlld1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVTdWJtaXQoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZWRpdE1vZGU6IGZhbHNlLFxyXG4gICAgICB1c2VyUmV2aWV3OiB0aGlzLnN0YXRlLmN1cnJlbnRJbnB1dFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnVwZGF0ZVJldmlldyh0aGlzLnN0YXRlLmN1cnJlbnRJbnB1dCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBjdXJyZW50SW5wdXQ6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVSZXZpZXcocmV2aWV3KSB7XHJcbiAgICB2YXIgbW92aWVPYmogPSB7XHJcbiAgICAgIHRpdGxlOiB0aGlzLnByb3BzLnRpdGxlLCBcclxuICAgICAgaWQ6IHRoaXMucHJvcHMuaWQsXHJcbiAgICAgIHJldmlldzogcmV2aWV3XHJcbiAgICB9O1xyXG4gICAgJC5wb3N0KFVybCArICcvcmF0ZW1vdmllJywgbW92aWVPYmopXHJcbiAgICAuZG9uZShyZXNwb25zZSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdtb3ZpZSByYXRpbmcgdXBkYXRlZCcpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICByZXZpZXdTdWJtaXR0ZWQ6IHRydWVcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0TW9kZSkge1xyXG4gIFx0XHRyZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyZXZpZXcnPlxyXG4gICAgICAgICAgRW50ZXIgeW91ciByZXZpZXcsIDI1NSBjaGFyYWN0ZXJzIG1heGltdW1cclxuICAgICAgICAgICA8dGV4dGFyZWEgY29scz1cIjQwXCIgcm93cz1cIjVcIiB2YWx1ZT17dGhpcy5zdGF0ZS5jdXJyZW50SW5wdXR9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfSBtYXhsZW5ndGg9XCIyNTVcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKX0+c3VibWl0IHJldmlldzwvYnV0dG9uPlxyXG4gICAgICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5jbG9zZUVkaXQuYmluZCh0aGlzKX0+Y2FuY2VsPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3VzZXJSZXZpZXcnPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jldmlldyc+WW91ciBSZXZpZXc6PGJ1dHRvbiBjbGFzc05hbWU9J2VkaXRSZXZpZXdCdXR0b24nIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRWRpdC5iaW5kKHRoaXMpfT5FZGl0IFJldmlldzwvYnV0dG9uPjwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RoZVJldmlldyc+eyh0aGlzLnN0YXRlLnVzZXJSZXZpZXcgPT09ICcnIHx8IHRoaXMuc3RhdGUudXNlclJldmlldyA9PT0gbnVsbCkgPyAnWW91IGhhdmUgbm90IHJldmlld2VkIHRoZSBtb3ZpZSB5ZXQnIDogdGhpcy5zdGF0ZS51c2VyUmV2aWV3fTwvZGl2PlxyXG4gICAgICAgICAgeyh0aGlzLnN0YXRlLnJldmlld1N1Ym1pdHRlZCkgPyA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPnJldmlldyBzdWJtaXR0ZWQ8L2Rpdj4gOiAnJ31cclxuICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG5cdH1cclxufVxyXG5cclxud2luZG93LlJldmlld0NvbXBvbmVudCA9IFJldmlld0NvbXBvbmVudDtcclxuLy8iXX0=