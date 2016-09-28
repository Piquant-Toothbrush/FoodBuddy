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
      console.log(this.state.search, this.state.movies);
      if (event.charCode == 13 || event === 'clicked') {
        var that = this;
        for (var i = 0; i < this.state.movies.length; i++) {
          console.log(this.state.movies[i]);
          if (this.state.search === this.state.movies[i].title) {
            console.log(this.state.search.title);
            that.setState({
              movies: searchResults,
              allRatedMovies: false
            });
          }
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

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
                return _this3.handleSearch.bind(_this3)('clicked');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOlsiTXlSYXRpbmdzIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsImFsbFJhdGVkTW92aWVzIiwic2VhcmNoIiwiZ2V0QWxsUmF0ZWRNb3ZpZXMiLCJldmVudCIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCJjb25zb2xlIiwibG9nIiwiJCIsImdldCIsIlVybCIsInRoZW4iLCJ1c2VyUmF0ZWRNb3ZpZXMiLCJjaGFyQ29kZSIsInRoYXQiLCJpIiwibGVuZ3RoIiwidGl0bGUiLCJzZWFyY2hSZXN1bHRzIiwibGFibGUiLCJyZXN1bHRzIiwiYmluZCIsImhhbmRsZUNoYW5nZSIsImhhbmRsZVNlYXJjaCIsImNoYW5nZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLFM7OztBQUNKLHFCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsc0hBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxjQUFRLEVBREc7QUFFWEMsc0JBQWdCLElBRkw7QUFHWEMsY0FBUTtBQUhHLEtBQWI7QUFIaUI7QUFRbEI7O0FBRUQ7Ozs7O3dDQUNvQjtBQUNsQixXQUFLQyxpQkFBTDtBQUNEOzs7aUNBRVlDLEssRUFBTztBQUNsQixXQUFLQyxRQUFMLENBQWM7QUFDWkgsZ0JBQVFFLE1BQU1FLE1BQU4sQ0FBYUM7QUFEVCxPQUFkO0FBR0Q7Ozt3Q0FHbUI7QUFBQTs7QUFDbEJDLGNBQVFDLEdBQVIsQ0FBWSxLQUFLVixLQUFMLENBQVdDLE1BQXZCO0FBQ0FVLFFBQUVDLEdBQUYsQ0FBTUMsTUFBTSxpQkFBWixFQUNDQyxJQURELENBQ00sMkJBQW1CO0FBQ3RCTCxnQkFBUUMsR0FBUixDQUFZLHNCQUFaLEVBQW9DSyxlQUFwQztBQUNELGVBQUtULFFBQUwsQ0FBYztBQUNaTCxrQkFBUWMs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cyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE15UmF0aW5ncyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBtb3ZpZXM6IFtdLFxyXG4gICAgICBhbGxSYXRlZE1vdmllczogdHJ1ZSxcclxuICAgICAgc2VhcmNoOiAnJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vc2hvdyByZW5kZXIgYSBsaXN0IG9mIHJlY2VudCByZWxlYXNlcyBvbiBpbml0aWFsaXplXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICB0aGlzLmdldEFsbFJhdGVkTW92aWVzKCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBzZWFyY2g6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0QWxsUmF0ZWRNb3ZpZXMoKSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLm1vdmllcyk7XHJcbiAgICAkLmdldChVcmwgKyAnL2dldFVzZXJSYXRpbmdzJylcclxuICAgIC50aGVuKHVzZXJSYXRlZE1vdmllcyA9PiB7XHJcbiAgICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCB1c2VyUmF0ZWRNb3ZpZXMpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBtb3ZpZXM6IHVzZXJSYXRlZE1vdmllcyxcclxuICAgICAgICBhbGxSYXRlZE1vdmllczogdHJ1ZVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgICBcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL0V2ZW50IEhhbmRsZXJzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAvL3RoaXMgd2lsbCBjYWxsIHNlYXJjaCBmb3IgYSBtb3ZpZSBmcm9tIGV4dGVybmFsIEFQSSwgZG8gYSBkYXRhYmFzZSBxdWVyeSBmb3IgcmF0aW5nXHJcbiAgLy9hbmQgc2V0IHRoZSByZXBvbnNlIHRvIHRoZSBtb3ZpZXMgc3RhdGVcclxuICBoYW5kbGVTZWFyY2goZXZlbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuc2VhcmNoLHRoaXMuc3RhdGUubW92aWVzKTtcclxuICAgIGlmIChldmVudC5jaGFyQ29kZSA9PSAxMyB8fCBldmVudCA9PT0gJ2NsaWNrZWQnKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUubW92aWVzW2ldKTtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5zZWFyY2ggPT09IHRoaXMuc3RhdGUubW92aWVzW2ldLnRpdGxlKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnNlYXJjaC50aXRsZSk7XHJcbiAgICAgICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbW92aWVzOiBzZWFyY2hSZXN1bHRzLFxyXG4gICAgICAgICAgICBhbGxSYXRlZE1vdmllczogZmFsc2VcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHZhciBsYWJsZTtcclxuICAgIHZhciByZXN1bHRzO1xyXG4gICAgaWYgKHRoaXMuc3RhdGUuYWxsUmF0ZWRNb3ZpZXMgPT09IGZhbHNlKSB7XHJcbiAgICAgIGxhYmxlID0gJ0JhY2sgVG8gQWxsIFJhdGVkIE1vdmllcyc7XHJcbiAgICAgIHJlc3VsdHMgPSAodGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSA/ICg8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+UmVzdWx0cyBjYW5ub3QgYmUgZm91bmQ8L2Rpdj4pIDogKDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlTXNnXCI+QWxsIG1hdGNoIHJlc3VsdHM6PC9kaXY+KVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmFsbFJhdGVkTW92aWVzICYmIHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBsYWJsZSA9ICdZb3UgaGF2ZSBub3QgcmF0ZWQgYW55IG1vdmllcyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsYWJsZSA9ICdBbGwgUmF0ZWQgTW92aWVzJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nTXlSYXRpbmdzIGNvbGxlY3Rpb24nPiBcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJyBvbkNsaWNrPXt0aGlzLmdldEFsbFJhdGVkTW92aWVzLmJpbmQodGhpcyl9PntsYWJsZX08L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VhcmNoTW92aWUnPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGUgPSd0ZXh0JyBpZD0nbW92aWVJbnB1dCcgXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcclxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuc2VhcmNofVxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nSW5zZXJ0IE1vdmllIFRpdGxlJ1xyXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcykoJ2NsaWNrZWQnKX0+c2VhcmNoPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHtyZXN1bHRzfVxyXG4gICAgICAgIDxNb3ZpZUxpc3QgbW92aWVzPXt0aGlzLnN0YXRlLm1vdmllc31cclxuICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuTXlSYXRpbmdzID0gTXlSYXRpbmdzOyJdfQ==