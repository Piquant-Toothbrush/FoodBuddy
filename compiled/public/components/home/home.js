'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Home = function (_React$Component) {
  _inherits(Home, _React$Component);

  function Home(props) {
    _classCallCheck(this, Home);

    var _this = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));

    _this.state = {
      movies: [],
      view: 'recentRelease',
      focalMovie: null,
      recentRelease: true,
      search: '',
      loading: true
    };
    return _this;
  }

  //should have its own change view function


  _createClass(Home, [{
    key: 'changeViews',
    value: function changeViews(targetState) {
      this.setState({
        view: targetState
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
    value: function handleChange(event) {
      this.setState({
        search: event.target.value
      });
    }
  }, {
    key: 'getRecentReleasesInitialize',
    value: function getRecentReleasesInitialize() {
      var _this2 = this;

      $.get(Url + '/recentRelease').then(function (moviesWithRatings) {
        // console.log('response from server', moviesWithRatings);
        _this2.setState({
          movies: moviesWithRatings,
          recentRelease: true,
          loading: false
        });
      });
    }

    //function that takes movies from external API and query the database for ratings
    //will set the movies state after ratings are successfully retrived

  }, {
    key: 'getUserRatingsForMovies',
    value: function getUserRatingsForMovies(moviesFromOMDB) {
      var _this3 = this;

      if (moviesFromOMDB.length === 0) {
        this.setState({
          movies: [],
          recentRelease: false
        });
      } else {
        // console.log('posting to:', Url + '/getMultipleMovieRatings');
        $.post(Url + '/getMultipleMovieRatings', { movies: moviesFromOMDB }).done(function (moviesWithRatings) {
          // console.log('response from server', moviesWithRatings);
          _this3.setState({
            movies: moviesWithRatings,
            recentRelease: false
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
    value: function handleSearch(event) {
      if ((event.charCode === 13 || event === 'clicked') && this.state.search.length) {
        var that = this;
        this.setState({ loading: true });
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
          success: function success(response) {
            var sorted = _.sortBy(response.results, 'imdbRating');
            that.getUserRatingsForMovies(sorted);
            setTimeout(function () {
              that.setState({ loading: false });
            }, 1000);
          }
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var lable = 'Recent Releases';
      var feedbackMsg = '';
      if (this.state.recentRelease === false) {
        lable = 'back to recent releases';
        if (this.state.movies.length === 0) {
          feedbackMsg = React.createElement(
            'div',
            { className: 'errorMsg header' },
            'No match found, please try another title'
          );
        } else {
          feedbackMsg = React.createElement(
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
          lable
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
        feedbackMsg,
        React.createElement(MovieList, { movies: this.state.movies,
          change: this.props.change.bind(this)
        })
      );
    }
  }]);

  return Home;
}(React.Component);

window.Home = Home;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2hvbWUvaG9tZS5qcyJdLCJuYW1lcyI6WyJIb21lIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsInZpZXciLCJmb2NhbE1vdmllIiwicmVjZW50UmVsZWFzZSIsInNlYXJjaCIsImxvYWRpbmciLCJ0YXJnZXRTdGF0ZSIsInNldFN0YXRlIiwiZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplIiwiZXZlbnQiLCJ0YXJnZXQiLCJ2YWx1ZSIsIiQiLCJnZXQiLCJVcmwiLCJ0aGVuIiwibW92aWVzV2l0aFJhdGluZ3MiLCJtb3ZpZXNGcm9tT01EQiIsImxlbmd0aCIsInBvc3QiLCJkb25lIiwiY2hhckNvZGUiLCJ0aGF0IiwiYWpheCIsInVybCIsImpzb25wIiwiZGF0YVR5cGUiLCJkYXRhIiwicXVlcnkiLCJhcGlfa2V5IiwiZm9ybWF0Iiwic3VjY2VzcyIsInJlc3BvbnNlIiwic29ydGVkIiwiXyIsInNvcnRCeSIsInJlc3VsdHMiLCJnZXRVc2VyUmF0aW5nc0Zvck1vdmllcyIsInNldFRpbWVvdXQiLCJsYWJsZSIsImZlZWRiYWNrTXNnIiwiYmluZCIsImhhbmRsZUNoYW5nZSIsImhhbmRsZVNlYXJjaCIsImNoYW5nZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLEk7OztBQUNKLGdCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsNEdBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxjQUFRLEVBREc7QUFFWEMsWUFBTSxlQUZLO0FBR1hDLGtCQUFZLElBSEQ7QUFJWEMscUJBQWUsSUFKSjtBQUtYQyxjQUFRLEVBTEc7QUFNWEMsZUFBUztBQU5FLEtBQWI7QUFIaUI7QUFXbEI7O0FBRUQ7Ozs7O2dDQUNZQyxXLEVBQWE7QUFDdkIsV0FBS0MsUUFBTCxDQUFjO0FBQ1pOLGNBQU1LO0FBRE0sT0FBZDtBQUdEOztBQUVEOzs7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QUF0QyxDQUFqQztBQUErRUY7QUFBL0UsU0FGRjtBQUdFO0FBQUE7QUFBQSxZQUFLLFdBQVUsYUFBZjtBQUNFLHlDQUFPLE1BQU0sTUFBYixFQUFvQixJQUFHLFlBQXZCO0FBQ0UsdUJBQVUsWUFEWjtBQUVFLHlCQUFZLGNBRmQ7QUFHRSxtQkFBTyxLQUFLeEMsS0FBTCxDQUFXSyxNQUhwQjtBQUlFLHNCQUFVLEtBQUtzQyxZQUFMLENBQWtCRCxJQUFsQixDQUF1QixJQUF2QixDQUpaO0FBS0Usd0JBQVksS0FBS0UsWUFBTCxDQUFrQkYsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FMZCxHQURGO0FBT0U7QUFBQTtBQUFBLGNBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTO0FBQUEsdUJBQU0sT0FBS0UsWUFBTCxDQUFrQkYsSUFBbEIsU0FBNkIsU0FBN0IsQ0FBTjtBQUFBLGVBQXJEO0FBQUE7QUFBQTtBQVBGLFNBSEY7QUFZR0QsbUJBWkg7QUFhRSw0QkFBQyxTQUFELElBQVcsUUFBUSxLQUFLekMsS0FBTCxDQUFXQyxNQUE5QjtBQUNFLGtCQUFRLEtBQUtGLEtBQUwsQ0FBVzhDLE1BQVgsQ0FBa0JILElBQWxCLENBQXVCLElBQXZCO0FBRFY7QUFiRixPQURGO0FBbUJEOzs7O0VBN0hnQkksTUFBTUMsUzs7QUFnSXpCQyxPQUFPbEQsSUFBUCxHQUFjQSxJQUFkIiwiZmlsZSI6ImhvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBIb21lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIG1vdmllczogW10sXHJcbiAgICAgIHZpZXc6ICdyZWNlbnRSZWxlYXNlJyxcclxuICAgICAgZm9jYWxNb3ZpZTogbnVsbCxcclxuICAgICAgcmVjZW50UmVsZWFzZTogdHJ1ZSxcclxuICAgICAgc2VhcmNoOiAnJyxcclxuICAgICAgbG9hZGluZzogdHJ1ZVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vc2hvdWxkIGhhdmUgaXRzIG93biBjaGFuZ2UgdmlldyBmdW5jdGlvblxyXG4gIGNoYW5nZVZpZXdzKHRhcmdldFN0YXRlKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9zaG93IHJlbmRlciBhIGxpc3Qgb2YgcmVjZW50IHJlbGVhc2VzIG9uIGluaXRpYWxpemVcclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIHRoaXMuZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplKCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBzZWFyY2g6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUoKSB7XHJcbiAgICAkLmdldChVcmwgKyAnL3JlY2VudFJlbGVhc2UnKVxyXG4gICAgLnRoZW4obW92aWVzV2l0aFJhdGluZ3MgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCBtb3ZpZXNXaXRoUmF0aW5ncyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG1vdmllczogbW92aWVzV2l0aFJhdGluZ3MsXHJcbiAgICAgICAgcmVjZW50UmVsZWFzZTogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9mdW5jdGlvbiB0aGF0IHRha2VzIG1vdmllcyBmcm9tIGV4dGVybmFsIEFQSSBhbmQgcXVlcnkgdGhlIGRhdGFiYXNlIGZvciByYXRpbmdzXHJcbiAgLy93aWxsIHNldCB0aGUgbW92aWVzIHN0YXRlIGFmdGVyIHJhdGluZ3MgYXJlIHN1Y2Nlc3NmdWxseSByZXRyaXZlZFxyXG4gIGdldFVzZXJSYXRpbmdzRm9yTW92aWVzKG1vdmllc0Zyb21PTURCKSB7XHJcbiAgICBpZiAobW92aWVzRnJvbU9NREIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG1vdmllczogW10sXHJcbiAgICAgICAgcmVjZW50UmVsZWFzZTogZmFsc2VcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygncG9zdGluZyB0bzonLCBVcmwgKyAnL2dldE11bHRpcGxlTW92aWVSYXRpbmdzJyk7XHJcbiAgICAgICQucG9zdChVcmwgKyAnL2dldE11bHRpcGxlTW92aWVSYXRpbmdzJywgeyBtb3ZpZXM6IG1vdmllc0Zyb21PTURCIH0pXHJcbiAgICAgIC5kb25lKG1vdmllc1dpdGhSYXRpbmdzID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCBtb3ZpZXNXaXRoUmF0aW5ncyk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBtb3ZpZXM6IG1vdmllc1dpdGhSYXRpbmdzLFxyXG4gICAgICAgICAgcmVjZW50UmVsZWFzZTogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xyXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcbiAgICBpZiAoKGV2ZW50LmNoYXJDb2RlID09PSAxMyB8fCBldmVudCA9PT0gJ2NsaWNrZWQnKSAmJiB0aGlzLnN0YXRlLnNlYXJjaC5sZW5ndGgpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtsb2FkaW5nOnRydWV9KTtcclxuICAgICAgLy90aGlzIHdpbGwgc2VhcmNoIFRNREIgZm9yIG1vdmllIGFuZCBzZW5kIGl0IHRvIHNlcnZlciB0byByZXRyaXZlIHVzZXIgcmF0aW5nc1xyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogXCJodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL3NlYXJjaC9tb3ZpZVwiLFxyXG4gICAgICAgIGpzb25wOiBcImNhbGxiYWNrXCIsXHJcbiAgICAgICAgZGF0YVR5cGU6IFwianNvbnBcIixcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIHF1ZXJ5OiB0aGlzLnN0YXRlLnNlYXJjaCxcclxuICAgICAgICAgICAgYXBpX2tleTogXCI5ZDNiMDM1ZWYxY2Q2NjlhZWQzOTg0MDBiMTdmY2VhMlwiLFxyXG4gICAgICAgICAgICBmb3JtYXQ6IFwianNvblwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgIHZhciBzb3J0ZWQgPSBfLnNvcnRCeShyZXNwb25zZS5yZXN1bHRzLCAnaW1kYlJhdGluZycpO1xyXG4gICAgICAgICAgdGhhdC5nZXRVc2VyUmF0aW5nc0Zvck1vdmllcyhzb3J0ZWQpO1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKT0+e3RoYXQuc2V0U3RhdGUoe2xvYWRpbmc6ZmFsc2V9KX0sMTAwMClcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG5cclxuICAgIHZhciBsYWJsZSA9ICdSZWNlbnQgUmVsZWFzZXMnO1xyXG4gICAgdmFyIGZlZWRiYWNrTXNnID0gJyc7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWNlbnRSZWxlYXNlID09PSBmYWxzZSkge1xyXG4gICAgICBsYWJsZSA9ICdiYWNrIHRvIHJlY2VudCByZWxlYXNlcyc7XHJcbiAgICAgIGlmICh0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBmZWVkYmFja01zZyA9ICg8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnIGhlYWRlclwiPk5vIG1hdGNoIGZvdW5kLCBwbGVhc2UgdHJ5IGFub3RoZXIgdGl0bGU8L2Rpdj4pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZlZWRiYWNrTXNnID0gKDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlZE1zZyBoZWFkZXJcIj5BbGwgbWF0Y2ggcmVzdWx0czwvZGl2Pik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdIb21lIGNvbGxlY3Rpb24nPlxyXG4gICAgICB7dGhpcy5zdGF0ZS5sb2FkaW5nID8gPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzcyBsb2FkaW5nQmFyXCI+IDxkaXYgY2xhc3NOYW1lPVwiaW5kZXRlcm1pbmF0ZVwiPjwvZGl2PiA8L2Rpdj4gOiBudWxsfVxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInIG9uQ2xpY2s9e3RoaXMuZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplLmJpbmQodGhpcyl9PntsYWJsZX08L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VhcmNoTW92aWUnPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGUgPSd0ZXh0JyBpZD0nbW92aWVJbnB1dCcgXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J2ZpbmQgYSBtb3ZpZSdcclxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuc2VhcmNofVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcykoJ2NsaWNrZWQnKX0+c2VhcmNoPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHtmZWVkYmFja01zZ31cclxuICAgICAgICA8TW92aWVMaXN0IG1vdmllcz17dGhpcy5zdGF0ZS5tb3ZpZXN9XHJcbiAgICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxud2luZG93LkhvbWUgPSBIb21lOyJdfQ==