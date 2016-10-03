'use strict';

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var d = c[i]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(b, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var MovieListEntry = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      userRating: d.props.movie.score,
      userReview: d.props.movie.review,
      friendAverageRating: Math.round(d.props.movie.friendAverageRating * 10) / 10
    };
    return d;
  }

  _createClass(b, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(c) {
      this.setState({
        userRating: c.movie.score,
        userReview: this.props.movie.review,
        friendAverageRating: c.movie.friendAverageRating
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this,
          c = this.props.movie;

      if (this.props.friendName) {
        var d = React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            null,
            this.props.friendName + ' rates',
            ' ',
            React.createElement(
              'span',
              { className: 'friendScore' },
              c.friendScore
            ),
            ' '
          ),
          React.createElement(
            'div',
            { className: 'friendReview' },
            this.props.friendName + '\'s review: ' + (c.friendReview !== null ? c.friendReview : this.props.friendName + ' did not leave a review')
          )
        );
      } else {
        var d = '';
      }

      return React.createElement(
        'div',
        { className: 'movieEntry collection-item row' },
        React.createElement('img', { className: 'moviethumnail col s3', src: c.poster, onClick: function onClick() {
            return _this2.props.change("SingleMovie", c);
          }, alt: 'no_image_available.gif' }),
        React.createElement(
          'div',
          { className: 'right col s9' },
          React.createElement(
            'h5',
            { className: 'movieTitle', onClick: function onClick() {
                return _this2.props.change("SingleMovie", c);
              } },
            c.title
          ),
          React.createElement(
            'p',
            { className: 'movieYear' },
            c.release_date
          ),
          React.createElement(
            'p',
            { className: 'movieDescription' },
            c.description
          ),
          React.createElement(ReviewComponent, {
            review: c.review,
            title: c.title,
            id: c.id }),
          React.createElement(MovieWatchRequest, { movie: c }),
          React.createElement(
            'div',
            { className: 'ratings row' },
            React.createElement(
              'div',
              { className: 'imdbRating col s4' },
              'IMDB Rating: ',
              React.createElement(
                'b',
                null,
                c.imdbRating,
                '/10'
              )
            ),
            React.createElement(StarRatingComponent, { movie: c }),
            React.createElement(
              'div',
              { className: 'avgFriendRatingBlock col s4' },
              'Average Friend Rating: ',
              c.friendAverageRating ? React.createElement(
                'b',
                { className: 'friendRating' },
                c.friendAverageRating,
                '/5'
              ) : 'n/a'
            )
          ),
          d
        )
      );
    }
  }]);

  return b;
}(React.Component);

