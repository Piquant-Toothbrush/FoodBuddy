'use strict';

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var d = c[i]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(b, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var SingleMovieRating = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      value: '',
      movie: d.props.currentMovie,
      view: 'SingleMovie',
      friendRatings: []
    };
    return d;
  }

  _createClass(b, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getFriendsRating(this.state.movie);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      this.setState({
        movie: this.props.movie
      });
    }
  }, {
    key: 'onStarClick',
    value: function onStarClick(c) {
      this.setState({ userRating: c.target.value });
      this.updateRating(c.target.value);
    }
  }, {
    key: 'getFriends',
    value: function getFriends() {
      var c = this;
      $.post(Url + '/getFriends').then(function (d) {
        // console.log(that.state.friends)
      }).catch(function (d) {});
    }

    //get friend ratings by calling requesthandler
    //get friendratings, passing in mainUser and movieobj

  }, {
    key: 'getFriendsRating',
    value: function getFriendsRating(c) {
      // console.log('posting')
      var d = this;
      $.post(Url + '/getFriendRatings', { movie: c }).then(function (e) {
        d.setState({
          friendRatings: e
        });
      }).catch(function (e) {});
      // console.log('this is the movie', inputMovie);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this,
          c = this,
          d = this.state.movie;

      return React.createElement(
        'div',
        { className: 'Home collection', onClick: function onClick() {
            return void 0;
          } },
        React.createElement(
          'div',
          { className: 'movieEntry collection-item row' },
          React.createElement('img', { className: 'moviethumnail col s3', src: d.poster, onClick: function onClick() {
              return _this2.props.change("SingleMovie", d);
            } }),
          React.createElement(
            'div',
            { className: 'right col s9' },
            React.createElement(
              'h5',
              { className: 'movieTitle', onClick: function onClick() {
                  return _this2.props.change("SingleMovie", d);
                } },
              d.title
            ),
            React.createElement(
              'p',
              { className: 'movieYear' },
              d.release_date
            ),
            React.createElement(
              'p',
              { className: 'movieDescription' },
              d.description
            ),
            React.createElement(ReviewComponent, {
              review: d.review,
              title: d.title,
              id: d.id }),
            React.createElement(MovieWatchRequest, { movie: d }),
            React.createElement(
              'div',
              { className: 'ratings row' },
              React.createElement(
                'div',
                { className: 'imdbRating col s4' },
                'IMDB rating: ',
                React.createElement(
                  'b',
                  null,
                  d.imdbRating
                )
              ),
              React.createElement(StarRatingComponent, { movie: d }),
              React.createElement(
                'div',
                { className: 'avgFriendRatingBlock col s4' },
                'average friend rating: ',
                d.friendAverageRating ? React.createElement(
                  'b',
                  null,
                  d.friendAverageRating
                ) : 'n/a'
              )
            )
          )
        ),
        React.createElement(
          'div',
          null,
          this.state.friendRatings.map(function (e) {
            return React.createElement(SingleMovieRatingEntry, {
              rating: e,
              change: c.props.change,
              fof: c.props.fof
            });
          })
        )
      );
    }
  }]);

  return b;
}(React.Component);

;

