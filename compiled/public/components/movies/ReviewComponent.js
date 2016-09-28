'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReviewComponent = function (_React$Component) {
  _inherits(ReviewComponent, _React$Component);

  function ReviewComponent(props) {
    _classCallCheck(this, ReviewComponent);

    var _this = _possibleConstructorReturn(this, (ReviewComponent.__proto__ || Object.getPrototypeOf(ReviewComponent)).call(this, props));

    _this.state = {
      userReview: _this.props.review,
      editMode: false,
      reviewSubmitted: false,
      currentInput: _this.props.review
    };
    return _this;
  }

  _createClass(ReviewComponent, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        userReview: nextProps.review,
        editMode: false
      });
    }
  }, {
    key: 'handleEdit',
    value: function handleEdit() {
      this.setState({
        editMode: true,
        reviewSubmitted: false
      });
    }
  }, {
    key: 'closeEdit',
    value: function closeEdit() {
      this.setState({
        editMode: false,
        currentInput: this.state.userReview
      });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit() {
      this.setState({
        editMode: false,
        userReview: this.state.currentInput
      });
      this.updateReview(this.state.currentInput);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({
        currentInput: event.target.value
      });
    }
  }, {
    key: 'updateReview',
    value: function updateReview(review) {
      var _this2 = this;

      var movieObj = {
        title: this.props.title,
        id: this.props.id,
        review: review
      };
      $.post(Url + '/ratemovie', movieObj).done(function (response) {
        // console.log('movie rating updated');
        _this2.setState({
          reviewSubmitted: true
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

  return ReviewComponent;
}(React.Component);

window.ReviewComponent = ReviewComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9SZXZpZXdDb21wb25lbnQuanMiXSwibmFtZXMiOlsiUmV2aWV3Q29tcG9uZW50IiwicHJvcHMiLCJzdGF0ZSIsInVzZXJSZXZpZXciLCJyZXZpZXciLCJlZGl0TW9kZSIsInJldmlld1N1Ym1pdHRlZCIsImN1cnJlbnRJbnB1dCIsIm5leHRQcm9wcyIsInNldFN0YXRlIiwidXBkYXRlUmV2aWV3IiwiZXZlbnQiLCJ0YXJnZXQiLCJ2YWx1ZSIsIm1vdmllT2JqIiwidGl0bGUiLCJpZCIsIiQiLCJwb3N0IiwiVXJsIiwiZG9uZSIsImhhbmRsZUNoYW5nZSIsImJpbmQiLCJoYW5kbGVTdWJtaXQiLCJjbG9zZUVkaXQiLCJoYW5kbGVFZGl0IiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsZTs7O0FBRUosMkJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxrSUFDWEEsS0FEVzs7QUFFakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGtCQUFZLE1BQUtGLEtBQUwsQ0FBV0csTUFEWjtBQUVYQyxnQkFBVSxLQUZDO0FBR1hDLHVCQUFpQixLQUhOO0FBSVhDLG9CQUFjLE1BQUtOLEtBQUwsQ0FBV0c7QUFKZCxLQUFiO0FBRmlCO0FBUWxCOzs7OzhDQUV5QkksUyxFQUFXO0FBQ25DLFdBQUtDLFFBQUwsQ0FBYztBQUNaTixvQkFBWUssVUFBVUosTUFEVjtBQUVaQyxrQkFBVTtBQUZFLE9BQWQ7QUFJRDs7O2lDQUVZO0FBQ1gsV0FBS0ksUUFBTCxDQUFjO0FBQ1pKLGtCQUFVLElBREU7QUFFWkMseUJBQWlCO0FBRkwsT0FBZDtBQUlEOzs7Z0NBRVc7QUFDVixXQUFLRyxRQUFMLENBQWM7QUFDWkosa0JBQVUsS0FERTtBQUVaRSxzQkFBYyxLQUFLTCxLQUFMLENBQVdDO0FBRmIsT0FBZDtBQUlEOzs7bUNBRWM7QUFDYixXQUFLTSxRQUFMLENBQWM7QUFDWkosa0JBQVUsS0FERTtBQUVaRixvQkFBWSxLQUFLRCxLQUFMLENBQVdLO0FBRlgsT0FBZDtBQUlBLFdBQUtHLFlBQUwsQ0FBa0IsS0FBS1IsS0FBTCxDQUFXSyxZQUE3QjtBQUNEOzs7aUNBRVlJLEssRUFBTztBQUNsQixXQUFLRixRQUFMLENBQWM7QUFDWkYsc0JBQWNJLE1BQU1DLE1BQU4sQ0FBYUM7QUFEZixPQUFkO0FBR0Q7OztpQ0FFWVQsTSxFQUFRO0FBQUE7O0FBQ25CLFVBQUlVLFdBQVc7QUFDYkMsZUFBTyxLQUFLZCxLQUFMLENBQVdjLEtBREw7QUFFYkMsWUFBSSxLQUFLZixLQUFMLENBQVdlLEVBRkY7QUFHYlosZ0JBQVFBO0FBSEssT0FBZjtBQUtBYSxRQUFFQyxJQUFGLENBQU9DLE1BQU0sWUFBYixFQUEyQkwsUUFBM0IsRUFDQ00sSUFERCxDQUNNLG9CQUFZO0FBQ2hCO0FBQ0EsZUFBS1gsUUFBTCxDQUFjO0FBQ1pILDJCQUFpQjtBQURMLFNBQWQ7QUFHRCxPQU5EO0FBT0Q7Ozs2QkFFUTtBQUNQLFVBQUksS0FBS0osS0FBTCxDQUFXRyxRQUFmLEVBQXlCO0FBQ3pCLGVBQ0k7QUFBQTtBQUFBLFlBQUssV0FBVSxRQUFmO0FBQUE7QUFFRyw0Q0FBVSxNQUFLLElBQWYsRUFBb0IsTUFBSyxHQUF6QixFQUE2QixPQUFPLEtBQUtILEtBQUwsQ0FBV0ssWUFBL0MsRUFBNkQsVUFBVSxLQUFLYyxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixJQUF2QixDQUF2RSxFQUFxRyxXQUFVLEtBQS9HLEdBRkg7QUFHRztBQUFBO0FBQUEsY0FBUSxTQUFTLEtBQUtDLFlBQUwsQ0FBa0JELElBQWxCLENBQXVCLElBQXZCLENBQWpCO0FBQUE7QUFBQSxXQUhIO0FBSUc7QUFBQTtBQUFBLGNBQVEsU0FBUyxLQUFLRSxTQUFMLENBQWVGLElBQWYsQ0FBb0IsSUFBcEIsQ0FBakI7QUFBQTtBQUFBO0FBSkgsU0FESjtBQU9DLE9BUkQsTUFRTztBQUNMLGVBQ0U7QUFBQTtBQUFBLFlBQUssV0FBVSxZQUFmO0FBQ0U7QUFBQTtBQUFBLGNBQUssV0FBVSxRQUFmO0FBQUE7QUFBb0M7QUFBQTtBQUFBLGdCQUFRLFdBQVUsa0JBQWxCLEVBQXFDLFNBQVMsS0FBS0csVUFBTCxDQUFnQkgsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBOUM7QUFBQTtBQUFBO0FBQXBDLFdBREY7QUFFRTtBQUFBO0FBQUEsY0FBSyxXQUFVLFdBQWY7QUFBNkIsaUJBQUtwQixLQUFMLENBQVdDLFVBQVgsS0FBMEIsRUFBMUIsSUFBZ0MsS0FBS0QsS0FBTCxDQUFXQyxVQUFYLEtBQTBCLElBQTNELEdBQW1FLHFDQUFuRSxHQUEyRyxLQUFLRCxLQUFMLENBQVdDO0FBQWxKLFdBRkY7QUFHSSxlQUFLRCxLQUFMLENBQVdJLGVBQVosR0FBK0I7QUFBQTtBQUFBLGNBQUssV0FBVSxXQUFmO0FBQUE7QUFBQSxXQUEvQixHQUFtRjtBQUh0RixTQURGO0FBTUQ7QUFDSDs7OztFQS9FNEJvQixNQUFNQyxTOztBQWtGcENDLE9BQU81QixlQUFQLEdBQXlCQSxlQUF6QiIsImZpbGUiOiJSZXZpZXdDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBSZXZpZXdDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdXNlclJldmlldzogdGhpcy5wcm9wcy5yZXZpZXcsXHJcbiAgICAgIGVkaXRNb2RlOiBmYWxzZSxcclxuICAgICAgcmV2aWV3U3VibWl0dGVkOiBmYWxzZSxcclxuICAgICAgY3VycmVudElucHV0OiB0aGlzLnByb3BzLnJldmlld1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdXNlclJldmlldzogbmV4dFByb3BzLnJldmlldyxcclxuICAgICAgZWRpdE1vZGU6IGZhbHNlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUVkaXQoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZWRpdE1vZGU6IHRydWUsXHJcbiAgICAgIHJldmlld1N1Ym1pdHRlZDogZmFsc2VcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2xvc2VFZGl0KCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGVkaXRNb2RlOiBmYWxzZSxcclxuICAgICAgY3VycmVudElucHV0OiB0aGlzLnN0YXRlLnVzZXJSZXZpZXdcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlU3VibWl0KCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGVkaXRNb2RlOiBmYWxzZSxcclxuICAgICAgdXNlclJldmlldzogdGhpcy5zdGF0ZS5jdXJyZW50SW5wdXRcclxuICAgIH0pO1xyXG4gICAgdGhpcy51cGRhdGVSZXZpZXcodGhpcy5zdGF0ZS5jdXJyZW50SW5wdXQpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgY3VycmVudElucHV0OiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUmV2aWV3KHJldmlldykge1xyXG4gICAgdmFyIG1vdmllT2JqID0ge1xyXG4gICAgICB0aXRsZTogdGhpcy5wcm9wcy50aXRsZSwgXHJcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxyXG4gICAgICByZXZpZXc6IHJldmlld1xyXG4gICAgfTtcclxuICAgICQucG9zdChVcmwgKyAnL3JhdGVtb3ZpZScsIG1vdmllT2JqKVxyXG4gICAgLmRvbmUocmVzcG9uc2UgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnbW92aWUgcmF0aW5nIHVwZGF0ZWQnKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgcmV2aWV3U3VibWl0dGVkOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdE1vZGUpIHtcclxuICBcdFx0cmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncmV2aWV3Jz5cclxuICAgICAgICAgIEVudGVyIHlvdXIgcmV2aWV3LCAyNTUgY2hhcmFjdGVycyBtYXhpbXVtXHJcbiAgICAgICAgICAgPHRleHRhcmVhIGNvbHM9XCI0MFwiIHJvd3M9XCI1XCIgdmFsdWU9e3RoaXMuc3RhdGUuY3VycmVudElucHV0fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0gbWF4bGVuZ3RoPVwiMjU1XCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyl9PnN1Ym1pdCByZXZpZXc8L2J1dHRvbj5cclxuICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuY2xvc2VFZGl0LmJpbmQodGhpcyl9PmNhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2Pik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSd1c2VyUmV2aWV3Jz5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyZXZpZXcnPllvdXIgUmV2aWV3OjxidXR0b24gY2xhc3NOYW1lPSdlZGl0UmV2aWV3QnV0dG9uJyBvbkNsaWNrPXt0aGlzLmhhbmRsZUVkaXQuYmluZCh0aGlzKX0+RWRpdCBSZXZpZXc8L2J1dHRvbj48L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0aGVSZXZpZXcnPnsodGhpcy5zdGF0ZS51c2VyUmV2aWV3ID09PSAnJyB8fCB0aGlzLnN0YXRlLnVzZXJSZXZpZXcgPT09IG51bGwpID8gJ1lvdSBoYXZlIG5vdCByZXZpZXdlZCB0aGUgbW92aWUgeWV0JyA6IHRoaXMuc3RhdGUudXNlclJldmlld308L2Rpdj5cclxuICAgICAgICAgIHsodGhpcy5zdGF0ZS5yZXZpZXdTdWJtaXR0ZWQpID8gPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj5yZXZpZXcgc3VibWl0dGVkPC9kaXY+IDogJyd9XHJcbiAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxuXHR9XHJcbn1cclxuXHJcbndpbmRvdy5SZXZpZXdDb21wb25lbnQgPSBSZXZpZXdDb21wb25lbnQ7Il19