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
            $("#movNotInColl").fadeIn(1000);
            $("#movNotInColl").fadeOut(1000);
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
          ),
          React.createElement(
            'h5',
            { id: 'movNotInColl', style: { display: 'none', color: "red" } },
            this.state.search,
            ' isn\'t in your collection'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOlsiTXlSYXRpbmdzIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsImFsbFJhdGVkTW92aWVzIiwic2VhcmNoIiwiZ2V0QWxsUmF0ZWRNb3ZpZXMiLCJldmVudCIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCJjb25zb2xlIiwibG9nIiwiJCIsImdldCIsIlVybCIsInRoZW4iLCJ1c2VyUmF0ZWRNb3ZpZXMiLCJjaGFyQ29kZSIsInRoYXQiLCJmb3VuZCIsImZvckVhY2giLCJlbCIsImlkeCIsInRpdGxlIiwiZmFkZUluIiwiZmFkZU91dCIsImxhYmxlIiwicmVzdWx0cyIsImxlbmd0aCIsImJpbmQiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVTZWFyY2giLCJkaXNwbGF5IiwiY29sb3IiLCJjaGFuZ2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxTOzs7QUFDSixxQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLHNIQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsY0FBUSxFQURHO0FBRVhDLHNCQUFnQixJQUZMO0FBR1hDLGNBQVE7QUFIRyxLQUFiO0FBSGlCO0FBUWxCOztBQUVEOzs7Ozt3Q0FDb0I7QUFDbEIsV0FBS0MsaUJBQUw7QUFDRDs7O2lDQUVZQyxLLEVBQU87QUFDbEIsV0FBS0MsUUFBTCxDQUFjO0FBQ1pILGdCQUFRRSxNQUFNRSxNQUFOLENBQWFDO0FBRFQsT0FBZDtBQUdEOzs7d0NBR21CO0FBQUE7O0FBQ2xCQyxjQUFRQyxHQUFSLENBQVksS0FBS1YsS0FBTCxDQUFXQyxNQUF2QjtBQUNBVSxRQUFFQyxHQUFGLENBQU1DLE1BQU0saUJBQVosRUFDQ0MsSUFERCxDQUNNLDJCQUFtQjtBQUN0QkwsZ0JBQVFDLEdBQVIsQ0FBWSxzQkFBWixF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T0FBTSxLQUF4QixFQUE3QjtBQUE4RCxpQkFBS2hDLEtBQUwsQ0FBV0csTUFBekU7QUFBQTtBQUFBO0FBUkYsU0FGRjtBQVlHdUIsZUFaSDtBQWFFLDRCQUFDLFNBQUQsSUFBVyxRQUFRLEtBQUsxQixLQUFMLENBQVdDLE1BQTlCO0FBQ0Esa0JBQVEsS0FBS0YsS0FBTCxDQUFXa0MsTUFBWCxDQUFrQkwsSUFBbEIsQ0FBdUIsSUFBdkI7QUFEUjtBQWJGLE9BREY7QUFtQkQ7Ozs7RUFwR3FCTSxNQUFNQyxTOztBQXVHOUJDLE9BQU90QyxTQUFQLEdBQW1CQSxTQUFuQiIsImZpbGUiOiJNeVJhdGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNeVJhdGluZ3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgbW92aWVzOiBbXSxcclxuICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWUsXHJcbiAgICAgIHNlYXJjaDogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvL3Nob3cgcmVuZGVyIGEgbGlzdCBvZiByZWNlbnQgcmVsZWFzZXMgb24gaW5pdGlhbGl6ZVxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5nZXRBbGxSYXRlZE1vdmllcygpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgc2VhcmNoOiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGdldEFsbFJhdGVkTW92aWVzKCkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5tb3ZpZXMpO1xyXG4gICAgJC5nZXQoVXJsICsgJy9nZXRVc2VyUmF0aW5ncycpXHJcbiAgICAudGhlbih1c2VyUmF0ZWRNb3ZpZXMgPT4ge1xyXG4gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgdXNlclJhdGVkTW92aWVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbW92aWVzOiB1c2VyUmF0ZWRNb3ZpZXMsXHJcbiAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWVcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xyXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnNlYXJjaCx0aGlzLnN0YXRlLm1vdmllcyk7XHJcbiAgICBpZiAoZXZlbnQuY2hhckNvZGUgPT0gMTMgfHwgZXZlbnQgPT09ICdjbGlja2VkJykge1xyXG4gICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgbGV0IGZvdW5kPWZhbHNlO1xyXG5cclxuICAgICAgdGhpcy5zdGF0ZS5tb3ZpZXMuZm9yRWFjaCgoZWwsaWR4KT0+e1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVsKTtcclxuICAgICAgICBpZiAoZWwudGl0bGU9PT10aGlzLnN0YXRlLnNlYXJjaCl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnNlYXJjaCk7XHJcbiAgICAgICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbW92aWVzOiBbZWxdLFxyXG4gICAgICAgICAgICBhbGxSYXRlZE1vdmllczogZmFsc2VcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgZm91bmQ9dHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAgIGlmICghZm91bmQpe1xyXG4gICAgICAgICAgJChcIiNtb3ZOb3RJbkNvbGxcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICAgJChcIiNtb3ZOb3RJbkNvbGxcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICAgY29uc29sZS5sb2coJ3Nob3VsZCBub3cgc2hvdyB0aGVtIG1lc3NhZ2UgdGhhdCB0aGVyZSBpcyBubyBzdWNoIG1vdmllJyk7XHJcbiAgICAgICB9ICAgIFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgXHJcblxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICB2YXIgbGFibGU7XHJcbiAgICB2YXIgcmVzdWx0cztcclxuICAgIGlmICh0aGlzLnN0YXRlLmFsbFJhdGVkTW92aWVzID09PSBmYWxzZSkge1xyXG4gICAgICBsYWJsZSA9ICdCYWNrIFRvIEFsbCBSYXRlZCBNb3ZpZXMnO1xyXG4gICAgICByZXN1bHRzID0gKHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkgPyAoPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPlJlc3VsdHMgY2Fubm90IGJlIGZvdW5kPC9kaXY+KSA6ICg8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPkFsbCBtYXRjaCByZXN1bHRzOjwvZGl2PilcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5hbGxSYXRlZE1vdmllcyAmJiB0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgbGFibGUgPSAnWW91IGhhdmUgbm90IHJhdGVkIGFueSBtb3ZpZXMnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGFibGUgPSAnQWxsIFJhdGVkIE1vdmllcyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9J015UmF0aW5ncyBjb2xsZWN0aW9uJz4gXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2hlYWRlcicgb25DbGljaz17dGhpcy5nZXRBbGxSYXRlZE1vdmllcy5iaW5kKHRoaXMpfT57bGFibGV9PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlYXJjaE1vdmllJz5cclxuICAgICAgICAgIDxpbnB1dCB0eXBlID0ndGV4dCcgaWQ9J21vdmllSW5wdXQnIFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9J21vdmllSW5wdXQnXHJcbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnNlYXJjaH1cclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0luc2VydCBNb3ZpZSBUaXRsZSdcclxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpKCdjbGlja2VkJyl9PnNlYXJjaDwvYT5cclxuICAgICAgICAgIDxoNSBpZD1cIm1vdk5vdEluQ29sbFwiIHN0eWxlPXt7ZGlzcGxheTogJ25vbmUnLCBjb2xvcjpcInJlZFwifX0+e3RoaXMuc3RhdGUuc2VhcmNofSBpc24ndCBpbiB5b3VyIGNvbGxlY3Rpb248L2g1PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHtyZXN1bHRzfVxyXG4gICAgICAgIDxNb3ZpZUxpc3QgbW92aWVzPXt0aGlzLnN0YXRlLm1vdmllc31cclxuICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuTXlSYXRpbmdzID0gTXlSYXRpbmdzOyJdfQ==