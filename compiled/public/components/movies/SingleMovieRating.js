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
        // console.log(that.state.friends)
      }).catch(function (err) {
        console.log(err);
      });
    }

    //get friend ratings by calling requesthandler
    //get friendratings, passing in mainUser and movieobj

  }, {
    key: 'getFriendsRating',
    value: function getFriendsRating(inputMovie) {
      // console.log('posting')
      var that = this;
      $.post(Url + '/getFriendRatings', { movie: inputMovie }).then(function (response) {
        // console.log('response from server getFriendsRating: ', response);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZy5qcyJdLCJuYW1lcyI6WyJTaW5nbGVNb3ZpZVJhdGluZyIsInByb3BzIiwic3RhdGUiLCJ2YWx1ZSIsIm1vdmllIiwiY3VycmVudE1vdmllIiwidmlldyIsImZyaWVuZFJhdGluZ3MiLCJnZXRGcmllbmRzUmF0aW5nIiwic2V0U3RhdGUiLCJldmVudCIsInVzZXJSYXRpbmciLCJ0YXJnZXQiLCJ1cGRhdGVSYXRpbmciLCJ0aGF0IiwiJCIsInBvc3QiLCJVcmwiLCJ0aGVuIiwicmVzcCIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImxvZyIsImlucHV0TW92aWUiLCJyZXNwb25zZSIsInBvc3RlciIsImNoYW5nZSIsInRpdGxlIiwicmVsZWFzZV9kYXRlIiwiZGVzY3JpcHRpb24iLCJyZXZpZXciLCJpZCIsImltZGJSYXRpbmciLCJmcmllbmRBdmVyYWdlUmF0aW5nIiwibWFwIiwiZnJpZW5kUmF0aW5nIiwiZm9mIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsaUI7OztBQUNKLDZCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsc0lBQ1hBLEtBRFc7O0FBRWpCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxhQUFPLEVBREk7QUFFWEMsYUFBTyxNQUFLSCxLQUFMLENBQVdJLFlBRlA7QUFHWEMsWUFBTSxhQUhLO0FBSVhDLHFCQUFlO0FBSkosS0FBYjtBQUZpQjtBQVFsQjs7Ozt3Q0FFbUI7QUFDbEIsV0FBS0MsZ0JBQUwsQ0FBc0IsS0FBS04sS0FBTCxDQUFXRSxLQUFqQztBQUNEOzs7Z0RBRTJCO0FBQzFCLFdBQUtLLFFBQUwsQ0FBYztBQUNaTCxlQUFPLEtBQUtILEtBQUwsQ0FBV0c7QUFETixPQUFkO0FBR0Q7OztnQ0FFV00sSyxFQUFPO0FBQ2pCLFdBQUtELFFBQUwsQ0FBYyxFQUFDRSxZQUFZRCxN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QztBQUhoQixjQUQ0QjtBQUFBLFdBQTdCO0FBREg7QUFwQkYsT0FERjtBQWdDRDs7OztFQTFGNkJDLE1BQU1DLFM7O0FBMkZyQzs7QUFFREMsT0FBT3hDLGlCQUFQLEdBQTJCQSxpQkFBM0IiLCJmaWxlIjoiU2luZ2xlTW92aWVSYXRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTaW5nbGVNb3ZpZVJhdGluZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHZhbHVlOiAnJyxcclxuICAgICAgbW92aWU6IHRoaXMucHJvcHMuY3VycmVudE1vdmllLFxyXG4gICAgICB2aWV3OiAnU2luZ2xlTW92aWUnLFxyXG4gICAgICBmcmllbmRSYXRpbmdzOiBbXVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5nZXRGcmllbmRzUmF0aW5nKHRoaXMuc3RhdGUubW92aWUpO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtb3ZpZTogdGhpcy5wcm9wcy5tb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvblN0YXJDbGljayhldmVudCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7dXNlclJhdGluZzogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XHJcbiAgICB0aGlzLnVwZGF0ZVJhdGluZyhldmVudC50YXJnZXQudmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0RnJpZW5kcygpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZHMnKVxyXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzcCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGF0LnN0YXRlLmZyaWVuZHMpXHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL2dldCBmcmllbmQgcmF0aW5ncyBieSBjYWxsaW5nIHJlcXVlc3RoYW5kbGVyXHJcbiAgLy9nZXQgZnJpZW5kcmF0aW5ncywgcGFzc2luZyBpbiBtYWluVXNlciBhbmQgbW92aWVvYmpcclxuICBnZXRGcmllbmRzUmF0aW5nKGlucHV0TW92aWUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdwb3N0aW5nJylcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZFJhdGluZ3MnLCB7bW92aWU6IGlucHV0TW92aWV9KVxyXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyIGdldEZyaWVuZHNSYXRpbmc6ICcsIHJlc3BvbnNlKTtcclxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kUmF0aW5nczogcmVzcG9uc2VcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgIH0pO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIG1vdmllJywgaW5wdXRNb3ZpZSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICBsZXQgbW92aWUgPSB0aGlzLnN0YXRlLm1vdmllO1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9J0hvbWUgY29sbGVjdGlvbicgb25DbGljaz17KCk9PiBjb25zb2xlLmxvZyh0aGF0LnN0YXRlKX0+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb3ZpZUVudHJ5IGNvbGxlY3Rpb24taXRlbSByb3dcIj5cclxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSdtb3ZpZXRodW1uYWlsIGNvbCBzMycgc3JjPXttb3ZpZS5wb3N0ZXJ9IG9uQ2xpY2s9eygpID0+ICh0aGlzLnByb3BzLmNoYW5nZShcIlNpbmdsZU1vdmllXCIsIG1vdmllKSl9Lz5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyaWdodCBjb2wgczknPlxyXG4gICAgICAgICAgICA8aDUgY2xhc3NOYW1lPSdtb3ZpZVRpdGxlJyBvbkNsaWNrPXsoKSA9PiAodGhpcy5wcm9wcy5jaGFuZ2UoXCJTaW5nbGVNb3ZpZVwiLCBtb3ZpZSkpfT57bW92aWUudGl0bGV9PC9oNT5cclxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSdtb3ZpZVllYXInPnttb3ZpZS5yZWxlYXNlX2RhdGV9PC9wPlxyXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9J21vdmllRGVzY3JpcHRpb24nPnttb3ZpZS5kZXNjcmlwdGlvbn08L3A+XHJcbiAgICAgICAgICAgIDxSZXZpZXdDb21wb25lbnQgXHJcbiAgICAgICAgICAgICAgcmV2aWV3PXttb3ZpZS5yZXZpZXd9IFxyXG4gICAgICAgICAgICAgIHRpdGxlPXttb3ZpZS50aXRsZX1cclxuICAgICAgICAgICAgICBpZD17bW92aWUuaWR9Lz5cclxuICAgICAgICAgICAgPE1vdmllV2F0Y2hSZXF1ZXN0IG1vdmllPXttb3ZpZX0vPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyYXRpbmdzIHJvd1wiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpbWRiUmF0aW5nIGNvbCBzNCc+SU1EQiByYXRpbmc6IDxiPnttb3ZpZS5pbWRiUmF0aW5nfTwvYj48L2Rpdj5cclxuICAgICAgICAgICAgICA8U3RhclJhdGluZ0NvbXBvbmVudCBtb3ZpZT17bW92aWV9Lz5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYXZnRnJpZW5kUmF0aW5nQmxvY2sgY29sIHM0Jz5hdmVyYWdlIGZyaWVuZCByYXRpbmc6IHsobW92aWUuZnJpZW5kQXZlcmFnZVJhdGluZykgPyA8Yj57bW92aWUuZnJpZW5kQXZlcmFnZVJhdGluZ308L2I+IDogJ24vYScgfTwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICB7dGhpcy5zdGF0ZS5mcmllbmRSYXRpbmdzLm1hcChmcmllbmRSYXRpbmcgPT4gXHJcbiAgICAgICAgICAgIDxTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5IFxyXG4gICAgICAgICAgICByYXRpbmc9e2ZyaWVuZFJhdGluZ31cclxuICAgICAgICAgICAgY2hhbmdlPXt0aGF0LnByb3BzLmNoYW5nZX1cclxuICAgICAgICAgICAgZm9mPXt0aGF0LnByb3BzLmZvZn1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuXHJcbndpbmRvdy5TaW5nbGVNb3ZpZVJhdGluZyA9IFNpbmdsZU1vdmllUmF0aW5nOyJdfQ==