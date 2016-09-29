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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZUxpc3RFbnRyeS5qcyJdLCJuYW1lcyI6WyJNb3ZpZUxpc3RFbnRyeSIsInByb3BzIiwic3RhdGUiLCJ1c2VyUmF0aW5nIiwibW92aWUiLCJzY29yZSIsInVzZXJSZXZpZXciLCJyZXZpZXciLCJmcmllbmRBdmVyYWdlUmF0aW5nIiwiTWF0aCIsInJvdW5kIiwibmV4dFByb3BzIiwic2V0U3RhdGUiLCJmcmllbmROYW1lIiwiZnJpZW5kU2VjdGlvbiIsImZyaWVuZFNjb3JlIiwiZnJpZW5kUmV2aWV3IiwicG9zdGVyIiwiY2hhbmdlIiwidGl0bGUiLCJyZWxlYXNlX2RhdGUiLCJkZXNjcmlwdGlvbiIsImlkIiwiaW1kYlJhdGluZyIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLGM7OztBQUVKLGFBQVlDLENBQVosRUFBbUI7QUFBQTs7QUFBQSxrR0FDWEEsQ0FEVzs7QUFFakIsTUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGtCQUFZLEVBQUtGLEtBQUwsQ0FBV0csS0FBWCxDQUFpQkMsS0FEbEI7QUFFWEMsa0JBQVksRUFBS0wsS0FBTCxDQUFXRyxLQUFYLENBQWlCRyxNQUZsQjtBQUdYQywyQkFBcUJDLEtBQUtDLEtBQUwsQ0FBWSxFQUFLVCxLQUFMLENBQVdHLEtBQVgsQ0FBaUJJLG1CQUFqQixHQUF1QyxFQUFuRCxJQUEwRDtBQUhwRSxLQUFiO0FBRmlCO0FBT2xCOzs7OzhDQUV5QkcsQyxFQUFXO0FBQ25DLFdBQUtDLFFBQUwsQ0FBYztBQUNaVCxvQkFBWVEsRUFBVVAsS0FBVixDQUFnQkMsS0FEaEI7QUFFWkMsb0JBQVksS0FBS0wsS0FBTCxDQUFXRyxLQUFYLENBQWlCRyxNQUZqQjtBQUdaQyw2QkFBcUJHLEVBQVVQLEtBQVYsQ0FBZ0JJO0FBSHpCLE9BQWQ7QUFLRDs7OzZCQUVRO0FBQUE7QUFBQSxVQUNISixJQUFRLEtBQUtILEtBQUwsQ0FBV0csS0FEaEI7O0FBR1AsVUFBSSxLQUFLSCxLQUFMLENBQVdZLFVBQWYsRUFBMkI7QUFDekIsWUFBSUMsSUFDRjtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBUyxpQkFBS2IsS0FBTCxDQUFXWSxVQUFwQjtBQUFBO0FBQXdDO0FBQUE7QUFBQSxnQkFBTSxXQUFVLGFBQWhCO0FBQStCVCxnQkFBTVc7QUFBckMsYUFBeEM7QUFBQTtBQUFBLFdBREY7QUFFRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGNBQWY7QUFBa0MsaUJBQUtkLEtBQUwsQ0FBV1ksVUFBN0MscUJBQXNFVCxFQUFNWSxZQUFOLEtBQXVCLElBQXhCLEdBQWdDWixFQUFNWSxZQUF0QyxHQUFxRCxLQUFLZixLQUFMLENBQVdZLFVBQVgsR0FBd0IseUJBQWxKO0FBQUE7QUFGRixTQURGO0FBTUQsT0FQRCxNQU9PO0FBQ0wsWUFBSUMsSUFBZ0IsRUFBcEI7QUFDRDs7QUFFRixhQUNDO0FBQUE7QUFBQSxVQUFLLFdBQVUsZ0NBQWY7QUFDQyxxQ0FBSyxXQUFVLHNCQUFmLEVBQXNDLEtBQUtWLEVBQU1hLE1BQWpELEVBQXlELFNBQVM7QUFBQSxtQkFBTyxPQUFLaEIsS0FBTCxDQUFXaUIsTUFBWCxDQUFrQixhQUFsQixFQUFpQ2QsQ0FBakMsQ0FBUDtBQUFBLFdBQWxFLEVBQW1ILEtBQUksd0JBQXZILEdBREQ7QUFFSTtBQUFBO0FBQUEsWUFBSyxXQUFVLGNBQWY7QUFDRDtBQUFBO0FBQUEsY0FBSSxXQUFVLFlBQWQsRUFBMkIsU0FBUztBQUFBLHVCQUFPLE9BQUtILEtBQUwsQ0FBV2lCLE1BQVgsQ0FBa0IsYUFBbEIsRUFBaUNkLENBQWpDLENBQVA7QUFBQSxlQUFwQztBQUFzRkEsY0FBTWU7QUFBNUYsV0FEQztBQUVEO0FBQUE7QUFBQSxjQUFHLFdBQVUsV0FBYjtBQUEwQmYsY0FBTWdCO0FBQWhDLFdBRkM7QUFHRDtBQUFBO0FBQUEsY0FBRyxXQUFVLGtCQUFiO0FBQWlDaEIsY0FBTWlCO0FBQXZDLFdBSEM7QUFJRSw4QkFBQyxlQUFEO0FBQ0Usb0JBQVFqQixFQUFNRyxNQURoQjtBQUVFLG1CQUFPSCxFQUFNZSxLQUZmO0FBR0UsZ0JBQUlmLEVBQU1rQixFQUhaLEdBSkY7QUFRRSw4QkFBQyxpQkFBRCxJQUFtQixPQUFPbEIsQ0FBMUIsR0FSRjtBQVVFO0FBQUE7QUFBQSxjQUFLLFdBQVUsYUFBZjtBQUNEO0FBQUE7QUFBQSxnQkFBSyxXQUFVLG1CQUFmO0FBQUE7QUFBZ0Q7QUFBQTtBQUFBO0FBQUlBLGtCQUFNbUIsVUFBVjtBQUFBO0FBQUE7QUFBaEQsYUFEQztBQUVFLGdDQUFDLG1CQUFELElBQXFCLE9BQU9uQixDQUE1QixHQUZGO0FBR0U7QUFBQTtBQUFBLGdCQUFLLFdBQVUsNkJBQWY7QUFBQTtBQUFzRUEsZ0JBQU1JLG1CQUFQLEdBQThCO0FBQUE7QUFBQSxrQkFBRyxXQUFVLGNBQWI7QUFBNkJKLGtCQUFNSSxtQkFBbkM7QUFBQTtBQUFBLGVBQTlCLEdBQThGO0FBQW5LO0FBSEYsV0FWRjtBQWVHTTtBQWZIO0FBRkosT0FERDtBQXNCRDs7OztFQXZEMkJVLE1BQU1DLFM7O0FBMERuQ0MsT0FBTzFCLGNBQVAsR0FBd0JBLGNBQXhCIiwiZmlsZSI6Ik1vdmllTGlzdEVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTW92aWVMaXN0RW50cnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdXNlclJhdGluZzogdGhpcy5wcm9wcy5tb3ZpZS5zY29yZSxcclxuICAgICAgdXNlclJldmlldzogdGhpcy5wcm9wcy5tb3ZpZS5yZXZpZXcsXHJcbiAgICAgIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IE1hdGgucm91bmQoIHRoaXMucHJvcHMubW92aWUuZnJpZW5kQXZlcmFnZVJhdGluZyAqIDEwICkgLyAxMFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdXNlclJhdGluZzogbmV4dFByb3BzLm1vdmllLnNjb3JlLFxyXG4gICAgICB1c2VyUmV2aWV3OiB0aGlzLnByb3BzLm1vdmllLnJldmlldyxcclxuICAgICAgZnJpZW5kQXZlcmFnZVJhdGluZzogbmV4dFByb3BzLm1vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmdcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgbGV0IG1vdmllID0gdGhpcy5wcm9wcy5tb3ZpZTtcclxuXHJcbiAgICBpZiAodGhpcy5wcm9wcy5mcmllbmROYW1lKSB7XHJcbiAgICAgIHZhciBmcmllbmRTZWN0aW9uID0gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8ZGl2PntgJHt0aGlzLnByb3BzLmZyaWVuZE5hbWV9IHJhdGVzYH0gPHNwYW4gY2xhc3NOYW1lPSdmcmllbmRTY29yZSc+e21vdmllLmZyaWVuZFNjb3JlfTwvc3Bhbj4gPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZnJpZW5kUmV2aWV3Jz57YCR7dGhpcy5wcm9wcy5mcmllbmROYW1lfSdzIHJldmlldzogJHsobW92aWUuZnJpZW5kUmV2aWV3ICE9PSBudWxsKSA/IG1vdmllLmZyaWVuZFJldmlldyA6IHRoaXMucHJvcHMuZnJpZW5kTmFtZSArICcgZGlkIG5vdCBsZWF2ZSBhIHJldmlldyd9YH08L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIGZyaWVuZFNlY3Rpb24gPSAnJztcclxuICAgIH1cclxuXHJcbiAgXHRyZXR1cm4gKFxyXG4gIFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbW92aWVFbnRyeSBjb2xsZWN0aW9uLWl0ZW0gcm93Jz5cclxuICBcdFx0XHQ8aW1nIGNsYXNzTmFtZT0nbW92aWV0aHVtbmFpbCBjb2wgczMnIHNyYz17bW92aWUucG9zdGVyfSBvbkNsaWNrPXsoKSA9PiAodGhpcy5wcm9wcy5jaGFuZ2UoXCJTaW5nbGVNb3ZpZVwiLCBtb3ZpZSkpfSBhbHQ9XCJub19pbWFnZV9hdmFpbGFibGUuZ2lmXCIvPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyaWdodCBjb2wgczknPlxyXG4gICAgXHRcdFx0PGg1IGNsYXNzTmFtZT0nbW92aWVUaXRsZScgb25DbGljaz17KCkgPT4gKHRoaXMucHJvcHMuY2hhbmdlKFwiU2luZ2xlTW92aWVcIiwgbW92aWUpKX0+e21vdmllLnRpdGxlfTwvaDU+XHJcbiAgICBcdFx0XHQ8cCBjbGFzc05hbWU9J21vdmllWWVhcic+e21vdmllLnJlbGVhc2VfZGF0ZX08L3A+XHJcbiAgICBcdFx0XHQ8cCBjbGFzc05hbWU9J21vdmllRGVzY3JpcHRpb24nPnttb3ZpZS5kZXNjcmlwdGlvbn08L3A+XHJcbiAgICAgICAgICA8UmV2aWV3Q29tcG9uZW50XHJcbiAgICAgICAgICAgIHJldmlldz17bW92aWUucmV2aWV3fSBcclxuICAgICAgICAgICAgdGl0bGU9e21vdmllLnRpdGxlfVxyXG4gICAgICAgICAgICBpZD17bW92aWUuaWR9Lz5cclxuICAgICAgICAgIDxNb3ZpZVdhdGNoUmVxdWVzdCBtb3ZpZT17bW92aWV9Lz5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZ3Mgcm93XCI+XHJcbiAgICAgIFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpbWRiUmF0aW5nIGNvbCBzNCc+SU1EQiBSYXRpbmc6IDxiPnttb3ZpZS5pbWRiUmF0aW5nfS8xMDwvYj48L2Rpdj5cclxuICAgICAgICAgICAgPFN0YXJSYXRpbmdDb21wb25lbnQgbW92aWU9e21vdmllfS8+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdhdmdGcmllbmRSYXRpbmdCbG9jayBjb2wgczQnPkF2ZXJhZ2UgRnJpZW5kIFJhdGluZzogeyhtb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nKSA/IDxiIGNsYXNzTmFtZT1cImZyaWVuZFJhdGluZ1wiPnttb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nfS81PC9iPiA6ICduL2EnIH08L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAge2ZyaWVuZFNlY3Rpb259XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2Pik7XHJcblxyXG5cdH1cclxufVxyXG5cclxud2luZG93Lk1vdmllTGlzdEVudHJ5ID0gTW92aWVMaXN0RW50cnk7Il19