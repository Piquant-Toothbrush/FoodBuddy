'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MyRatings = function (_React$Component) {
  _inherits(MyRatings, _React$Component);

  function MyRatings(props) {
    _classCallCheck(this, MyRatings);

    var _this = _possibleConstructorReturn(this, (MyRatings.__proto__ || Object.getPrototypeOf(MyRatings)).call(this, props));

    _this.state = {
      movies: [],
      allRatedMovies: true,
      search: ''
    };
    return _this;
  }

  //show render a list of recent releases on initialize


  _createClass(MyRatings, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getAllRatedMovies();
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({
        search: event.target.value
      });
    }
  }, {
    key: 'getAllRatedMovies',
    value: function getAllRatedMovies() {
      var _this2 = this;

      console.log(this.state.movies);
      $.get(Url + '/getUserRatings').then(function (userRatedMovies) {
        console.log('response from server', userRatedMovies);
        _this2.setState({
          movies: userRatedMovies,
          allRatedMovies: true
        });
      });
    }

    //////////////////////
    /////Event Handlers
    //////////////////////

    //this will call search for a movie from external API, do a database query for rating
    //and set the reponse to the movies state

  }, {
    key: 'handleSearch',
    value: function handleSearch(event) {
      var _this3 = this;

      console.log(this.state.search, this.state.movies);
      if (event.charCode == 13 || event === 'clicked') {
        (function () {
          var that = _this3;
          var found = false;

          _this3.state.movies.forEach(function (el, idx) {
            console.log(_this3.state.movies[i]);
            if (el.title === _this3.state.search) {
              console.log(_this3.state.search);
              that.setState({
                movies: [_this3.state.movies[i]],
                allRatedMovies: false
              });
              found = true;
            }
          });
          if (!found) {
            console.log('should now show them message that there is no such movie');
          }
        })();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var lable;
      var results;
      if (this.state.allRatedMovies === false) {
        lable = 'Back To All Rated Movies';
        results = this.state.movies.length === 0 ? React.createElement(
          'div',
          { className: 'errorMsg' },
          'Results cannot be found'
        ) : React.createElement(
          'div',
          { className: 'updateMsg' },
          'All match results:'
        );
      } else if (this.state.allRatedMovies && this.state.movies.length === 0) {
        lable = 'You have not rated any movies';
      } else {
        lable = 'All Rated Movies';
      }

      return React.createElement(
        'div',
        { className: 'MyRatings collection' },
        React.createElement(
          'div',
          { className: 'header', onClick: this.getAllRatedMovies.bind(this) },
          lable
        ),
        React.createElement(
          'div',
          { className: 'searchMovie' },
          React.createElement('input', { type: 'text', id: 'movieInput',
            className: 'movieInput',
            value: this.state.search,
            placeholder: 'Insert Movie Title',
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
        results,
        React.createElement(MovieList, { movies: this.state.movies,
          change: this.props.change.bind(this)
        })
      );
    }
  }]);

  return MyRatings;
}(React.Component);

window.MyRatings = MyRatings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOlsiTXlSYXRpbmdzIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsImFsbFJhdGVkTW92aWVzIiwic2VhcmNoIiwiZ2V0QWxsUmF0ZWRNb3ZpZXMiLCJldmVudCIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCJjb25zb2xlIiwibG9nIiwiJCIsImdldCIsIlVybCIsInRoZW4iLCJ1c2VyUmF0ZWRNb3ZpZXMiLCJjaGFyQ29kZSIsInRoYXQiLCJmb3VuZCIsImZvckVhY2giLCJlbCIsImlkeCIsImkiLCJ0aXRsZSIsImxhYmxlIiwicmVzdWx0cyIsImxlbmd0aCIsImJpbmQiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVTZWFyY2giLCJjaGFuZ2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxTOzs7QUFDSixxQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLHNIQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsY0FBUSxFQURHO0FBRVhDLHNCQUFnQixJQUZMO0FBR1hDLGNBQVE7QUFIRyxLQUFiO0FBSGlCO0FBUWxCOztBQUVEOzs7Ozt3Q0FDb0I7QUFDbEIsV0FBS0MsaUJBQUw7QUFDRDs7O2lDQUVZQyxLLEVBQU87QUFDbEIsV0FBS0MsUUFBTCxDQUFjO0FBQ1pILGdCQUFRRSxNQUFNRSxNQUFOLENBQWFDO0FBRFQsT0FBZDtBQUdEOzs7d0NBR21CO0FBQUE7O0FBQ2xCQyxjQUFRQyxHQUFSLENBQVksS0FBS1YsS0FBTCxDQUFXQyxNQUF2QjtBQUNBVSxRQUFFQyxHQUFGLENBQU1DLE1BQU0saUJBQVosRUFDQ0MsSUFERCxDQUNNLDJCQUFtQjtBQUN0QkwsZ0JBQVFDLEdBQVIsQ0FBWSxzQkFBWixFQUFvQ0ssZUFBcEM7QUFDRCxlQUFLVCxRQUFMLENBQWM7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bEIsQ0FBdUIsSUFBdkI7QUFEUjtBQVpGLE9BREY7QUFrQkQ7Ozs7RUFqR3FCSSxNQUFNQyxTOztBQW9HOUJDLE9BQU9uQyxTQUFQLEdBQW1CQSxTQUFuQiIsImZpbGUiOiJNeVJhdGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNeVJhdGluZ3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgbW92aWVzOiBbXSxcclxuICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWUsXHJcbiAgICAgIHNlYXJjaDogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvL3Nob3cgcmVuZGVyIGEgbGlzdCBvZiByZWNlbnQgcmVsZWFzZXMgb24gaW5pdGlhbGl6ZVxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5nZXRBbGxSYXRlZE1vdmllcygpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgc2VhcmNoOiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGdldEFsbFJhdGVkTW92aWVzKCkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5tb3ZpZXMpO1xyXG4gICAgJC5nZXQoVXJsICsgJy9nZXRVc2VyUmF0aW5ncycpXHJcbiAgICAudGhlbih1c2VyUmF0ZWRNb3ZpZXMgPT4ge1xyXG4gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgdXNlclJhdGVkTW92aWVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbW92aWVzOiB1c2VyUmF0ZWRNb3ZpZXMsXHJcbiAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWVcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xyXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnNlYXJjaCx0aGlzLnN0YXRlLm1vdmllcyk7XHJcbiAgICBpZiAoZXZlbnQuY2hhckNvZGUgPT0gMTMgfHwgZXZlbnQgPT09ICdjbGlja2VkJykge1xyXG4gICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgbGV0IGZvdW5kPWZhbHNlO1xyXG5cclxuICAgICAgdGhpcy5zdGF0ZS5tb3ZpZXMuZm9yRWFjaCgoZWwsaWR4KT0+e1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUubW92aWVzW2ldKTtcclxuICAgICAgICBpZiAoZWwudGl0bGU9PT10aGlzLnN0YXRlLnNlYXJjaCl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnNlYXJjaCk7XHJcbiAgICAgICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbW92aWVzOiBbdGhpcy5zdGF0ZS5tb3ZpZXNbaV1dLFxyXG4gICAgICAgICAgICBhbGxSYXRlZE1vdmllczogZmFsc2VcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgZm91bmQ9dHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAgIGlmICghZm91bmQpe1xyXG4gICAgICAgICBjb25zb2xlLmxvZygnc2hvdWxkIG5vdyBzaG93IHRoZW0gbWVzc2FnZSB0aGF0IHRoZXJlIGlzIG5vIHN1Y2ggbW92aWUnKTtcclxuICAgICAgIH0gICAgXHJcbiAgICAgIH1cclxuICAgIH1cclxuICBcclxuXHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHZhciBsYWJsZTtcclxuICAgIHZhciByZXN1bHRzO1xyXG4gICAgaWYgKHRoaXMuc3RhdGUuYWxsUmF0ZWRNb3ZpZXMgPT09IGZhbHNlKSB7XHJcbiAgICAgIGxhYmxlID0gJ0JhY2sgVG8gQWxsIFJhdGVkIE1vdmllcyc7XHJcbiAgICAgIHJlc3VsdHMgPSAodGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSA/ICg8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+UmVzdWx0cyBjYW5ub3QgYmUgZm91bmQ8L2Rpdj4pIDogKDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlTXNnXCI+QWxsIG1hdGNoIHJlc3VsdHM6PC9kaXY+KVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmFsbFJhdGVkTW92aWVzICYmIHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBsYWJsZSA9ICdZb3UgaGF2ZSBub3QgcmF0ZWQgYW55IG1vdmllcyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsYWJsZSA9ICdBbGwgUmF0ZWQgTW92aWVzJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nTXlSYXRpbmdzIGNvbGxlY3Rpb24nPiBcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJyBvbkNsaWNrPXt0aGlzLmdldEFsbFJhdGVkTW92aWVzLmJpbmQodGhpcyl9PntsYWJsZX08L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VhcmNoTW92aWUnPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGUgPSd0ZXh0JyBpZD0nbW92aWVJbnB1dCcgXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcclxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuc2VhcmNofVxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nSW5zZXJ0IE1vdmllIFRpdGxlJ1xyXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcykoJ2NsaWNrZWQnKX0+c2VhcmNoPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHtyZXN1bHRzfVxyXG4gICAgICAgIDxNb3ZpZUxpc3QgbW92aWVzPXt0aGlzLnN0YXRlLm1vdmllc31cclxuICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuTXlSYXRpbmdzID0gTXlSYXRpbmdzOyJdfQ==