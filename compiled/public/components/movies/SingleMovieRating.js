'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleMovieRating = function (_React$Component) {
  _inherits(SingleMovieRating, _React$Component);

  function SingleMovieRating(props) {
    _classCallCheck(this, SingleMovieRating);

    var _this = _possibleConstructorReturn(this, (SingleMovieRating.__proto__ || Object.getPrototypeOf(SingleMovieRating)).call(this, props));

    _this.state = {
      value: '',
      movie: _this.props.currentMovie,
      view: 'SingleMovie',
      friendRatings: []
    };
    return _this;
  }

  _createClass(SingleMovieRating, [{
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
    value: function onStarClick(event) {
      this.setState({ userRating: event.target.value });
      this.updateRating(event.target.value);
    }
  }, {
    key: 'getFriends',
    value: function getFriends() {
      var that = this;
      $.post(Url + '/getFriends').then(function (resp) {
        console.log(that.state.friends);
      }).catch(function (err) {
        console.log(err);
      });
    }

    //get friend ratings by calling requesthandler
    //get friendratings, passing in mainUser and movieobj

  }, {
    key: 'getFriendsRating',
    value: function getFriendsRating(inputMovie) {
      console.log('posting');
      var that = this;
      $.post(Url + '/getFriendRatings', { movie: inputMovie }).then(function (response) {
        console.log('response from server getFriendsRating: ', response);
        that.setState({
          friendRatings: response
        });
      }).catch(function (err) {
        console.log(err);
      });
      // console.log('this is the movie', inputMovie);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var that = this;
      var movie = this.state.movie;
      return React.createElement(
        'div',
        { className: 'Home collection', onClick: function onClick() {
            return console.log(that.state);
          } },
        React.createElement(
          'div',
          { className: 'movieEntry collection-item row' },
          React.createElement('img', { className: 'moviethumnail col s3', src: movie.poster, onClick: function onClick() {
              return _this2.props.change("SingleMovie", movie);
            } }),
          React.createElement(
            'div',
            { className: 'right col s9' },
            React.createElement(
              'h5',
              { className: 'movieTitle', onClick: function onClick() {
                  return _this2.props.change("SingleMovie", movie);
                } },
              movie.title
            ),
            React.createElement(
              'p',
              { className: 'movieYear' },
              movie.release_date
            ),
            React.createElement(
              'p',
              { className: 'movieDescription' },
              movie.description
            ),
            React.createElement(ReviewComponent, {
              review: movie.review,
              title: movie.title,
              id: movie.id }),
            React.createElement(MovieWatchRequest, { movie: movie }),
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
                  movie.imdbRating
                )
              ),
              React.createElement(StarRatingComponent, { movie: movie }),
              React.createElement(
                'div',
                { className: 'avgFriendRatingBlock col s4' },
                'average friend rating: ',
                movie.friendAverageRating ? React.createElement(
                  'b',
                  null,
                  movie.friendAverageRating
                ) : 'n/a'
              )
            )
          )
        ),
        React.createElement(
          'div',
          null,
          this.state.friendRatings.map(function (friendRating) {
            return React.createElement(SingleMovieRatingEntry, {
              rating: friendRating,
              change: that.props.change,
              fof: that.props.fof
            });
          })
        )
      );
    }
  }]);

  return SingleMovieRating;
}(React.Component);

;