window.MovieListEntry = MovieListEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZUxpc3RFbnRyeS5qc3giXSwibmFtZXMiOlsiTW92aWVMaXN0RW50cnkiLCJwcm9wcyIsInN0YXRlIiwidXNlclJhdGluZyIsIm1vdmllIiwic2NvcmUiLCJ1c2VyUmV2aWV3IiwicmV2aWV3IiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsIk1hdGgiLCJyb3VuZCIsIm5leHRQcm9wcyIsInNldFN0YXRlIiwiZnJpZW5kTmFtZSIsImZyaWVuZFNlY3Rpb24iLCJmcmllbmRTY29yZSIsImZyaWVuZFJldmlldyIsInBvc3RlciIsImNoYW5nZSIsInRpdGxlIiwicmVsZWFzZV9kYXRlIiwiZGVzY3JpcHRpb24iLCJpZCIsImltZGJSYXRpbmciLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxjOzs7QUFFSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBRWpCLE1BQUtDLEtBQUwsR0FBYTtBQUNYQyxrQkFBWSxFQUFLRixLQUFMLENBQVdHLEtBQVgsQ0FBaUJDLEtBRGxCO0FBRVhDLGtCQUFZLEVBQUtMLEtBQUwsQ0FBV0csS0FBWCxDQUFpQkcsTUFGbEI7QUFHWEMsMkJBQXFCQyxLQUFLQyxLQUFMLENBQVksRUFBS1QsS0FBTCxDQUFXRyxLQUFYLENBQWlCSSxtQkFBakIsR0FBdUMsRUFBbkQsSUFBMEQ7QUFIcEUsS0FBYjtBQUZpQjtBQU9sQjs7Ozs4Q0FFeUJHLEMsRUFBVztBQUNuQyxXQUFLQyxRQUFMLENBQWM7QUFDWlQsb0JBQVlRLEVBQVVQLEtBQVYsQ0FBZ0JDLEtBRGhCO0FBRVpDLG9CQUFZLEtBQUtMLEtBQUwsQ0FBV0csS0FBWCxDQUFpQkcsTUFGakI7QUFHWkMsNkJBQXFCRyxFQUFVUCxLQUFWLENBQWdCSTtBQUh6QixPQUFkO0FBS0Q7Ozs2QkFFUTtBQUFBO0FBQUEsVUFDSEosSUFBUSxLQUFLSCxLQUFMLENBQVdHLEtBRGhCOztBQUdQLFVBQUksS0FBS0gsS0FBTCxDQUFXWSxVQUFmLEVBQTJCO0FBQ3pCLFlBQUlDLElBQ0Y7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQVMsaUJBQUtiLEtBQUwsQ0FBV1ksVUFBcEI7QUFBQTtBQUF3QztBQUFBO0FBQUEsZ0JBQU0sV0FBVSxhQUFoQjtBQUErQlQsZ0JBQU1XO0FBQXJDLGFBQXhDO0FBQUE7QUFBQSxXQURGO0FBRUU7QUFBQTtBQUFBLGNBQUssV0FBVSxjQUFmO0FBQWtDLGlCQUFLZCxLQUFMLENBQVdZLFVBQTdDLHFCQUFzRVQsRUFBTVksWUFBTixLQUF1QixJQUF4QixHQUFnQ1osRUFBTVksWUFBdEMsR0FBcUQsS0FBS2YsS0FBTCxDQUFXWSxVQUFYLEdBQXdCLHlCQUFsSjtBQUFBO0FBRkYsU0FERjtBQU1ELE9BUEQsTUFPTztBQUNMLFlBQUlDLElBQWdCLEVBQXBCO0FBQ0Q7O0FBRUYsYUFDQztBQUFBO0FBQUEsVUFBSyxXQUFVLGdDQUFmO0FBQ0MscUNBQUssV0FBVSxzQkFBZixFQUFzQyxLQUFLVixFQUFNYSxNQUFqRCxFQUF5RCxTQUFTO0FBQUEsbUJBQU8sT0FBS2hCLEtBQUwsQ0FBV2lCLE1BQVgsQ0FBa0IsYUFBbEIsRUFBaUNkLENBQWpDLENBQVA7QUFBQSxXQUFsRSxFQUFtSCxLQUFJLHdCQUF2SCxHQUREO0FBRUk7QUFBQTtBQUFBLFlBQUssV0FBVSxjQUFmO0FBQ0Q7QUFBQTtBQUFBLGNBQUksV0FBVSxZQUFkLEVBQTJCLFNBQVM7QUFBQSx1QkFBTyxPQUFLSCxLQUFMLENBQVdpQixNQUFYLENBQWtCLGFBQWxCLEVBQWlDZCxDQUFqQyxDQUFQO0FBQUEsZUFBcEM7QUFBc0ZBLGNBQU1lO0FBQTVGLFdBREM7QUFFRDtBQUFBO0FBQUEsY0FBRyxXQUFVLFdBQWI7QUFBMEJmLGNBQU1nQjtBQUFoQyxXQUZDO0FBR0Q7QUFBQTtBQUFBLGNBQUcsV0FBVSxrQkFBYjtBQUFpQ2hCLGNBQU1pQjtBQUF2QyxXQUhDO0FBSUUsOEJBQUMsZUFBRDtBQUNFLG9CQUFRakIsRUFBTUcsTUFEaEI7QUFFRSxtQkFBT0gsRUFBTWUsS0FGZjtBQUdFLGdCQUFJZixFQUFNa0IsRUFIWixHQUpGO0FBUUUsOEJBQUMsaUJBQUQsSUFBbUIsT0FBT2xCLENBQTFCLEdBUkY7QUFVRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGFBQWY7QUFDRDtBQUFBO0FBQUEsZ0JBQUssV0FBVSxtQkFBZjtBQUFBO0FBQWdEO0FBQUE7QUFBQTtBQUFJQSxrQkFBTW1CLFVBQVY7QUFBQTtBQUFBO0FBQWhELGFBREM7QUFFRSxnQ0FBQyxtQkFBRCxJQUFxQixPQUFPbkIsQ0FBNUIsR0FGRjtBQUdFO0FBQUE7QUFBQSxnQkFBSyxXQUFVLDZCQUFmO0FBQUE7QUFBc0VBLGdCQUFNSSxtQkFBUCxHQUE4QjtBQUFBO0FBQUEsa0JBQUcsV0FBVSxjQUFiO0FBQTZCSixrQkFBTUksbUJBQW5DO0FBQUE7QUFBQSxlQUE5QixHQUE4RjtBQUFuSztBQUhGLFdBVkY7QUFlR007QUFmSDtBQUZKLE9BREQ7QUFzQkQ7Ozs7RUF2RDJCVSxNQUFNQyxTOztBQTBEbkNDLE9BQU8xQixjQUFQLEdBQXdCQSxjQUF4QiIsImZpbGUiOiJNb3ZpZUxpc3RFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1vdmllTGlzdEVudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHVzZXJSYXRpbmc6IHRoaXMucHJvcHMubW92aWUuc2NvcmUsXHJcbiAgICAgIHVzZXJSZXZpZXc6IHRoaXMucHJvcHMubW92aWUucmV2aWV3LFxyXG4gICAgICBmcmllbmRBdmVyYWdlUmF0aW5nOiBNYXRoLnJvdW5kKCB0aGlzLnByb3BzLm1vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgKiAxMCApIC8gMTBcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHVzZXJSYXRpbmc6IG5leHRQcm9wcy5tb3ZpZS5zY29yZSxcclxuICAgICAgdXNlclJldmlldzogdGhpcy5wcm9wcy5tb3ZpZS5yZXZpZXcsXHJcbiAgICAgIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG5leHRQcm9wcy5tb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGxldCBtb3ZpZSA9IHRoaXMucHJvcHMubW92aWU7XHJcblxyXG4gICAgaWYgKHRoaXMucHJvcHMuZnJpZW5kTmFtZSkge1xyXG4gICAgICB2YXIgZnJpZW5kU2VjdGlvbiA9IChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGRpdj57YCR7dGhpcy5wcm9wcy5mcmllbmROYW1lfSByYXRlc2B9IDxzcGFuIGNsYXNzTmFtZT0nZnJpZW5kU2NvcmUnPnttb3ZpZS5mcmllbmRTY29yZX08L3NwYW4+IDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZyaWVuZFJldmlldyc+e2Ake3RoaXMucHJvcHMuZnJpZW5kTmFtZX0ncyByZXZpZXc6ICR7KG1vdmllLmZyaWVuZFJldmlldyAhPT0gbnVsbCkgPyBtb3ZpZS5mcmllbmRSZXZpZXcgOiB0aGlzLnByb3BzLmZyaWVuZE5hbWUgKyAnIGRpZCBub3QgbGVhdmUgYSByZXZpZXcnfWB9PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBmcmllbmRTZWN0aW9uID0gJyc7XHJcbiAgICB9XHJcblxyXG4gIFx0cmV0dXJuIChcclxuICBcdFx0PGRpdiBjbGFzc05hbWU9J21vdmllRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvdyc+XHJcbiAgXHRcdFx0PGltZyBjbGFzc05hbWU9J21vdmlldGh1bW5haWwgY29sIHMzJyBzcmM9e21vdmllLnBvc3Rlcn0gb25DbGljaz17KCkgPT4gKHRoaXMucHJvcHMuY2hhbmdlKFwiU2luZ2xlTW92aWVcIiwgbW92aWUpKX0gYWx0PVwibm9faW1hZ2VfYXZhaWxhYmxlLmdpZlwiLz5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncmlnaHQgY29sIHM5Jz5cclxuICAgIFx0XHRcdDxoNSBjbGFzc05hbWU9J21vdmllVGl0bGUnIG9uQ2xpY2s9eygpID0+ICh0aGlzLnByb3BzLmNoYW5nZShcIlNpbmdsZU1vdmllXCIsIG1vdmllKSl9Pnttb3ZpZS50aXRsZX08L2g1PlxyXG4gICAgXHRcdFx0PHAgY2xhc3NOYW1lPSdtb3ZpZVllYXInPnttb3ZpZS5yZWxlYXNlX2RhdGV9PC9wPlxyXG4gICAgXHRcdFx0PHAgY2xhc3NOYW1lPSdtb3ZpZURlc2NyaXB0aW9uJz57bW92aWUuZGVzY3JpcHRpb259PC9wPlxyXG4gICAgICAgICAgPFJldmlld0NvbXBvbmVudFxyXG4gICAgICAgICAgICByZXZpZXc9e21vdmllLnJldmlld30gXHJcbiAgICAgICAgICAgIHRpdGxlPXttb3ZpZS50aXRsZX1cclxuICAgICAgICAgICAgaWQ9e21vdmllLmlkfS8+XHJcbiAgICAgICAgICA8TW92aWVXYXRjaFJlcXVlc3QgbW92aWU9e21vdmllfS8+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyYXRpbmdzIHJvd1wiPlxyXG4gICAgICBcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW1kYlJhdGluZyBjb2wgczQnPklNREIgUmF0aW5nOiA8Yj57bW92aWUuaW1kYlJhdGluZ30vMTA8L2I+PC9kaXY+XHJcbiAgICAgICAgICAgIDxTdGFyUmF0aW5nQ29tcG9uZW50IG1vdmllPXttb3ZpZX0vPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYXZnRnJpZW5kUmF0aW5nQmxvY2sgY29sIHM0Jz5BdmVyYWdlIEZyaWVuZCBSYXRpbmc6IHsobW92aWUuZnJpZW5kQXZlcmFnZVJhdGluZykgPyA8YiBjbGFzc05hbWU9XCJmcmllbmRSYXRpbmdcIj57bW92aWUuZnJpZW5kQXZlcmFnZVJhdGluZ30vNTwvYj4gOiAnbi9hJyB9PC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIHtmcmllbmRTZWN0aW9ufVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj4pO1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbndpbmRvdy5Nb3ZpZUxpc3RFbnRyeSA9IE1vdmllTGlzdEVudHJ5OyJdfQ==