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
            console.log(el);
            if (el.title === _this3.state.search) {
              console.log(_this3.state.search);
              that.setState({
                movies: [el],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOlsiTXlSYXRpbmdzIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsImFsbFJhdGVkTW92aWVzIiwic2VhcmNoIiwiZ2V0QWxsUmF0ZWRNb3ZpZXMiLCJldmVudCIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCJjb25zb2xlIiwibG9nIiwiJCIsImdldCIsIlVybCIsInRoZW4iLCJ1c2VyUmF0ZWRNb3ZpZXMiLCJjaGFyQ29kZSIsInRoYXQiLCJmb3VuZCIsImZvckVhY2giLCJlbCIsImlkeCIsInRpdGxlIiwibGFibGUiLCJyZXN1bHRzIiwibGVuZ3RoIiwiYmluZCIsImhhbmRsZUNoYW5nZSIsImhhbmRsZVNlYXJjaCIsImNoYW5nZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLFM7OztBQUNKLHFCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsc0hBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxjQUFRLEVBREc7QUFFWEMsc0JBQWdCLElBRkw7QUFHWEMsY0FBUTtBQUhHLEtBQWI7QUFIaUI7QUFRbEI7O0FBRUQ7Ozs7O3dDQUNvQjtBQUNsQixXQUFLQyxpQkFBTDtBQUNEOzs7aUNBRVlDLEssRUFBTztBQUNsQixXQUFLQyxRQUFMLENBQWM7QUFDWkgsZ0JBQVFFLE1BQU1FLE1BQU4sQ0FBYUM7QUFEVCxPQUFkO0FBR0Q7Ozt3Q0FHbUI7QUFBQTs7QUFDbEJDLGNBQVFDLEdBQVIsQ0FBWSxLQUFLVixLQUFMLENBQVdDLE1BQXZCO0FBQ0FVLFFBQUVDLEdBQUYsQ0FBTUMsTUFBTSxpQkFBWixFQUNDQyxJQURELENBQ00sMkJBQW1CO0FBQ3RCTCxnQkFBUUMsR0FBUixDQUFZLHNCQUFaLEVBQW9DSyxlQUFwQztBQUNELGVBQUtULFFBQUwsQ0FBYztBQUNa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QVAsR0FBbUJBLFNBQW5CIiwiZmlsZSI6Ik15UmF0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE15UmF0aW5ncyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBtb3ZpZXM6IFtdLFxyXG4gICAgICBhbGxSYXRlZE1vdmllczogdHJ1ZSxcclxuICAgICAgc2VhcmNoOiAnJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vc2hvdyByZW5kZXIgYSBsaXN0IG9mIHJlY2VudCByZWxlYXNlcyBvbiBpbml0aWFsaXplXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICB0aGlzLmdldEFsbFJhdGVkTW92aWVzKCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBzZWFyY2g6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0QWxsUmF0ZWRNb3ZpZXMoKSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLm1vdmllcyk7XHJcbiAgICAkLmdldChVcmwgKyAnL2dldFVzZXJSYXRpbmdzJylcclxuICAgIC50aGVuKHVzZXJSYXRlZE1vdmllcyA9PiB7XHJcbiAgICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCB1c2VyUmF0ZWRNb3ZpZXMpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBtb3ZpZXM6IHVzZXJSYXRlZE1vdmllcyxcclxuICAgICAgICBhbGxSYXRlZE1vdmllczogdHJ1ZVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgICBcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL0V2ZW50IEhhbmRsZXJzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAvL3RoaXMgd2lsbCBjYWxsIHNlYXJjaCBmb3IgYSBtb3ZpZSBmcm9tIGV4dGVybmFsIEFQSSwgZG8gYSBkYXRhYmFzZSBxdWVyeSBmb3IgcmF0aW5nXHJcbiAgLy9hbmQgc2V0IHRoZSByZXBvbnNlIHRvIHRoZSBtb3ZpZXMgc3RhdGVcclxuICBoYW5kbGVTZWFyY2goZXZlbnQpIHtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuc2VhcmNoLHRoaXMuc3RhdGUubW92aWVzKTtcclxuICAgIGlmIChldmVudC5jaGFyQ29kZSA9PSAxMyB8fCBldmVudCA9PT0gJ2NsaWNrZWQnKSB7XHJcbiAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgICBsZXQgZm91bmQ9ZmFsc2U7XHJcblxyXG4gICAgICB0aGlzLnN0YXRlLm1vdmllcy5mb3JFYWNoKChlbCxpZHgpPT57XHJcbiAgICAgICAgY29uc29sZS5sb2coZWwpO1xyXG4gICAgICAgIGlmIChlbC50aXRsZT09PXRoaXMuc3RhdGUuc2VhcmNoKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuc2VhcmNoKTtcclxuICAgICAgICAgIHRoYXQuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBtb3ZpZXM6IFtlbF0sXHJcbiAgICAgICAgICAgIGFsbFJhdGVkTW92aWVzOiBmYWxzZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBmb3VuZD10cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCFmb3VuZCl7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdzaG91bGQgbm93IHNob3cgdGhlbSBtZXNzYWdlIHRoYXQgdGhlcmUgaXMgbm8gc3VjaCBtb3ZpZScpO1xyXG4gICAgICAgfSAgICBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIFxyXG5cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgdmFyIGxhYmxlO1xyXG4gICAgdmFyIHJlc3VsdHM7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5hbGxSYXRlZE1vdmllcyA9PT0gZmFsc2UpIHtcclxuICAgICAgbGFibGUgPSAnQmFjayBUbyBBbGwgUmF0ZWQgTW92aWVzJztcclxuICAgICAgcmVzdWx0cyA9ICh0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApID8gKDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj5SZXN1bHRzIGNhbm5vdCBiZSBmb3VuZDwvZGl2PikgOiAoPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj5BbGwgbWF0Y2ggcmVzdWx0czo8L2Rpdj4pXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuYWxsUmF0ZWRNb3ZpZXMgJiYgdGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGxhYmxlID0gJ1lvdSBoYXZlIG5vdCByYXRlZCBhbnkgbW92aWVzJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxhYmxlID0gJ0FsbCBSYXRlZCBNb3ZpZXMnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdNeVJhdGluZ3MgY29sbGVjdGlvbic+IFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInIG9uQ2xpY2s9e3RoaXMuZ2V0QWxsUmF0ZWRNb3ZpZXMuYmluZCh0aGlzKX0+e2xhYmxlfTwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWFyY2hNb3ZpZSc+XHJcbiAgICAgICAgICA8aW5wdXQgdHlwZSA9J3RleHQnIGlkPSdtb3ZpZUlucHV0JyBcclxuICAgICAgICAgICAgY2xhc3NOYW1lPSdtb3ZpZUlucHV0J1xyXG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5zZWFyY2h9XHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdJbnNlcnQgTW92aWUgVGl0bGUnXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gdGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKSgnY2xpY2tlZCcpfT5zZWFyY2g8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAge3Jlc3VsdHN9XHJcbiAgICAgICAgPE1vdmllTGlzdCBtb3ZpZXM9e3RoaXMuc3RhdGUubW92aWVzfVxyXG4gICAgICAgIGNoYW5nZT17dGhpcy5wcm9wcy5jaGFuZ2UuYmluZCh0aGlzKX1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIClcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5NeVJhdGluZ3MgPSBNeVJhdGluZ3M7Il19