window.SingleMovieRating = SingleMovieRating;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZy5qcyJdLCJuYW1lcyI6WyJTaW5nbGVNb3ZpZVJhdGluZyIsInByb3BzIiwic3RhdGUiLCJ2YWx1ZSIsIm1vdmllIiwiY3VycmVudE1vdmllIiwidmlldyIsImZyaWVuZFJhdGluZ3MiLCJnZXRGcmllbmRzUmF0aW5nIiwic2V0U3RhdGUiLCJldmVudCIsInVzZXJSYXRpbmciLCJ0YXJnZXQiLCJ1cGRhdGVSYXRpbmciLCJ0aGF0IiwiJCIsInBvc3QiLCJVcmwiLCJ0aGVuIiwicmVzcCIsImNhdGNoIiwiZXJyIiwiaW5wdXRNb3ZpZSIsInJlc3BvbnNlIiwicG9zdGVyIiwiY2hhbmdlIiwidGl0bGUiLCJyZWxlYXNlX2RhdGUiLCJkZXNjcmlwdGlvbiIsInJldmlldyIsImlkIiwiaW1kYlJhdGluZyIsImZyaWVuZEF2ZXJhZ2VSYXRpbmciLCJtYXAiLCJmcmllbmRSYXRpbmciLCJmb2YiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxpQjs7O0FBQ0osYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUVqQixNQUFLQyxLQUFMLEdBQWE7QUFDWEMsYUFBTyxFQURJO0FBRVhDLGFBQU8sRUFBS0gsS0FBTCxDQUFXSSxZQUZQO0FBR1hDLFlBQU0sYUFISztBQUlYQyxxQkFBZTtBQUpKLEtBQWI7QUFGaUI7QUFRbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUtDLGdCQUFMLENBQXNCLEtBQUtOLEtBQUwsQ0FBV0UsS0FBakM7QUFFRDs7O2dEQUUyQjtBQUMxQixXQUFLSyxRQUFMLENBQWM7QUFDWkwsZUFBTyxLQUFLSCxLQUFMLENBQVdHO0FBRE4sT0FBZDtBQUdEOzs7Z0NBRVdNLEMsRUFBTztBQUNqQixXQUFLRCxRQUFMLENBQWMsRUFBQ0UsWUFBWUQsRUFBTUUsTUFBTixDQUFhVCxL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ZU1vdmllUmF0aW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2luZ2xlTW92aWVSYXRpbmcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB2YWx1ZTogJycsXHJcbiAgICAgIG1vdmllOiB0aGlzLnByb3BzLmN1cnJlbnRNb3ZpZSxcclxuICAgICAgdmlldzogJ1NpbmdsZU1vdmllJyxcclxuICAgICAgZnJpZW5kUmF0aW5nczogW11cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIHRoaXMuZ2V0RnJpZW5kc1JhdGluZyh0aGlzLnN0YXRlLm1vdmllKTtcclxuXHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIG1vdmllOiB0aGlzLnByb3BzLm1vdmllXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uU3RhckNsaWNrKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHt1c2VyUmF0aW5nOiBldmVudC50YXJnZXQudmFsdWV9KTtcclxuICAgIHRoaXMudXBkYXRlUmF0aW5nKGV2ZW50LnRhcmdldC52YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBnZXRGcmllbmRzKCkge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kcycpXHJcbiAgICAudGhlbihmdW5jdGlvbihyZXNwKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoYXQuc3RhdGUuZnJpZW5kcylcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vZ2V0IGZyaWVuZCByYXRpbmdzIGJ5IGNhbGxpbmcgcmVxdWVzdGhhbmRsZXJcclxuICAvL2dldCBmcmllbmRyYXRpbmdzLCBwYXNzaW5nIGluIG1haW5Vc2VyIGFuZCBtb3ZpZW9ialxyXG4gIGdldEZyaWVuZHNSYXRpbmcoaW5wdXRNb3ZpZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3Bvc3RpbmcnKVxyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kUmF0aW5ncycsIHttb3ZpZTogaW5wdXRNb3ZpZX0pXHJcbiAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyIGdldEZyaWVuZHNSYXRpbmc6ICcsIHJlc3BvbnNlKTtcclxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kUmF0aW5nczogcmVzcG9uc2VcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgIH0pO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIG1vdmllJywgaW5wdXRNb3ZpZSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICBsZXQgbW92aWUgPSB0aGlzLnN0YXRlLm1vdmllO1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9J0hvbWUgY29sbGVjdGlvbicgb25DbGljaz17KCk9PiBjb25zb2xlLmxvZyh0aGF0LnN0YXRlKX0+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb3ZpZUVudHJ5IGNvbGxlY3Rpb24taXRlbSByb3dcIj5cclxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSdtb3ZpZXRodW1uYWlsIGNvbCBzMycgc3JjPXttb3ZpZS5wb3N0ZXJ9IG9uQ2xpY2s9eygpID0+ICh0aGlzLnByb3BzLmNoYW5nZShcIlNpbmdsZU1vdmllXCIsIG1vdmllKSl9Lz5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyaWdodCBjb2wgczknPlxyXG4gICAgICAgICAgICA8aDUgY2xhc3NOYW1lPSdtb3ZpZVRpdGxlJyBvbkNsaWNrPXsoKSA9PiAodGhpcy5wcm9wcy5jaGFuZ2UoXCJTaW5nbGVNb3ZpZVwiLCBtb3ZpZSkpfT57bW92aWUudGl0bGV9PC9oNT5cclxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSdtb3ZpZVllYXInPnttb3ZpZS5yZWxlYXNlX2RhdGV9PC9wPlxyXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9J21vdmllRGVzY3JpcHRpb24nPnttb3ZpZS5kZXNjcmlwdGlvbn08L3A+XHJcbiAgICAgICAgICAgIDxSZXZpZXdDb21wb25lbnQgXHJcbiAgICAgICAgICAgICAgcmV2aWV3PXttb3ZpZS5yZXZpZXd9IFxyXG4gICAgICAgICAgICAgIHRpdGxlPXttb3ZpZS50aXRsZX1cclxuICAgICAgICAgICAgICBpZD17bW92aWUuaWR9Lz5cclxuICAgICAgICAgICAgPE1vdmllV2F0Y2hSZXF1ZXN0IG1vdmllPXttb3ZpZX0vPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyYXRpbmdzIHJvd1wiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpbWRiUmF0aW5nIGNvbCBzNCc+SU1EQiByYXRpbmc6IDxiPnttb3ZpZS5pbWRiUmF0aW5nfTwvYj48L2Rpdj5cclxuICAgICAgICAgICAgICA8U3RhclJhdGluZ0NvbXBvbmVudCBtb3ZpZT17bW92aWV9Lz5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYXZnRnJpZW5kUmF0aW5nQmxvY2sgY29sIHM0Jz5hdmVyYWdlIGZyaWVuZCByYXRpbmc6IHsobW92aWUuZnJpZW5kQXZlcmFnZVJhdGluZykgPyA8Yj57bW92aWUuZnJpZW5kQXZlcmFnZVJhdGluZ308L2I+IDogJ24vYScgfTwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICB7dGhpcy5zdGF0ZS5mcmllbmRSYXRpbmdzLm1hcChmcmllbmRSYXRpbmcgPT4gXHJcbiAgICAgICAgICAgIDxTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5IFxyXG4gICAgICAgICAgICByYXRpbmc9e2ZyaWVuZFJhdGluZ31cclxuICAgICAgICAgICAgY2hhbmdlPXt0aGF0LnByb3BzLmNoYW5nZX1cclxuICAgICAgICAgICAgZm9mPXt0aGF0LnByb3BzLmZvZn1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuXHJcbndpbmRvdy5TaW5nbGVNb3ZpZVJhdGluZyA9IFNpbmdsZU1vdmllUmF0aW5nOyJdfQ==