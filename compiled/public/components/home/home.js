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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2hvbWUvaG9tZS5qc3giXSwibmFtZXMiOlsiSG9tZSIsInByb3BzIiwic3RhdGUiLCJtb3ZpZXMiLCJ2aWV3IiwiZm9jYWxNb3ZpZSIsInJlY2VudFJlbGVhc2UiLCJzZWFyY2giLCJsb2FkaW5nIiwidGFyZ2V0U3RhdGUiLCJzZXRTdGF0ZSIsImdldFJlY2VudFJlbGVhc2VzSW5pdGlhbGl6ZSIsImV2ZW50IiwidGFyZ2V0IiwidmFsdWUiLCIkIiwiZ2V0IiwiVXJsIiwidGhlbiIsIm1vdmllc1dpdGhSYXRpbmdzIiwibW92aWVzRnJvbU9NREIiLCJsZW5ndGgiLCJwb3N0IiwiZG9uZSIsImNoYXJDb2RlIiwidGhhdCIsImFqYXgiLCJ1cmwiLCJqc29ucCIsImRhdGFUeXBlIiwiZGF0YSIsInF1ZXJ5IiwiYXBpX2tleSIsImZvcm1hdCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsInNvcnRlZCIsIl8iLCJzb3J0QnkiLCJyZXN1bHRzIiwiZ2V0VXNlclJhdGluZ3NGb3JNb3ZpZXMiLCJzZXRUaW1lb3V0IiwibGFibGUiLCJmZWVkYmFja01zZyIsImJpbmQiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVTZWFyY2giLCJjaGFuZ2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxJOzs7QUFDSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBR2pCLE1BQUtDLEtBQUwsR0FBYTtBQUNYQyxjQUFRLEVBREc7QUFFWEMsWUFBTSxlQUZLO0FBR1hDLGtCQUFZLElBSEQ7QUFJWEMsdUJBSlc7QUFLWEMsY0FBUSxFQUxHO0FBTVhDO0FBTlcsS0FBYjtBQUhpQjtBQVdsQjs7QUFFRDs7Ozs7Z0NBQ1lDLEMsRUFBYTtBQUN2QixXQUFLQyxRQUFMLENBQWM7QUFDWk4sY0FBTUs7QUFETSxPQUFkO0FBR0Q7O0FBRUQ7Ozs7d0NBQ29CO0FBQ2xCLFdBQUtFLDJCQUFMO0FBQ0Q7OztpQ0FFWUMsQyxFQUFPO0FBQ2xCLFdBQUtGLFFBQUwsQ0FBYztBQUNaSCxnQkFBUUssRUFBTUMsTUFBTixDQUFhQztBQURULE9BQWQ7QUFHRDs7O2tEQUU2QjtBQUFBOztBQUM1QkMsUUFBRUMsR0FBRixDQUFNQyxNQUFNLGdCQUFaLEVBQ0NDLElBREQsQ0FDTSxhQUFxQjtBQUN6QjtBQUNBLGVBQUtSLFFBQUwsQ0FBYztBQUNaUCxrQkFBUWdCLENBREk7QUFFWmIsMkJBRlk7QUFHWkU7QUFIWSxTQUFkO0FBS0QsT0FSRDtBQVNEOztBQUVEO0FBQ0E7Ozs7NENBQ3dCWSxDLEVBQWdCO0FBQUE7O0FBQ3RDLFVBQUlBLEVBQWVDLE1BQWYsS0FBMEIsQ0FBOUIsRUFBaUM7QUFDL0IsYUFBS1gsUUFBTCxDQUFjO0FBQ1pQLGtCQUFRLEVBREk7QUFFWkc7QUFGWSxTQUFkO0FBSUQsT0FMRCxNQUtPO0FBQ0w7QUFDQVMsVUFBRU8sSUFBRixDQUFPTCxNQUFNLDBCQUFiLEVBQXlDLEVBQUVkLFFBQVFpQixDQUFWLEVBQXpDLEVBQ0NHLElBREQsQ0FDTSxhQUFxQjtBQUN6QjtBQUNBLGlCQUFLYixRQUFMLENBQWM7QUFDWlAsb0JBQVFnQixDQURJO0FBRVpiO0FBRlksV0FBZDtBQUlELFNBUEQ7QUFRRDtBQUNGOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7O2lDQUNhTSxDLEVBQU87QUFDbEIsVUFBSSxDQUFDQSxFQUFNWSxRQUFOLEtBQW1CLEVBQW5CLElBQXlCWixNQUFVLFNBQXBDLEtBQWtELEtBQUtWLEtBQUwsQ0FBV0ssTUFBWCxDQUFrQmMsTUFBeEUsRUFBZ0Y7QUFDOUUsWUFBSUksSUFBTyxJQUFYO0FBQ0EsYUFBS2YsUUFBTCxDQUFjLEVBQUNGLFdBQUQsRUFBZDtBQUNBO0FBQ0FPLFVBQUVXLElBQUYsQ0FBTztBQUNMQyxlQUFLLDJDQURBO0FBRUxDLGlCQUFPLFVBRkY7QUFHTEMsb0JBQVUsT0FITDtBQUlMQyxnQkFBTTtBQUNGQyxtQkFBTyxLQUFLN0IsS0FBTCxDQUFXSyxNQURoQjtBQUVGeUIscUJBQVMsa0NBRlA7QUFHRkMsb0JBQVE7QUFITixXQUpEO0FBU0xDLG1CQUFTLGlCQUFTQyxDQUFULEVBQW1CO0FBQzFCLGdCQUFJQyxJQUFTQyxFQUFFQyxNQUFGLENBQVNILEVBQVNJLE9BQWxCLEVBQTJCLFlBQTNCLENBQWI7QUFDQWQsY0FBS2UsdUJBQUwsQ0FBNkJKLENBQTdCO0FBQ0FLLHVCQUFXLFlBQUk7QUFBQ2hCLGdCQUFLZixRQUFMLENBQWMsRUFBQ0YsV0FBRCxFQUFkO0FBQStCLGFBQS9DLEVBQWdELElBQWhEO0FBQ0Q7QUFiSSxTQUFQO0FBZUQ7QUFDRjs7OzZCQUVRO0FBQUE7QUFBQSxVQUVIa0MsSUFBUSxpQkFGTDtBQUFBLFVBR0hDLElBQWMsRUFIWDs7QUFJUCxVQUFJLEtBQUt6QyxLQUFMLENBQVdJLGFBQVgsT0FBSixFQUF3QztBQUN0Q29DLFlBQVEseUJBQVI7QUFDQSxZQUFJLEtBQUt4QyxLQUFMLENBQVdDLE1BQVgsQ0FBa0JrQixNQUFsQixLQUE2QixDQUFqQyxFQUFvQztBQUNsQ3NCLGNBQWU7QUFBQTtBQUFBLGNBQUssV0FBVSxpQkFBZjtBQUFBO0FBQUEsV0FBZjtBQUNELFNBRkQsTUFFTztBQUNMQSxjQUFlO0FBQUE7QUFBQSxjQUFLLFdBQVUsbUJBQWY7QUFBQTtBQUFBLFdBQWY7QUFDRDtBQUNGO0FBQ0QsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLGlCQUFmO0FBQ0MsYUFBS3pDLEtBQUwsQ0FBV00sT0FBWCxHQUFxQjtBQUFBO0FBQUEsWUFBSyxXQUFVLHFCQUFmO0FBQUE7QUFBc0MsdUNBQUssV0FBVSxlQUFmLEdBQXRDO0FBQUE7QUFBQSxTQUFyQixHQUEwRyxJQUQzRztBQUVFO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZixFQUF3QixTQUFTLEtBQUtHLDJCQUFMLENBQWlDaUMsSUFBakMsQ0FBc0MsSUFBdEMsQ0FBakM7QUFBK0VGO0FBQS9FLFNBRkY7QUFHRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFDRSx5Q0FBTyxNQUFNLE1BQWIsRUFBb0IsSUFBRyxZQUF2QjtBQUNFLHVCQUFVLFlBRFo7QUFFRSx5QkFBWSxjQUZkO0FBR0UsbUJBQU8sS0FBS3hDLEtBQUwsQ0FBV0ssTUFIcEI7QUFJRSxzQkFBVSxLQUFLc0MsWUFBTCxDQUFrQkQsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FKWjtBQUtFLHdCQUFZLEtBQUtFLFlBQUwsQ0FBa0JGLElBQWxCLENBQXVCLElBQXZCLENBTGQsR0FERjtBQU9FO0FBQUE7QUFBQSxjQUFHLFdBQVUsOEJBQWIsRUFBNEMsU0FBUztBQUFBLHVCQUFNLE9BQUtFLFlBQUwsQ0FBa0JGLElBQWxCLFNBQTZCLFNBQTdCLENBQU47QUFBQSxlQUFyRDtBQUFBO0FBQUE7QUFQRixTQUhGO0FBWUdELFNBWkg7QUFhRSw0QkFBQyxTQUFELElBQVcsUUFBUSxLQUFLekMsS0FBTCxDQUFXQyxNQUE5QjtBQUNFLGtCQUFRLEtBQUtGLEtBQUwsQ0FBVzhDLE1BQVgsQ0FBa0JILElBQWxCLENBQXVCLElBQXZCO0FBRFY7QUFiRixPQURGO0FBbUJEOzs7O0VBN0hnQkksTUFBTUMsUzs7QUFnSXpCQyxPQUFPbEQsSUFBUCxHQUFjQSxJQUFkIiwiZmlsZSI6ImhvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBIb21lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIG1vdmllczogW10sXHJcbiAgICAgIHZpZXc6ICdyZWNlbnRSZWxlYXNlJyxcclxuICAgICAgZm9jYWxNb3ZpZTogbnVsbCxcclxuICAgICAgcmVjZW50UmVsZWFzZTogdHJ1ZSxcclxuICAgICAgc2VhcmNoOiAnJyxcclxuICAgICAgbG9hZGluZzogdHJ1ZVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vc2hvdWxkIGhhdmUgaXRzIG93biBjaGFuZ2UgdmlldyBmdW5jdGlvblxyXG4gIGNoYW5nZVZpZXdzKHRhcmdldFN0YXRlKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9zaG93IHJlbmRlciBhIGxpc3Qgb2YgcmVjZW50IHJlbGVhc2VzIG9uIGluaXRpYWxpemVcclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIHRoaXMuZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplKCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBzZWFyY2g6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUoKSB7XHJcbiAgICAkLmdldChVcmwgKyAnL3JlY2VudFJlbGVhc2UnKVxyXG4gICAgLnRoZW4obW92aWVzV2l0aFJhdGluZ3MgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCBtb3ZpZXNXaXRoUmF0aW5ncyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG1vdmllczogbW92aWVzV2l0aFJhdGluZ3MsXHJcbiAgICAgICAgcmVjZW50UmVsZWFzZTogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9mdW5jdGlvbiB0aGF0IHRha2VzIG1vdmllcyBmcm9tIGV4dGVybmFsIEFQSSBhbmQgcXVlcnkgdGhlIGRhdGFiYXNlIGZvciByYXRpbmdzXHJcbiAgLy93aWxsIHNldCB0aGUgbW92aWVzIHN0YXRlIGFmdGVyIHJhdGluZ3MgYXJlIHN1Y2Nlc3NmdWxseSByZXRyaXZlZFxyXG4gIGdldFVzZXJSYXRpbmdzRm9yTW92aWVzKG1vdmllc0Zyb21PTURCKSB7XHJcbiAgICBpZiAobW92aWVzRnJvbU9NREIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG1vdmllczogW10sXHJcbiAgICAgICAgcmVjZW50UmVsZWFzZTogZmFsc2VcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygncG9zdGluZyB0bzonLCBVcmwgKyAnL2dldE11bHRpcGxlTW92aWVSYXRpbmdzJyk7XHJcbiAgICAgICQucG9zdChVcmwgKyAnL2dldE11bHRpcGxlTW92aWVSYXRpbmdzJywgeyBtb3ZpZXM6IG1vdmllc0Zyb21PTURCIH0pXHJcbiAgICAgIC5kb25lKG1vdmllc1dpdGhSYXRpbmdzID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCBtb3ZpZXNXaXRoUmF0aW5ncyk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBtb3ZpZXM6IG1vdmllc1dpdGhSYXRpbmdzLFxyXG4gICAgICAgICAgcmVjZW50UmVsZWFzZTogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xyXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcbiAgICBpZiAoKGV2ZW50LmNoYXJDb2RlID09PSAxMyB8fCBldmVudCA9PT0gJ2NsaWNrZWQnKSAmJiB0aGlzLnN0YXRlLnNlYXJjaC5sZW5ndGgpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtsb2FkaW5nOnRydWV9KTtcclxuICAgICAgLy90aGlzIHdpbGwgc2VhcmNoIFRNREIgZm9yIG1vdmllIGFuZCBzZW5kIGl0IHRvIHNlcnZlciB0byByZXRyaXZlIHVzZXIgcmF0aW5nc1xyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogXCJodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL3NlYXJjaC9tb3ZpZVwiLFxyXG4gICAgICAgIGpzb25wOiBcImNhbGxiYWNrXCIsXHJcbiAgICAgICAgZGF0YVR5cGU6IFwianNvbnBcIixcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIHF1ZXJ5OiB0aGlzLnN0YXRlLnNlYXJjaCxcclxuICAgICAgICAgICAgYXBpX2tleTogXCI5ZDNiMDM1ZWYxY2Q2NjlhZWQzOTg0MDBiMTdmY2VhMlwiLFxyXG4gICAgICAgICAgICBmb3JtYXQ6IFwianNvblwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgIHZhciBzb3J0ZWQgPSBfLnNvcnRCeShyZXNwb25zZS5yZXN1bHRzLCAnaW1kYlJhdGluZycpO1xyXG4gICAgICAgICAgdGhhdC5nZXRVc2VyUmF0aW5nc0Zvck1vdmllcyhzb3J0ZWQpO1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKT0+e3RoYXQuc2V0U3RhdGUoe2xvYWRpbmc6ZmFsc2V9KX0sMTAwMClcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG5cclxuICAgIHZhciBsYWJsZSA9ICdSZWNlbnQgUmVsZWFzZXMnO1xyXG4gICAgdmFyIGZlZWRiYWNrTXNnID0gJyc7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWNlbnRSZWxlYXNlID09PSBmYWxzZSkge1xyXG4gICAgICBsYWJsZSA9ICdiYWNrIHRvIHJlY2VudCByZWxlYXNlcyc7XHJcbiAgICAgIGlmICh0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBmZWVkYmFja01zZyA9ICg8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnIGhlYWRlclwiPk5vIG1hdGNoIGZvdW5kLCBwbGVhc2UgdHJ5IGFub3RoZXIgdGl0bGU8L2Rpdj4pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZlZWRiYWNrTXNnID0gKDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlZE1zZyBoZWFkZXJcIj5BbGwgbWF0Y2ggcmVzdWx0czwvZGl2Pik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdIb21lIGNvbGxlY3Rpb24nPlxyXG4gICAgICB7dGhpcy5zdGF0ZS5sb2FkaW5nID8gPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzcyBsb2FkaW5nQmFyXCI+IDxkaXYgY2xhc3NOYW1lPVwiaW5kZXRlcm1pbmF0ZVwiPjwvZGl2PiA8L2Rpdj4gOiBudWxsfVxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInIG9uQ2xpY2s9e3RoaXMuZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplLmJpbmQodGhpcyl9PntsYWJsZX08L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VhcmNoTW92aWUnPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGUgPSd0ZXh0JyBpZD0nbW92aWVJbnB1dCcgXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J2ZpbmQgYSBtb3ZpZSdcclxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuc2VhcmNofVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcykoJ2NsaWNrZWQnKX0+c2VhcmNoPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHtmZWVkYmFja01zZ31cclxuICAgICAgICA8TW92aWVMaXN0IG1vdmllcz17dGhpcy5zdGF0ZS5tb3ZpZXN9XHJcbiAgICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxud2luZG93LkhvbWUgPSBIb21lOyJdfQ==