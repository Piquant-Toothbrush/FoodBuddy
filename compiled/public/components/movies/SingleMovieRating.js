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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZy5qcyJdLCJuYW1lcyI6WyJTaW5nbGVNb3ZpZVJhdGluZyIsInByb3BzIiwic3RhdGUiLCJ2YWx1ZSIsIm1vdmllIiwiY3VycmVudE1vdmllIiwidmlldyIsImZyaWVuZFJhdGluZ3MiLCJnZXRGcmllbmRzUmF0aW5nIiwic2V0U3RhdGUiLCJldmVudCIsInVzZXJSYXRpbmciLCJ0YXJnZXQiLCJ1cGRhdGVSYXRpbmciLCJ0aGF0IiwiJCIsInBvc3QiLCJVcmwiLCJ0aGVuIiwicmVzcCIsImNhdGNoIiwiZXJyIiwiaW5wdXRNb3ZpZSIsInJlc3BvbnNlIiwidW5pcVJlc3BvbnNlcyIsImZyaWVuZE5hbWUiLCJpIiwibGVuZ3RoIiwiZnJpZW5kVXNlck5hbWUiLCJwdXNoIiwicG9zdGVyIiwiY2hhbmdlIiwidGl0bGUiLCJyZWxlYXNlX2RhdGUiLCJkZXNjcmlwdGlvbiIsInJldmlldyIsImlkIiwiaW1kYlJhdGluZyIsImZyaWVuZEF2ZXJhZ2VSYXRpbmciLCJtYXAiLCJmcmllbmRSYXRpbmciLCJmb2YiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxpQjs7O0FBQ0osYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUVqQixNQUFLQyxLQUFMLEdBQWE7QUFDWEMsYUFBTyxFQURJO0FBRVhDLGFBQU8sRUFBS0gsS0FBTCxDQUFXSSxZQUZQO0FBR1hDLFlBQU0sYUFISztBQUlYQyxxQkFBZTtBQUpKLEtBQWI7QUFGaUI7QUFRbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUtDLGdCQUFMLENBQXNCLEtBQUtOLEtBQUwsQ0FBV0UsS0FBakM7QUFFRDs7O2dEQUUyQjtBQUMxQixXQUFLSyxRQUFMLENBQWM7QUFDWkwsZUFBTyxLQUFLSCxLQUFMLENBQVdHO0FBRE4sT0FBZDtBQUdEOzs7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a0M7QUFBVixpQkFBOUIsR0FBbUU7QUFBeEk7QUFIRjtBQVZGO0FBRkYsU0FERjtBQW9CRTtBQUFBO0FBQUE7QUFDRyxlQUFLcEMsS0FBTCxDQUFXSyxhQUFYLENBQXlCZ0MsR0FBekIsQ0FBNkI7QUFBQSxtQkFDNUIsb0JBQUMsc0JBQUQ7QUFDQSxzQkFBUUMsQ0FEUjtBQUVBLHNCQUFRMUIsRUFBS2IsS0FBTCxDQUFXOEIsTUFGbkI7QUFHQSxtQkFBS2pCLEVBQUtiLEtBQUwsQ0FBV3dDO0FBSGhCLGNBRDRCO0FBQUEsV0FBN0I7QUFESDtBQXBCRixPQURGO0FBZ0NEOzs7O0VBdEc2QkMsTUFBTUMsUzs7QUF1R3JDOztBQUVEQyxPQUFPNUMsaUJBQVAsR0FBMkJBLGlCQUEzQiIsImZpbGUiOiJTaW5nbGVNb3ZpZVJhdGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNpbmdsZU1vdmllUmF0aW5nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdmFsdWU6ICcnLFxyXG4gICAgICBtb3ZpZTogdGhpcy5wcm9wcy5jdXJyZW50TW92aWUsXHJcbiAgICAgIHZpZXc6ICdTaW5nbGVNb3ZpZScsXHJcbiAgICAgIGZyaWVuZFJhdGluZ3M6IFtdXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICB0aGlzLmdldEZyaWVuZHNSYXRpbmcodGhpcy5zdGF0ZS5tb3ZpZSk7XHJcblxyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtb3ZpZTogdGhpcy5wcm9wcy5tb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBvblN0YXJDbGljayhldmVudCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7dXNlclJhdGluZzogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XHJcbiAgICB0aGlzLnVwZGF0ZVJhdGluZyhldmVudC50YXJnZXQudmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgZ2V0RnJpZW5kcygpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZHMnKVxyXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzcCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGF0LnN0YXRlLmZyaWVuZHMpXHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL2dldCBmcmllbmQgcmF0aW5ncyBieSBjYWxsaW5nIHJlcXVlc3RoYW5kbGVyXHJcbiAgLy9nZXQgZnJpZW5kcmF0aW5ncywgcGFzc2luZyBpbiBtYWluVXNlciBhbmQgbW92aWVvYmpcclxuICBnZXRGcmllbmRzUmF0aW5nKGlucHV0TW92aWUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdwb3N0aW5nJylcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZFJhdGluZ3MnLCB7bW92aWU6IGlucHV0TW92aWV9KVxyXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlciBnZXRGcmllbmRzUmF0aW5nOiAnLCByZXNwb25zZSk7XHJcbiAgICAgICBjb25zdCB1bmlxUmVzcG9uc2VzID0gW107XHJcbiAgICAgICBjb25zdCBmcmllbmROYW1lID0ge307XHJcbiAgICAgICBmb3IgKGxldCBpPTA7IGk8cmVzcG9uc2UubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICBpZiAoZnJpZW5kTmFtZVtyZXNwb25zZVtpXS5mcmllbmRVc2VyTmFtZV0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICBmcmllbmROYW1lW3Jlc3BvbnNlW2ldLmZyaWVuZFVzZXJOYW1lXSA9IFwiZGVmaW5lZFwiO1xyXG4gICAgICAgICAgdW5pcVJlc3BvbnNlcy5wdXNoKHJlc3BvbnNlW2ldKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgfVxyXG5cclxuICAgICAgY29uc29sZS5sb2coJ3Nob3VsZCBiZSB1bmlxJywgdW5pcVJlc3BvbnNlcyk7XHJcblxyXG4gICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICBmcmllbmRSYXRpbmdzOiB1bmlxUmVzcG9uc2VzXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgICB9KTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBtb3ZpZScsIGlucHV0TW92aWUpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgbGV0IG1vdmllID0gdGhpcy5zdGF0ZS5tb3ZpZTtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdIb21lIGNvbGxlY3Rpb24nIG9uQ2xpY2s9eygpPT4gY29uc29sZS5sb2codGhhdC5zdGF0ZSl9PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW92aWVFbnRyeSBjb2xsZWN0aW9uLWl0ZW0gcm93XCI+XHJcbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0nbW92aWV0aHVtbmFpbCBjb2wgczMnIHNyYz17bW92aWUucG9zdGVyfSBvbkNsaWNrPXsoKSA9PiAodGhpcy5wcm9wcy5jaGFuZ2UoXCJTaW5nbGVNb3ZpZVwiLCBtb3ZpZSkpfS8+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncmlnaHQgY29sIHM5Jz5cclxuICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT0nbW92aWVUaXRsZScgb25DbGljaz17KCkgPT4gKHRoaXMucHJvcHMuY2hhbmdlKFwiU2luZ2xlTW92aWVcIiwgbW92aWUpKX0+e21vdmllLnRpdGxlfTwvaDU+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0nbW92aWVZZWFyJz57bW92aWUucmVsZWFzZV9kYXRlfTwvcD5cclxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSdtb3ZpZURlc2NyaXB0aW9uJz57bW92aWUuZGVzY3JpcHRpb259PC9wPlxyXG4gICAgICAgICAgICA8UmV2aWV3Q29tcG9uZW50IFxyXG4gICAgICAgICAgICAgIHJldmlldz17bW92aWUucmV2aWV3fSBcclxuICAgICAgICAgICAgICB0aXRsZT17bW92aWUudGl0bGV9XHJcbiAgICAgICAgICAgICAgaWQ9e21vdmllLmlkfS8+XHJcbiAgICAgICAgICAgIDxNb3ZpZVdhdGNoUmVxdWVzdCBtb3ZpZT17bW92aWV9Lz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmF0aW5ncyByb3dcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naW1kYlJhdGluZyBjb2wgczQnPklNREIgcmF0aW5nOiA8Yj57bW92aWUuaW1kYlJhdGluZ308L2I+PC9kaXY+XHJcbiAgICAgICAgICAgICAgPFN0YXJSYXRpbmdDb21wb25lbnQgbW92aWU9e21vdmllfS8+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2F2Z0ZyaWVuZFJhdGluZ0Jsb2NrIGNvbCBzNCc+YXZlcmFnZSBmcmllbmQgcmF0aW5nOiB7KG1vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmcpID8gPGI+e21vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmd9PC9iPiA6ICduL2EnIH08L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAge3RoaXMuc3RhdGUuZnJpZW5kUmF0aW5ncy5tYXAoZnJpZW5kUmF0aW5nID0+IFxyXG4gICAgICAgICAgICA8U2luZ2xlTW92aWVSYXRpbmdFbnRyeSBcclxuICAgICAgICAgICAgcmF0aW5nPXtmcmllbmRSYXRpbmd9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhhdC5wcm9wcy5jaGFuZ2V9XHJcbiAgICAgICAgICAgIGZvZj17dGhhdC5wcm9wcy5mb2Z9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn07XHJcblxyXG53aW5kb3cuU2luZ2xlTW92aWVSYXRpbmcgPSBTaW5nbGVNb3ZpZVJhdGluZzsiXX0=