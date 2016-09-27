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
        console.log('response from server', moviesWithRatings);
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
        console.log('posting to:', Url + '/getMultipleMovieRatings');
        $.post(Url + '/getMultipleMovieRatings', { movies: moviesFromOMDB }).done(function (moviesWithRatings) {
          console.log('response from server', moviesWithRatings);
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
      if (event.charCode === 13 || event === 'clicked') {
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
            { className: 'errorMsg' },
            'no match found, please try another title'
          );
        } else {
          feedbackMsg = React.createElement(
            'div',
            { className: 'updatedMsg' },
            'all match results:'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2hvbWUvaG9tZS5qcyJdLCJuYW1lcyI6WyJIb21lIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsInZpZXciLCJmb2NhbE1vdmllIiwicmVjZW50UmVsZWFzZSIsInNlYXJjaCIsImxvYWRpbmciLCJ0YXJnZXRTdGF0ZSIsInNldFN0YXRlIiwiZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplIiwiZXZlbnQiLCJ0YXJnZXQiLCJ2YWx1ZSIsIiQiLCJnZXQiLCJVcmwiLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsIm1vdmllc1dpdGhSYXRpbmdzIiwibW92aWVzRnJvbU9NREIiLCJsZW5ndGgiLCJwb3N0IiwiZG9uZSIsImNoYXJDb2RlIiwidGhhdCIsImFqYXgiLCJ1cmwiLCJqc29ucCIsImRhdGFUeXBlIiwiZGF0YSIsInF1ZXJ5IiwiYXBpX2tleSIsImZvcm1hdCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsInNvcnRlZCIsIl8iLCJzb3J0QnkiLCJyZXN1bHRzIiwiZ2V0VXNlclJhdGluZ3NGb3JNb3ZpZXMiLCJzZXRUaW1lb3V0IiwibGFibGUiLCJmZWVkYmFja01zZyIsImJpbmQiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVTZWFyY2giLCJjaGFuZ2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxJOzs7QUFDSixnQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDRHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsY0FBUSxFQURHO0FBRVhDLFlBQU0sZUFGSztBQUdYQyxrQkFBWSxJQUhEO0FBSVhDLHFCQUFlLElBSko7QUFLWEMsY0FBUSxFQUxHO0FBTVhDLGVBQVM7QUFORSxLQUFiO0FBSGlCO0FBV2xCOztBQUVEOzs7OztnQ0FDWUMsVyxFQUFhO0FBQ3ZCLFdBQUtDLFFBQUwsQ0FBYztBQUNaTixjQUFNSztBQURNLE9B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QixHQUEwRyxJQUQzRztBQUVFO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZixFQUF3QixTQUFTLEtBQUtHLDJCQUFMLENBQWlDbUMsSUFBakMsQ0FBc0MsSUFBdEMsQ0FBakM7QUFBK0VGO0FBQS9FLFNBRkY7QUFHRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFDRSx5Q0FBTyxNQUFNLE1BQWIsRUFBb0IsSUFBRyxZQUF2QjtBQUNFLHVCQUFVLFlBRFo7QUFFRSx5QkFBWSxjQUZkO0FBR0UsbUJBQU8sS0FBSzFDLEtBQUwsQ0FBV0ssTUFIcEI7QUFJRSxzQkFBVSxLQUFLd0MsWUFBTCxDQUFrQkQsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FKWjtBQUtFLHdCQUFZLEtBQUtFLFlBQUwsQ0FBa0JGLElBQWxCLENBQXVCLElBQXZCLENBTGQsR0FERjtBQU9FO0FBQUE7QUFBQSxjQUFHLFdBQVUsOEJBQWIsRUFBNEMsU0FBUztBQUFBLHVCQUFNLE9BQUtFLFlBQUwsQ0FBa0JGLElBQWxCLFNBQTZCLFNBQTdCLENBQU47QUFBQSxlQUFyRDtBQUFBO0FBQUE7QUFQRixTQUhGO0FBWUdELG1CQVpIO0FBYUUsNEJBQUMsU0FBRCxJQUFXLFFBQVEsS0FBSzNDLEtBQUwsQ0FBV0MsTUFBOUI7QUFDRSxrQkFBUSxLQUFLRixLQUFMLENBQVdnRCxNQUFYLENBQWtCSCxJQUFsQixDQUF1QixJQUF2QjtBQURWO0FBYkYsT0FERjtBQW1CRDs7OztFQTdIZ0JJLE1BQU1DLFM7O0FBZ0l6QkMsT0FBT3BELElBQVAsR0FBY0EsSUFBZCIsImZpbGUiOiJob21lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSG9tZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBtb3ZpZXM6IFtdLFxyXG4gICAgICB2aWV3OiAncmVjZW50UmVsZWFzZScsXHJcbiAgICAgIGZvY2FsTW92aWU6IG51bGwsXHJcbiAgICAgIHJlY2VudFJlbGVhc2U6IHRydWUsXHJcbiAgICAgIHNlYXJjaDogJycsXHJcbiAgICAgIGxvYWRpbmc6IHRydWVcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvL3Nob3VsZCBoYXZlIGl0cyBvd24gY2hhbmdlIHZpZXcgZnVuY3Rpb25cclxuICBjaGFuZ2VWaWV3cyh0YXJnZXRTdGF0ZSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vc2hvdyByZW5kZXIgYSBsaXN0IG9mIHJlY2VudCByZWxlYXNlcyBvbiBpbml0aWFsaXplXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICB0aGlzLmdldFJlY2VudFJlbGVhc2VzSW5pdGlhbGl6ZSgpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgc2VhcmNoOiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplKCkge1xyXG4gICAgJC5nZXQoVXJsICsgJy9yZWNlbnRSZWxlYXNlJylcclxuICAgIC50aGVuKG1vdmllc1dpdGhSYXRpbmdzID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgbW92aWVzV2l0aFJhdGluZ3MpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBtb3ZpZXM6IG1vdmllc1dpdGhSYXRpbmdzLFxyXG4gICAgICAgIHJlY2VudFJlbGVhc2U6IHRydWUsXHJcbiAgICAgICAgbG9hZGluZzogZmFsc2VcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vZnVuY3Rpb24gdGhhdCB0YWtlcyBtb3ZpZXMgZnJvbSBleHRlcm5hbCBBUEkgYW5kIHF1ZXJ5IHRoZSBkYXRhYmFzZSBmb3IgcmF0aW5nc1xyXG4gIC8vd2lsbCBzZXQgdGhlIG1vdmllcyBzdGF0ZSBhZnRlciByYXRpbmdzIGFyZSBzdWNjZXNzZnVsbHkgcmV0cml2ZWRcclxuICBnZXRVc2VyUmF0aW5nc0Zvck1vdmllcyhtb3ZpZXNGcm9tT01EQikge1xyXG4gICAgaWYgKG1vdmllc0Zyb21PTURCLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBtb3ZpZXM6IFtdLFxyXG4gICAgICAgIHJlY2VudFJlbGVhc2U6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ3Bvc3RpbmcgdG86JywgVXJsICsgJy9nZXRNdWx0aXBsZU1vdmllUmF0aW5ncycpO1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9nZXRNdWx0aXBsZU1vdmllUmF0aW5ncycsIHsgbW92aWVzOiBtb3ZpZXNGcm9tT01EQiB9KVxyXG4gICAgICAuZG9uZShtb3ZpZXNXaXRoUmF0aW5ncyA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgbW92aWVzV2l0aFJhdGluZ3MpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgbW92aWVzOiBtb3ZpZXNXaXRoUmF0aW5ncyxcclxuICAgICAgICAgIHJlY2VudFJlbGVhc2U6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vLy8vRXZlbnQgSGFuZGxlcnNcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIC8vdGhpcyB3aWxsIGNhbGwgc2VhcmNoIGZvciBhIG1vdmllIGZyb20gZXh0ZXJuYWwgQVBJLCBkbyBhIGRhdGFiYXNlIHF1ZXJ5IGZvciByYXRpbmdcclxuICAvL2FuZCBzZXQgdGhlIHJlcG9uc2UgdG8gdGhlIG1vdmllcyBzdGF0ZVxyXG4gIGhhbmRsZVNlYXJjaChldmVudCkge1xyXG4gICAgaWYgKGV2ZW50LmNoYXJDb2RlID09PSAxMyB8fCBldmVudCA9PT0gJ2NsaWNrZWQnKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7bG9hZGluZzp0cnVlfSk7XHJcbiAgICAgIC8vdGhpcyB3aWxsIHNlYXJjaCBUTURCIGZvciBtb3ZpZSBhbmQgc2VuZCBpdCB0byBzZXJ2ZXIgdG8gcmV0cml2ZSB1c2VyIHJhdGluZ3NcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IFwiaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9zZWFyY2gvbW92aWVcIixcclxuICAgICAgICBqc29ucDogXCJjYWxsYmFja1wiLFxyXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25wXCIsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBxdWVyeTogdGhpcy5zdGF0ZS5zZWFyY2gsXHJcbiAgICAgICAgICAgIGFwaV9rZXk6IFwiOWQzYjAzNWVmMWNkNjY5YWVkMzk4NDAwYjE3ZmNlYTJcIixcclxuICAgICAgICAgICAgZm9ybWF0OiBcImpzb25cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICB2YXIgc29ydGVkID0gXy5zb3J0QnkocmVzcG9uc2UucmVzdWx0cywgJ2ltZGJSYXRpbmcnKTtcclxuICAgICAgICAgIHRoYXQuZ2V0VXNlclJhdGluZ3NGb3JNb3ZpZXMoc29ydGVkKTtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCk9Pnt0aGF0LnNldFN0YXRlKHtsb2FkaW5nOmZhbHNlfSl9LDEwMDApXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuXHJcbiAgICB2YXIgbGFibGUgPSAnUmVjZW50IFJlbGVhc2VzJztcclxuICAgIHZhciBmZWVkYmFja01zZyA9ICcnO1xyXG4gICAgaWYgKHRoaXMuc3RhdGUucmVjZW50UmVsZWFzZSA9PT0gZmFsc2UpIHtcclxuICAgICAgbGFibGUgPSAnYmFjayB0byByZWNlbnQgcmVsZWFzZXMnO1xyXG4gICAgICBpZiAodGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgZmVlZGJhY2tNc2cgPSAoPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPm5vIG1hdGNoIGZvdW5kLCBwbGVhc2UgdHJ5IGFub3RoZXIgdGl0bGU8L2Rpdj4pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZlZWRiYWNrTXNnID0gKDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlZE1zZ1wiPmFsbCBtYXRjaCByZXN1bHRzOjwvZGl2Pik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdIb21lIGNvbGxlY3Rpb24nPlxyXG4gICAgICB7dGhpcy5zdGF0ZS5sb2FkaW5nID8gPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzcyBsb2FkaW5nQmFyXCI+IDxkaXYgY2xhc3NOYW1lPVwiaW5kZXRlcm1pbmF0ZVwiPjwvZGl2PiA8L2Rpdj4gOiBudWxsfVxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInIG9uQ2xpY2s9e3RoaXMuZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplLmJpbmQodGhpcyl9PntsYWJsZX08L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VhcmNoTW92aWUnPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGUgPSd0ZXh0JyBpZD0nbW92aWVJbnB1dCcgXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J2ZpbmQgYSBtb3ZpZSdcclxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuc2VhcmNofVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcykoJ2NsaWNrZWQnKX0+c2VhcmNoPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHtmZWVkYmFja01zZ31cclxuICAgICAgICA8TW92aWVMaXN0IG1vdmllcz17dGhpcy5zdGF0ZS5tb3ZpZXN9XHJcbiAgICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxud2luZG93LkhvbWUgPSBIb21lOyJdfQ==