window.SingleMovieRating = SingleMovieRating;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZy5qcyJdLCJuYW1lcyI6WyJTaW5nbGVNb3ZpZVJhdGluZyIsInByb3BzIiwic3RhdGUiLCJ2YWx1ZSIsIm1vdmllIiwiY3VycmVudE1vdmllIiwidmlldyIsImZyaWVuZFJhdGluZ3MiLCJnZXRGcmllbmRzUmF0aW5nIiwic2V0U3RhdGUiLCJldmVudCIsInVzZXJSYXRpbmciLCJ0YXJnZXQiLCJ1cGRhdGVSYXRpbmciLCJ0aGF0IiwiJCIsInBvc3QiLCJVcmwiLCJ0aGVuIiwicmVzcCIsImNvbnNvbGUiLCJsb2ciLCJmcmllbmRzIiwiY2F0Y2giLCJlcnIiLCJpbnB1dE1vdmllIiwicmVzcG9uc2UiLCJwb3N0ZXIiLCJjaGFuZ2UiLCJ0aXRsZSIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwicmV2aWV3IiwiaWQiLCJpbWRiUmF0aW5nIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsIm1hcCIsImZyaWVuZFJhdGluZyIsImZvZiIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLGlCOzs7QUFDSiw2QkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLHNJQUNYQSxLQURXOztBQUVqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsYUFBTyxFQURJO0FBRVhDLGFBQU8sTUFBS0gsS0FBTCxDQUFXSSxZQUZQO0FBR1hDLFlBQU0sYUFISztBQUlYQyxxQkFBZTtBQUpKLEtBQWI7QUFGaUI7QUFRbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUtDLGdCQUFMLENBQXNCLEtBQUtOLEtBQUwsQ0FBV0UsS0FBakM7QUFDRDs7O2dEQUUyQjtBQUMxQixXQUFLSyxRQUFMLENBQWM7QUFDWkwsZUFBTyxLQUFLSCxLQUFMLENBQVdHO0FBRE4sT0FBZDtBQUdEOzs7Z0NBRVdNLEssRUFBTztBQUNqQixXQUFLRCxRQUFMLENBQWMsRUFB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Q0FBNkI7QUFBQSxtQkFDNUIsb0JBQUMsc0JBQUQ7QUFDQSxzQkFBUUMsWUFEUjtBQUVBLHNCQUFRdkIsS0FBS2IsS0FBTCxDQUFXMkIsTUFGbkI7QUFHQSxtQkFBS2QsS0FBS2IsS0FBTCxDQUFXcUM7QUFIaEIsY0FENEI7QUFBQSxXQUE3QjtBQURIO0FBcEJGLE9BREY7QUFnQ0Q7Ozs7RUExRjZCQyxNQUFNQyxTOztBQTJGckM7O0FBRURDLE9BQU96QyxpQkFBUCxHQUEyQkEsaUJBQTNCIiwiZmlsZSI6IlNpbmdsZU1vdmllUmF0aW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2luZ2xlTW92aWVSYXRpbmcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB2YWx1ZTogJycsXHJcbiAgICAgIG1vdmllOiB0aGlzLnByb3BzLmN1cnJlbnRNb3ZpZSxcclxuICAgICAgdmlldzogJ1NpbmdsZU1vdmllJyxcclxuICAgICAgZnJpZW5kUmF0aW5nczogW11cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIHRoaXMuZ2V0RnJpZW5kc1JhdGluZyh0aGlzLnN0YXRlLm1vdmllKTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgbW92aWU6IHRoaXMucHJvcHMubW92aWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25TdGFyQ2xpY2soZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe3VzZXJSYXRpbmc6IGV2ZW50LnRhcmdldC52YWx1ZX0pO1xyXG4gICAgdGhpcy51cGRhdGVSYXRpbmcoZXZlbnQudGFyZ2V0LnZhbHVlKTtcclxuICB9XHJcblxyXG4gIGdldEZyaWVuZHMoKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRzJylcclxuICAgIC50aGVuKGZ1bmN0aW9uKHJlc3ApIHtcclxuICAgICAgY29uc29sZS5sb2codGhhdC5zdGF0ZS5mcmllbmRzKVxyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9nZXQgZnJpZW5kIHJhdGluZ3MgYnkgY2FsbGluZyByZXF1ZXN0aGFuZGxlclxyXG4gIC8vZ2V0IGZyaWVuZHJhdGluZ3MsIHBhc3NpbmcgaW4gbWFpblVzZXIgYW5kIG1vdmllb2JqXHJcbiAgZ2V0RnJpZW5kc1JhdGluZyhpbnB1dE1vdmllKSB7XHJcbiAgICBjb25zb2xlLmxvZygncG9zdGluZycpXHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRSYXRpbmdzJywge21vdmllOiBpbnB1dE1vdmllfSlcclxuICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlciBnZXRGcmllbmRzUmF0aW5nOiAnLCByZXNwb25zZSk7XHJcbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xyXG4gICAgICAgIGZyaWVuZFJhdGluZ3M6IHJlc3BvbnNlXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICB9KTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBtb3ZpZScsIGlucHV0TW92aWUpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgbGV0IG1vdmllID0gdGhpcy5zdGF0ZS5tb3ZpZTtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdIb21lIGNvbGxlY3Rpb24nIG9uQ2xpY2s9eygpPT4gY29uc29sZS5sb2codGhhdC5zdGF0ZSl9PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW92aWVFbnRyeSBjb2xsZWN0aW9uLWl0ZW0gcm93XCI+XHJcbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0nbW92aWV0aHVtbmFpbCBjb2wgczMnIHNyYz17bW92aWUucG9zdGVyfSBvbkNsaWNrPXsoKSA9PiAodGhpcy5wcm9wcy5jaGFuZ2UoXCJTaW5nbGVNb3ZpZVwiLCBtb3ZpZSkpfS8+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncmlnaHQgY29sIHM5Jz5cclxuICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT0nbW92aWVUaXRsZScgb25DbGljaz17KCkgPT4gKHRoaXMucHJvcHMuY2hhbmdlKFwiU2luZ2xlTW92aWVcIiwgbW92aWUpKX0+e21vdmllLnRpdGxlfTwvaDU+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0nbW92aWVZZWFyJz57bW92aWUucmVsZWFzZV9kYXRlfTwvcD5cclxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSdtb3ZpZURlc2NyaXB0aW9uJz57bW92aWUuZGVzY3JpcHRpb259PC9wPlxyXG4gICAgICAgICAgICA8UmV2aWV3Q29tcG9uZW50IFxyXG4gICAgICAgICAgICAgIHJldmlldz17bW92aWUucmV2aWV3fSBcclxuICAgICAgICAgICAgICB0aXRsZT17bW92aWUudGl0bGV9XHJcbiAgICAgICAgICAgICAgaWQ9e21vdmllLmlkfS8+XHJcbiAgICAgICAgICAgIDxNb3ZpZVdhdGNoUmVxdWVzdCBtb3ZpZT17bW92aWV9Lz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmF0aW5ncyByb3dcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naW1kYlJhdGluZyBjb2wgczQnPklNREIgcmF0aW5nOiA8Yj57bW92aWUuaW1kYlJhdGluZ308L2I+PC9kaXY+XHJcbiAgICAgICAgICAgICAgPFN0YXJSYXRpbmdDb21wb25lbnQgbW92aWU9e21vdmllfS8+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2F2Z0ZyaWVuZFJhdGluZ0Jsb2NrIGNvbCBzNCc+YXZlcmFnZSBmcmllbmQgcmF0aW5nOiB7KG1vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmcpID8gPGI+e21vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmd9PC9iPiA6ICduL2EnIH08L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAge3RoaXMuc3RhdGUuZnJpZW5kUmF0aW5ncy5tYXAoZnJpZW5kUmF0aW5nID0+IFxyXG4gICAgICAgICAgICA8U2luZ2xlTW92aWVSYXRpbmdFbnRyeSBcclxuICAgICAgICAgICAgcmF0aW5nPXtmcmllbmRSYXRpbmd9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhhdC5wcm9wcy5jaGFuZ2V9XHJcbiAgICAgICAgICAgIGZvZj17dGhhdC5wcm9wcy5mb2Z9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn07XHJcblxyXG53aW5kb3cuU2luZ2xlTW92aWVSYXRpbmcgPSBTaW5nbGVNb3ZpZVJhdGluZzsiXX0=