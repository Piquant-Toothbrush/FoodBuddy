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
        var f = [],
            g = {};

        for (var i = 0; i < e.length; i++) {
          if (g[e[i].friendUserName] === void 0) {
            g[e[i].friendUserName] = "defined";
            f.push(e[i]);
          }
        }

        d.setState({
          friendRatings: f
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZy5qc3giXSwibmFtZXMiOlsiU2luZ2xlTW92aWVSYXRpbmciLCJwcm9wcyIsInN0YXRlIiwidmFsdWUiLCJtb3ZpZSIsImN1cnJlbnRNb3ZpZSIsInZpZXciLCJmcmllbmRSYXRpbmdzIiwiZ2V0RnJpZW5kc1JhdGluZyIsInNldFN0YXRlIiwiZXZlbnQiLCJ1c2VyUmF0aW5nIiwidGFyZ2V0IiwidXBkYXRlUmF0aW5nIiwidGhhdCIsIiQiLCJwb3N0IiwiVXJsIiwidGhlbiIsInJlc3AiLCJjYXRjaCIsImVyciIsImlucHV0TW92aWUiLCJyZXNwb25zZSIsInVuaXFSZXNwb25zZXMiLCJmcmllbmROYW1lIiwiaSIsImxlbmd0aCIsImZyaWVuZFVzZXJOYW1lIiwicHVzaCIsInBvc3RlciIsImNoYW5nZSIsInRpdGxlIiwicmVsZWFzZV9kYXRlIiwiZGVzY3JpcHRpb24iLCJyZXZpZXciLCJpZCIsImltZGJSYXRpbmciLCJmcmllbmRBdmVyYWdlUmF0aW5nIiwibWFwIiwiZnJpZW5kUmF0aW5nIiwiZm9mIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsaUI7OztBQUNKLGFBQVlDLENBQVosRUFBbUI7QUFBQTs7QUFBQSxrR0FDWEEsQ0FEVzs7QUFFakIsTUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU8sRUFESTtBQUVYQyxhQUFPLEVBQUtILEtBQUwsQ0FBV0ksWUFGUDtBQUdYQyxZQUFNLGFBSEs7QUFJWEMscUJBQWU7QUFKSixLQUFiO0FBRmlCO0FBUWxCOzs7O3dDQUVtQjtBQUNsQixXQUFLQyxnQkFBTCxDQUFzQixLQUFLTixLQUFMLENBQVdFLEtBQWpDO0FBRUQ7OztnREFFMkI7QUFDMUIsV0FBS0ssUUFBTCxDQUFjO0FBQ1pMLGVBQU8sS0FBS0gsS0FBTCxDQUFXRztBQUROLE9BQWQ7QUFHRDs7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TWtDO0FBQVYsaUJBQTlCLEdBQW1FO0FBQXhJO0FBSEY7QUFWRjtBQUZGLFNBREY7QUFvQkU7QUFBQTtBQUFBO0FBQ0csZUFBS3BDLEtBQUwsQ0FBV0ssYUFBWCxDQUF5QmdDLEdBQXpCLENBQTZCO0FBQUEsbUJBQzVCLG9CQUFDLHNCQUFEO0FBQ0Esc0JBQVFDLENBRFI7QUFFQSxzQkFBUTFCLEVBQUtiLEtBQUwsQ0FBVzhCLE1BRm5CO0FBR0EsbUJBQUtqQixFQUFLYixLQUFMLENBQVd3QztBQUhoQixjQUQ0QjtBQUFBLFdBQTdCO0FBREg7QUFwQkYsT0FERjtBQWdDRDs7OztFQXRHNkJDLE1BQU1DLFM7O0FBdUdyQzs7QUFFREMsT0FBTzVDLGlCQUFQLEdBQTJCQSxpQkFBM0IiLCJmaWxlIjoiU2luZ2xlTW92aWVSYXRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTaW5nbGVNb3ZpZVJhdGluZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHZhbHVlOiAnJyxcclxuICAgICAgbW92aWU6IHRoaXMucHJvcHMuY3VycmVudE1vdmllLFxyXG4gICAgICB2aWV3OiAnU2luZ2xlTW92aWUnLFxyXG4gICAgICBmcmllbmRSYXRpbmdzOiBbXVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5nZXRGcmllbmRzUmF0aW5nKHRoaXMuc3RhdGUubW92aWUpO1xyXG5cclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgbW92aWU6IHRoaXMucHJvcHMubW92aWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25TdGFyQ2xpY2soZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe3VzZXJSYXRpbmc6IGV2ZW50LnRhcmdldC52YWx1ZX0pO1xyXG4gICAgdGhpcy51cGRhdGVSYXRpbmcoZXZlbnQudGFyZ2V0LnZhbHVlKTtcclxuICB9XHJcblxyXG4gIGdldEZyaWVuZHMoKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRzJylcclxuICAgIC50aGVuKGZ1bmN0aW9uKHJlc3ApIHtcclxuICAgICAgLy8gY29uc29sZS5sb2codGhhdC5zdGF0ZS5mcmllbmRzKVxyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9nZXQgZnJpZW5kIHJhdGluZ3MgYnkgY2FsbGluZyByZXF1ZXN0aGFuZGxlclxyXG4gIC8vZ2V0IGZyaWVuZHJhdGluZ3MsIHBhc3NpbmcgaW4gbWFpblVzZXIgYW5kIG1vdmllb2JqXHJcbiAgZ2V0RnJpZW5kc1JhdGluZyhpbnB1dE1vdmllKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygncG9zdGluZycpXHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRSYXRpbmdzJywge21vdmllOiBpbnB1dE1vdmllfSlcclxuICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXIgZ2V0RnJpZW5kc1JhdGluZzogJywgcmVzcG9uc2UpO1xyXG4gICAgICAgY29uc3QgdW5pcVJlc3BvbnNlcyA9IFtdO1xyXG4gICAgICAgY29uc3QgZnJpZW5kTmFtZSA9IHt9O1xyXG4gICAgICAgZm9yIChsZXQgaT0wOyBpPHJlc3BvbnNlLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgaWYgKGZyaWVuZE5hbWVbcmVzcG9uc2VbaV0uZnJpZW5kVXNlck5hbWVdID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgZnJpZW5kTmFtZVtyZXNwb25zZVtpXS5mcmllbmRVc2VyTmFtZV0gPSBcImRlZmluZWRcIjtcclxuICAgICAgICAgIHVuaXFSZXNwb25zZXMucHVzaChyZXNwb25zZVtpXSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgIH1cclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCdzaG91bGQgYmUgdW5pcScsIHVuaXFSZXNwb25zZXMpO1xyXG5cclxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kUmF0aW5nczogdW5pcVJlc3BvbnNlc1xyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyKVxyXG4gICAgfSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgbW92aWUnLCBpbnB1dE1vdmllKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgIGxldCBtb3ZpZSA9IHRoaXMuc3RhdGUubW92aWU7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nSG9tZSBjb2xsZWN0aW9uJyBvbkNsaWNrPXsoKT0+IGNvbnNvbGUubG9nKHRoYXQuc3RhdGUpfT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vdmllRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxyXG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J21vdmlldGh1bW5haWwgY29sIHMzJyBzcmM9e21vdmllLnBvc3Rlcn0gb25DbGljaz17KCkgPT4gKHRoaXMucHJvcHMuY2hhbmdlKFwiU2luZ2xlTW92aWVcIiwgbW92aWUpKX0vPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3JpZ2h0IGNvbCBzOSc+XHJcbiAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9J21vdmllVGl0bGUnIG9uQ2xpY2s9eygpID0+ICh0aGlzLnByb3BzLmNoYW5nZShcIlNpbmdsZU1vdmllXCIsIG1vdmllKSl9Pnttb3ZpZS50aXRsZX08L2g1PlxyXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9J21vdmllWWVhcic+e21vdmllLnJlbGVhc2VfZGF0ZX08L3A+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0nbW92aWVEZXNjcmlwdGlvbic+e21vdmllLmRlc2NyaXB0aW9ufTwvcD5cclxuICAgICAgICAgICAgPFJldmlld0NvbXBvbmVudCBcclxuICAgICAgICAgICAgICByZXZpZXc9e21vdmllLnJldmlld30gXHJcbiAgICAgICAgICAgICAgdGl0bGU9e21vdmllLnRpdGxlfVxyXG4gICAgICAgICAgICAgIGlkPXttb3ZpZS5pZH0vPlxyXG4gICAgICAgICAgICA8TW92aWVXYXRjaFJlcXVlc3QgbW92aWU9e21vdmllfS8+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZ3Mgcm93XCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ltZGJSYXRpbmcgY29sIHM0Jz5JTURCIHJhdGluZzogPGI+e21vdmllLmltZGJSYXRpbmd9PC9iPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDxTdGFyUmF0aW5nQ29tcG9uZW50IG1vdmllPXttb3ZpZX0vPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdhdmdGcmllbmRSYXRpbmdCbG9jayBjb2wgczQnPmF2ZXJhZ2UgZnJpZW5kIHJhdGluZzogeyhtb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nKSA/IDxiPnttb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nfTwvYj4gOiAnbi9hJyB9PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIHt0aGlzLnN0YXRlLmZyaWVuZFJhdGluZ3MubWFwKGZyaWVuZFJhdGluZyA9PiBcclxuICAgICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nRW50cnkgXHJcbiAgICAgICAgICAgIHJhdGluZz17ZnJpZW5kUmF0aW5nfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoYXQucHJvcHMuY2hhbmdlfVxyXG4gICAgICAgICAgICBmb2Y9e3RoYXQucHJvcHMuZm9mfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG5cclxud2luZG93LlNpbmdsZU1vdmllUmF0aW5nID0gU2luZ2xlTW92aWVSYXRpbmc7Il19