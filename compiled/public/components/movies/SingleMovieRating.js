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
        // console.log('response from server getFriendsRating: ', response);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZy5qcyJdLCJuYW1lcyI6WyJTaW5nbGVNb3ZpZVJhdGluZyIsInByb3BzIiwic3RhdGUiLCJ2YWx1ZSIsIm1vdmllIiwiY3VycmVudE1vdmllIiwidmlldyIsImZyaWVuZFJhdGluZ3MiLCJnZXRGcmllbmRzUmF0aW5nIiwic2V0U3RhdGUiLCJldmVudCIsInVzZXJSYXRpbmciLCJ0YXJnZXQiLCJ1cGRhdGVSYXRpbmciLCJ0aGF0IiwiJCIsInBvc3QiLCJVcmwiLCJ0aGVuIiwicmVzcCIsImNhdGNoIiwiZXJyIiwiaW5wdXRNb3ZpZSIsInJlc3BvbnNlIiwicG9zdGVyIiwiY2hhbmdlIiwidGl0bGUiLCJyZWxlYXNlX2RhdGUiLCJkZXNjcmlwdGlvbiIsInJldmlldyIsImlkIiwiaW1kYlJhdGluZyIsImZyaWVuZEF2ZXJhZ2VSYXRpbmciLCJtYXAiLCJmcmllbmRSYXRpbmciLCJmb2YiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxpQjs7O0FBQ0osYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUVqQixNQUFLQyxLQUFMLEdBQWE7QUFDWEMsYUFBTyxFQURJO0FBRVhDLGFBQU8sRUFBS0gsS0FBTCxDQUFXSSxZQUZQO0FBR1hDLFlBQU0sYUFISztBQUlYQyxxQkFBZTtBQUpKLEtBQWI7QUFGaUI7QUFRbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUtDLGdCQUFMLENBQXNCLEtBQUtOLEtBQUwsQ0FBV0UsS0FBakM7QUFFRDs7O2dEQUUyQjtBQUMxQixXQUFLSyxRQUFMLENBQWM7QUFDWkwsZUFBTyxLQUFLSCxLQUFMLENBQVdHO0FBRE4sT0FBZDtBQUdEOzs7Z0NBRVdNLEMsRUFBTztBQUNqQixXQUFLRCxRQUFMLENBQWMsRUFBQ0UsWUFBWUQsRUFBTUUsTUFBTixDQUFhVCxL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U2luZ2xlTW92aWVSYXRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTaW5nbGVNb3ZpZVJhdGluZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHZhbHVlOiAnJyxcclxuICAgICAgbW92aWU6IHRoaXMucHJvcHMuY3VycmVudE1vdmllLFxyXG4gICAgICB2aWV3OiAnU2luZ2xlTW92aWUnLFxyXG4gICAgICBmcmllbmRSYXRpbmdzOiBbXVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5nZXRGcmllbmRzUmF0aW5nKHRoaXMuc3RhdGUubW92aWUpO1xyXG4gICAgY29uc29sZS5sb2coXCJzaG91bGQgYmUgdW51bmlxXCIsIHRoaXMuc3RhdGUuZnJpZW5kUmF0aW5ncyk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIG1vdmllOiB0aGlzLnByb3BzLm1vdmllXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uU3RhckNsaWNrKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHt1c2VyUmF0aW5nOiBldmVudC50YXJnZXQudmFsdWV9KTtcclxuICAgIHRoaXMudXBkYXRlUmF0aW5nKGV2ZW50LnRhcmdldC52YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBnZXRGcmllbmRzKCkge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kcycpXHJcbiAgICAudGhlbihmdW5jdGlvbihyZXNwKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoYXQuc3RhdGUuZnJpZW5kcylcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vZ2V0IGZyaWVuZCByYXRpbmdzIGJ5IGNhbGxpbmcgcmVxdWVzdGhhbmRsZXJcclxuICAvL2dldCBmcmllbmRyYXRpbmdzLCBwYXNzaW5nIGluIG1haW5Vc2VyIGFuZCBtb3ZpZW9ialxyXG4gIGdldEZyaWVuZHNSYXRpbmcoaW5wdXRNb3ZpZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3Bvc3RpbmcnKVxyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kUmF0aW5ncycsIHttb3ZpZTogaW5wdXRNb3ZpZX0pXHJcbiAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXIgZ2V0RnJpZW5kc1JhdGluZzogJywgcmVzcG9uc2UpO1xyXG4gICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICBmcmllbmRSYXRpbmdzOiByZXNwb25zZVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgfSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgbW92aWUnLCBpbnB1dE1vdmllKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgIGxldCBtb3ZpZSA9IHRoaXMuc3RhdGUubW92aWU7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nSG9tZSBjb2xsZWN0aW9uJyBvbkNsaWNrPXsoKT0+IGNvbnNvbGUubG9nKHRoYXQuc3RhdGUpfT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vdmllRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxyXG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J21vdmlldGh1bW5haWwgY29sIHMzJyBzcmM9e21vdmllLnBvc3Rlcn0gb25DbGljaz17KCkgPT4gKHRoaXMucHJvcHMuY2hhbmdlKFwiU2luZ2xlTW92aWVcIiwgbW92aWUpKX0vPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3JpZ2h0IGNvbCBzOSc+XHJcbiAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9J21vdmllVGl0bGUnIG9uQ2xpY2s9eygpID0+ICh0aGlzLnByb3BzLmNoYW5nZShcIlNpbmdsZU1vdmllXCIsIG1vdmllKSl9Pnttb3ZpZS50aXRsZX08L2g1PlxyXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9J21vdmllWWVhcic+e21vdmllLnJlbGVhc2VfZGF0ZX08L3A+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0nbW92aWVEZXNjcmlwdGlvbic+e21vdmllLmRlc2NyaXB0aW9ufTwvcD5cclxuICAgICAgICAgICAgPFJldmlld0NvbXBvbmVudCBcclxuICAgICAgICAgICAgICByZXZpZXc9e21vdmllLnJldmlld30gXHJcbiAgICAgICAgICAgICAgdGl0bGU9e21vdmllLnRpdGxlfVxyXG4gICAgICAgICAgICAgIGlkPXttb3ZpZS5pZH0vPlxyXG4gICAgICAgICAgICA8TW92aWVXYXRjaFJlcXVlc3QgbW92aWU9e21vdmllfS8+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZ3Mgcm93XCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ltZGJSYXRpbmcgY29sIHM0Jz5JTURCIHJhdGluZzogPGI+e21vdmllLmltZGJSYXRpbmd9PC9iPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDxTdGFyUmF0aW5nQ29tcG9uZW50IG1vdmllPXttb3ZpZX0vPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdhdmdGcmllbmRSYXRpbmdCbG9jayBjb2wgczQnPmF2ZXJhZ2UgZnJpZW5kIHJhdGluZzogeyhtb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nKSA/IDxiPnttb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nfTwvYj4gOiAnbi9hJyB9PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIHt0aGlzLnN0YXRlLmZyaWVuZFJhdGluZ3MubWFwKGZyaWVuZFJhdGluZyA9PiBcclxuICAgICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nRW50cnkgXHJcbiAgICAgICAgICAgIHJhdGluZz17ZnJpZW5kUmF0aW5nfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoYXQucHJvcHMuY2hhbmdlfVxyXG4gICAgICAgICAgICBmb2Y9e3RoYXQucHJvcHMuZm9mfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG5cclxud2luZG93LlNpbmdsZU1vdmllUmF0aW5nID0gU2luZ2xlTW92aWVSYXRpbmc7Il19