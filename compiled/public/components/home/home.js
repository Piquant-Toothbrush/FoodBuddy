'use strict';

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var d = c[i]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(b, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var Home = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      movies: [],
      view: 'recentRelease',
      focalMovie: null,
      recentRelease: !0,
      search: '',
      loading: !0
    };
    return d;
  }

  //should have its own change view function


  _createClass(b, [{
    key: 'changeViews',
    value: function changeViews(c) {
      this.setState({
        view: c
      });
    }

    //show render a list of recent releases on initialize

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getRecentReleasesInitialize();
    }
  }, {
    key: 'handleChange',
    value: function handleChange(c) {
      this.setState({
        search: c.target.value
      });
    }
  }, {
    key: 'getRecentReleasesInitialize',
    value: function getRecentReleasesInitialize() {
      var _this2 = this;

      $.get(Url + '/recentRelease').then(function (c) {
        // console.log('response from server', moviesWithRatings);
        _this2.setState({
          movies: c,
          recentRelease: !0,
          loading: !1
        });
      });
    }

    //function that takes movies from external API and query the database for ratings
    //will set the movies state after ratings are successfully retrived

  }, {
    key: 'getUserRatingsForMovies',
    value: function getUserRatingsForMovies(c) {
      var _this3 = this;

      if (c.length === 0) {
        this.setState({
          movies: [],
          recentRelease: !1
        });
      } else {
        // console.log('posting to:', Url + '/getMultipleMovieRatings');
        $.post(Url + '/getMultipleMovieRatings', { movies: c }).done(function (d) {
          // console.log('response from server', moviesWithRatings);
          _this3.setState({
            movies: d,
            recentRelease: !1
          });
        });
      }
    }

    //////////////////////
    /////Event Handlers
    //////////////////////

    //this will call search for a movie from external API, do a database query for rating
    //and set the reponse to the movies state

  }, {
    key: 'handleSearch',
    value: function handleSearch(c) {
      if ((c.charCode === 13 || c === 'clicked') && this.state.search.length) {
        var d = this;
        this.setState({ loading: !0 });
        //this will search TMDB for movie and send it to server to retrive user ratings
        $.ajax({
          url: "https://api.themoviedb.org/3/search/movie",
          jsonp: "callback",
          dataType: "jsonp",
          data: {
            query: this.state.search,
            api_key: "9d3b035ef1cd669aed398400b17fcea2",
            format: "json"
          },
          success: function success(e) {
            var f = _.sortBy(e.results, 'imdbRating');
            d.getUserRatingsForMovies(f);
            setTimeout(function () {
              d.setState({ loading: !1 });
            }, 1000);
          }
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this,
          c = 'Recent Releases',
          d = '';

      if (this.state.recentRelease === !1) {
        c = 'back to recent releases';
        if (this.state.movies.length === 0) {
          d = React.createElement(
            'div',
            { className: 'errorMsg header' },
            'No match found, please try another title'
          );
        } else {
          d = React.createElement(
            'div',
            { className: 'updatedMsg header' },
            'All match results'
          );
        }
      }
      return React.createElement(
        'div',
        { className: 'Home collection' },
        this.state.loading ? React.createElement(
          'div',
          { className: 'progress loadingBar' },
          ' ',
          React.createElement('div', { className: 'indeterminate' }),
          ' '
        ) : null,
        React.createElement(
          'div',
          { className: 'header', onClick: this.getRecentReleasesInitialize.bind(this) },
          c
        ),
        React.createElement(
          'div',
          { className: 'searchMovie' },
          React.createElement('input', { type: 'text', id: 'movieInput',
            className: 'movieInput',
            placeholder: 'find a movie',
            value: this.state.search,
            onChange: this.handleChange.bind(this),
            onKeyPress: this.handleSearch.bind(this) }),
          React.createElement(
            'a',
            { className: 'waves-effect waves-light btn', onClick: function onClick() {
                return _this4.handleSearch.bind(_this4)('clicked');
              } },
            'search'
          )
        ),
        d,
        React.createElement(MovieList, { movies: this.state.movies,
          change: this.props.change.bind(this)
        })
      );
    }
  }]);

  return b;
}(React.Component);

window.Home = Home;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2hvbWUvaG9tZS5qcyJdLCJuYW1lcyI6WyJIb21lIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsInZpZXciLCJmb2NhbE1vdmllIiwicmVjZW50UmVsZWFzZSIsInNlYXJjaCIsImxvYWRpbmciLCJ0YXJnZXRTdGF0ZSIsInNldFN0YXRlIiwiZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplIiwiZXZlbnQiLCJ0YXJnZXQiLCJ2YWx1ZSIsIiQiLCJnZXQiLCJVcmwiLCJ0aGVuIiwibW92aWVzV2l0aFJhdGluZ3MiLCJtb3ZpZXNGcm9tT01EQiIsImxlbmd0aCIsInBvc3QiLCJkb25lIiwiY2hhckNvZGUiLCJ0aGF0IiwiYWpheCIsInVybCIsImpzb25wIiwiZGF0YVR5cGUiLCJkYXRhIiwicXVlcnkiLCJhcGlfa2V5IiwiZm9ybWF0Iiwic3VjY2VzcyIsInJlc3BvbnNlIiwic29ydGVkIiwiXyIsInNvcnRCeSIsInJlc3VsdHMiLCJnZXRVc2VyUmF0aW5nc0Zvck1vdmllcyIsInNldFRpbWVvdXQiLCJsYWJsZSIsImZlZWRiYWNrTXNnIiwiYmluZCIsImhhbmRsZUNoYW5nZSIsImhhbmRsZVNlYXJjaCIsImNoYW5nZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLEk7OztBQUNKLGFBQVlDLENBQVosRUFBbUI7QUFBQTs7QUFBQSxrR0FDWEEsQ0FEVzs7QUFHakIsTUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGNBQVEsRUFERztBQUVYQyxZQUFNLGVBRks7QUFHWEMsa0JBQVksSUFIRDtBQUlYQyx1QkFKVztBQUtYQyxjQUFRLEVBTEc7QUFNWEM7QUFOVyxLQUFiO0FBSGlCO0FBV2xCOztBQUVEOzs7OztnQ0FDWUMsQyxFQUFhO0FBQ3ZCLFdBQUtDLFFBQUwsQ0FBYztBQUNaTixjQUFNSztBQURNLE9BQWQ7QUFHRDs7QUFFRDs7Ozt3Q0FDb0I7QUFD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QUNFLHlDQUFPLE1BQU0sTUFBYixFQUFvQixJQUFHLFlBQXZCO0FBQ0UsdUJBQVUsWUFEWjtBQUVFLHlCQUFZLGNBRmQ7QUFHRSxtQkFBTyxLQUFLeEMsS0FBTCxDQUFXSyxNQUhwQjtBQUlFLHNCQUFVLEtBQUtzQyxZQUFMLENBQWtCRCxJQUFsQixDQUF1QixJQUF2QixDQUpaO0FBS0Usd0JBQVksS0FBS0UsWUFBTCxDQUFrQkYsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FMZCxHQURGO0FBT0U7QUFBQTtBQUFBLGNBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTO0FBQUEsdUJBQU0sT0FBS0UsWUFBTCxDQUFrQkYsSUFBbEIsU0FBNkIsU0FBN0IsQ0FBTjtBQUFBLGVBQXJEO0FBQUE7QUFBQTtBQVBGLFNBSEY7QUFZR0QsU0FaSDtBQWFFLDRCQUFDLFNBQUQsSUFBVyxRQUFRLEtBQUt6QyxLQUFMLENBQVdDLE1BQTlCO0FBQ0Usa0JBQVEsS0FBS0YsS0FBTCxDQUFXOEMsTUFBWCxDQUFrQkgsSUFBbEIsQ0FBdUIsSUFBdkI7QUFEVjtBQWJGLE9BREY7QUFtQkQ7Ozs7RUE3SGdCSSxNQUFNQyxTOztBQWdJekJDLE9BQU9sRCxJQUFQLEdBQWNBLElBQWQiLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEhvbWUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgbW92aWVzOiBbXSxcclxuICAgICAgdmlldzogJ3JlY2VudFJlbGVhc2UnLFxyXG4gICAgICBmb2NhbE1vdmllOiBudWxsLFxyXG4gICAgICByZWNlbnRSZWxlYXNlOiB0cnVlLFxyXG4gICAgICBzZWFyY2g6ICcnLFxyXG4gICAgICBsb2FkaW5nOiB0cnVlXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy9zaG91bGQgaGF2ZSBpdHMgb3duIGNoYW5nZSB2aWV3IGZ1bmN0aW9uXHJcbiAgY2hhbmdlVmlld3ModGFyZ2V0U3RhdGUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL3Nob3cgcmVuZGVyIGEgbGlzdCBvZiByZWNlbnQgcmVsZWFzZXMgb24gaW5pdGlhbGl6ZVxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5nZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUoKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNoYW5nZShldmVudCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHNlYXJjaDogZXZlbnQudGFyZ2V0LnZhbHVlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFJlY2VudFJlbGVhc2VzSW5pdGlhbGl6ZSgpIHtcclxuICAgICQuZ2V0KFVybCArICcvcmVjZW50UmVsZWFzZScpXHJcbiAgICAudGhlbihtb3ZpZXNXaXRoUmF0aW5ncyA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIG1vdmllc1dpdGhSYXRpbmdzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbW92aWVzOiBtb3ZpZXNXaXRoUmF0aW5ncyxcclxuICAgICAgICByZWNlbnRSZWxlYXNlOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL2Z1bmN0aW9uIHRoYXQgdGFrZXMgbW92aWVzIGZyb20gZXh0ZXJuYWwgQVBJIGFuZCBxdWVyeSB0aGUgZGF0YWJhc2UgZm9yIHJhdGluZ3NcclxuICAvL3dpbGwgc2V0IHRoZSBtb3ZpZXMgc3RhdGUgYWZ0ZXIgcmF0aW5ncyBhcmUgc3VjY2Vzc2Z1bGx5IHJldHJpdmVkXHJcbiAgZ2V0VXNlclJhdGluZ3NGb3JNb3ZpZXMobW92aWVzRnJvbU9NREIpIHtcclxuICAgIGlmIChtb3ZpZXNGcm9tT01EQi5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbW92aWVzOiBbXSxcclxuICAgICAgICByZWNlbnRSZWxlYXNlOiBmYWxzZVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdwb3N0aW5nIHRvOicsIFVybCArICcvZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnKTtcclxuICAgICAgJC5wb3N0KFVybCArICcvZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnLCB7IG1vdmllczogbW92aWVzRnJvbU9NREIgfSlcclxuICAgICAgLmRvbmUobW92aWVzV2l0aFJhdGluZ3MgPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIG1vdmllc1dpdGhSYXRpbmdzKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIG1vdmllczogbW92aWVzV2l0aFJhdGluZ3MsXHJcbiAgICAgICAgICByZWNlbnRSZWxlYXNlOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL0V2ZW50IEhhbmRsZXJzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAvL3RoaXMgd2lsbCBjYWxsIHNlYXJjaCBmb3IgYSBtb3ZpZSBmcm9tIGV4dGVybmFsIEFQSSwgZG8gYSBkYXRhYmFzZSBxdWVyeSBmb3IgcmF0aW5nXHJcbiAgLy9hbmQgc2V0IHRoZSByZXBvbnNlIHRvIHRoZSBtb3ZpZXMgc3RhdGVcclxuICBoYW5kbGVTZWFyY2goZXZlbnQpIHtcclxuICAgIGlmICgoZXZlbnQuY2hhckNvZGUgPT09IDEzIHx8IGV2ZW50ID09PSAnY2xpY2tlZCcpICYmIHRoaXMuc3RhdGUuc2VhcmNoLmxlbmd0aCkge1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2xvYWRpbmc6dHJ1ZX0pO1xyXG4gICAgICAvL3RoaXMgd2lsbCBzZWFyY2ggVE1EQiBmb3IgbW92aWUgYW5kIHNlbmQgaXQgdG8gc2VydmVyIHRvIHJldHJpdmUgdXNlciByYXRpbmdzXHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBcImh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvc2VhcmNoL21vdmllXCIsXHJcbiAgICAgICAganNvbnA6IFwiY2FsbGJhY2tcIixcclxuICAgICAgICBkYXRhVHlwZTogXCJqc29ucFwiLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgcXVlcnk6IHRoaXMuc3RhdGUuc2VhcmNoLFxyXG4gICAgICAgICAgICBhcGlfa2V5OiBcIjlkM2IwMzVlZjFjZDY2OWFlZDM5ODQwMGIxN2ZjZWEyXCIsXHJcbiAgICAgICAgICAgIGZvcm1hdDogXCJqc29uXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgdmFyIHNvcnRlZCA9IF8uc29ydEJ5KHJlc3BvbnNlLnJlc3VsdHMsICdpbWRiUmF0aW5nJyk7XHJcbiAgICAgICAgICB0aGF0LmdldFVzZXJSYXRpbmdzRm9yTW92aWVzKHNvcnRlZCk7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57dGhhdC5zZXRTdGF0ZSh7bG9hZGluZzpmYWxzZX0pfSwxMDAwKVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcblxyXG4gICAgdmFyIGxhYmxlID0gJ1JlY2VudCBSZWxlYXNlcyc7XHJcbiAgICB2YXIgZmVlZGJhY2tNc2cgPSAnJztcclxuICAgIGlmICh0aGlzLnN0YXRlLnJlY2VudFJlbGVhc2UgPT09IGZhbHNlKSB7XHJcbiAgICAgIGxhYmxlID0gJ2JhY2sgdG8gcmVjZW50IHJlbGVhc2VzJztcclxuICAgICAgaWYgKHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGZlZWRiYWNrTXNnID0gKDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2cgaGVhZGVyXCI+Tm8gbWF0Y2ggZm91bmQsIHBsZWFzZSB0cnkgYW5vdGhlciB0aXRsZTwvZGl2Pik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZmVlZGJhY2tNc2cgPSAoPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVkTXNnIGhlYWRlclwiPkFsbCBtYXRjaCByZXN1bHRzPC9kaXY+KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9J0hvbWUgY29sbGVjdGlvbic+XHJcbiAgICAgIHt0aGlzLnN0YXRlLmxvYWRpbmcgPyA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzIGxvYWRpbmdCYXJcIj4gPGRpdiBjbGFzc05hbWU9XCJpbmRldGVybWluYXRlXCI+PC9kaXY+IDwvZGl2PiA6IG51bGx9XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2hlYWRlcicgb25DbGljaz17dGhpcy5nZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUuYmluZCh0aGlzKX0+e2xhYmxlfTwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWFyY2hNb3ZpZSc+XHJcbiAgICAgICAgICA8aW5wdXQgdHlwZSA9J3RleHQnIGlkPSdtb3ZpZUlucHV0JyBcclxuICAgICAgICAgICAgY2xhc3NOYW1lPSdtb3ZpZUlucHV0J1xyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nZmluZCBhIG1vdmllJ1xyXG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5zZWFyY2h9XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gdGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKSgnY2xpY2tlZCcpfT5zZWFyY2g8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAge2ZlZWRiYWNrTXNnfVxyXG4gICAgICAgIDxNb3ZpZUxpc3QgbW92aWVzPXt0aGlzLnN0YXRlLm1vdmllc31cclxuICAgICAgICAgIGNoYW5nZT17dGhpcy5wcm9wcy5jaGFuZ2UuYmluZCh0aGlzKX1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuSG9tZSA9IEhvbWU7Il19