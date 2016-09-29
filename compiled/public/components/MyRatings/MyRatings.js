'use strict';

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var f = c[i]; f.enumerable = f.enumerable || !1; f.configurable = !0; if ("value" in f) f.writable = !0; Object.defineProperty(b, f.key, f); } } return function (b, c, f) { if (c) a(b.prototype, c); if (f) a(b, f); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var MyRatings = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      movies: [],
      allRatedMovies: !0,
      search: ''
    };
    return d;
  }

  //show render a list of recent releases on initialize


  _createClass(b, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getAllRatedMovies();
    }
  }, {
    key: 'handleChange',
    value: function handleChange(c) {
      this.setState({
        search: c.target.value
      });
    }
  }, {
    key: 'getAllRatedMovies',
    value: function getAllRatedMovies() {
      var _this2 = this;

      $.get(Url + '/getUserRatings').then(function (c) {
        _this2.setState({
          movies: c,
          allRatedMovies: !0
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
    value: function handleSearch(c) {
      var _this3 = this;

      if (c.charCode == 13 || c === 'clicked') {
        (function () {
          var d = _this3,
              e = !1;


          _this3.state.movies.forEach(function (f, g) {
            if (f.title === _this3.state.search) {
              d.setState({
                movies: [f],
                allRatedMovies: !1
              });
              e = !0;
            }
          });
          if (!e) {
            $("#movNotInColl").fadeIn(1000);
            $("#movNotInColl").fadeOut(1000);
          }
        })();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this,
          c,
          f;

      if (this.state.allRatedMovies === !1) {
        c = 'Back To All Rated Movies';
        f = this.state.movies.length === 0 ? React.createElement(
          'div',
          { className: 'errorMsg' },
          'Results cannot be found'
        ) : React.createElement(
          'div',
          { className: 'updateMsg' },
          'All match results:'
        );
      } else if (this.state.allRatedMovies && this.state.movies.length === 0) {
        c = 'You have not rated any movies';
      } else {
        c = 'All Rated Movies';
      }

      return React.createElement(
        'div',
        { className: 'MyRatings collection' },
        React.createElement(
          'div',
          { className: 'header', onClick: this.getAllRatedMovies.bind(this) },
          c
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
        f,
        React.createElement(MovieList, { movies: this.state.movies,
          change: this.props.change.bind(this)
        })
      );
    }
  }]);

  return b;
}(React.Component);

window.MyRatings = MyRatings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOlsiTXlSYXRpbmdzIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsImFsbFJhdGVkTW92aWVzIiwic2VhcmNoIiwiZ2V0QWxsUmF0ZWRNb3ZpZXMiLCJldmVudCIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCIkIiwiZ2V0IiwiVXJsIiwidGhlbiIsInVzZXJSYXRlZE1vdmllcyIsImNoYXJDb2RlIiwidGhhdCIsImZvdW5kIiwiZm9yRWFjaCIsImVsIiwiaWR4IiwidGl0bGUiLCJmYWRlSW4iLCJmYWRlT3V0IiwibGFibGUiLCJyZXN1bHRzIiwibGVuZ3RoIiwiYmluZCIsImhhbmRsZUNoYW5nZSIsImhhbmRsZVNlYXJjaCIsImRpc3BsYXkiLCJjb2xvciIsImNoYW5nZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLFM7OztBQUNKLGFBQVlDLENBQVosRUFBbUI7QUFBQTs7QUFBQSxrR0FDWEEsQ0FEVzs7QUFHakIsTUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGNBQVEsRUFERztBQUVYQyx3QkFGVztBQUdYQyxjQUFRO0FBSEcsS0FBYjtBQUhpQjtBQVFsQjs7QUFFRDs7Ozs7d0NBQ29CO0FBQ2xCLFdBQUtDLGlCQUFMO0FBQ0Q7OztpQ0FFWUMsQyxFQUFPO0FBQ2xCLFdBQUtDLFFBQUwsQ0FBYztBQUNaSCxnQkFBUUUsRUFBTUUsTUFBTixDQUFhQztBQURULE9BQWQ7QUFHRDs7O3dDQUdtQjtBQUFBOztBQUVsQkMsUUFBRUMsR0FBRixDQUFNQyxNQUFNLGlCQUFaLEVBQ0NDLElBREQsQ0FDTSxhQUFtQjtBQUV2QixlQUFLTixRQUFMLENBQWM7QUFDWkwsa0JBQVFZLENBREk7QUFFWlg7QUFGWSxTQUFkO0FBSUQsT0FQRDtBQVNEOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7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ZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgbW92aWVzOiBbXSxcclxuICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWUsXHJcbiAgICAgIHNlYXJjaDogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvL3Nob3cgcmVuZGVyIGEgbGlzdCBvZiByZWNlbnQgcmVsZWFzZXMgb24gaW5pdGlhbGl6ZVxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5nZXRBbGxSYXRlZE1vdmllcygpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgc2VhcmNoOiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGdldEFsbFJhdGVkTW92aWVzKCkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5tb3ZpZXMpO1xyXG4gICAgJC5nZXQoVXJsICsgJy9nZXRVc2VyUmF0aW5ncycpXHJcbiAgICAudGhlbih1c2VyUmF0ZWRNb3ZpZXMgPT4ge1xyXG4gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgdXNlclJhdGVkTW92aWVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbW92aWVzOiB1c2VyUmF0ZWRNb3ZpZXMsXHJcbiAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWVcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xyXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnNlYXJjaCx0aGlzLnN0YXRlLm1vdmllcyk7XHJcbiAgICBpZiAoZXZlbnQuY2hhckNvZGUgPT0gMTMgfHwgZXZlbnQgPT09ICdjbGlja2VkJykge1xyXG4gICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgbGV0IGZvdW5kPWZhbHNlO1xyXG5cclxuICAgICAgdGhpcy5zdGF0ZS5tb3ZpZXMuZm9yRWFjaCgoZWwsaWR4KT0+e1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVsKTtcclxuICAgICAgICBpZiAoZWwudGl0bGU9PT10aGlzLnN0YXRlLnNlYXJjaCl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnNlYXJjaCk7XHJcbiAgICAgICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbW92aWVzOiBbZWxdLFxyXG4gICAgICAgICAgICBhbGxSYXRlZE1vdmllczogZmFsc2VcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgZm91bmQ9dHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAgIGlmICghZm91bmQpe1xyXG4gICAgICAgICAgJChcIiNtb3ZOb3RJbkNvbGxcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICAgJChcIiNtb3ZOb3RJbkNvbGxcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICAgY29uc29sZS5sb2coJ3Nob3VsZCBub3cgc2hvdyB0aGVtIG1lc3NhZ2UgdGhhdCB0aGVyZSBpcyBubyBzdWNoIG1vdmllJyk7XHJcbiAgICAgICB9ICAgIFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgXHJcblxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICB2YXIgbGFibGU7XHJcbiAgICB2YXIgcmVzdWx0cztcclxuICAgIGlmICh0aGlzLnN0YXRlLmFsbFJhdGVkTW92aWVzID09PSBmYWxzZSkge1xyXG4gICAgICBsYWJsZSA9ICdCYWNrIFRvIEFsbCBSYXRlZCBNb3ZpZXMnO1xyXG4gICAgICByZXN1bHRzID0gKHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkgPyAoPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPlJlc3VsdHMgY2Fubm90IGJlIGZvdW5kPC9kaXY+KSA6ICg8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPkFsbCBtYXRjaCByZXN1bHRzOjwvZGl2PilcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5hbGxSYXRlZE1vdmllcyAmJiB0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgbGFibGUgPSAnWW91IGhhdmUgbm90IHJhdGVkIGFueSBtb3ZpZXMnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGFibGUgPSAnQWxsIFJhdGVkIE1vdmllcyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9J015UmF0aW5ncyBjb2xsZWN0aW9uJz4gXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2hlYWRlcicgb25DbGljaz17dGhpcy5nZXRBbGxSYXRlZE1vdmllcy5iaW5kKHRoaXMpfT57bGFibGV9PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlYXJjaE1vdmllJz5cclxuICAgICAgICAgIDxpbnB1dCB0eXBlID0ndGV4dCcgaWQ9J21vdmllSW5wdXQnIFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9J21vdmllSW5wdXQnXHJcbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnNlYXJjaH1cclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0luc2VydCBNb3ZpZSBUaXRsZSdcclxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpKCdjbGlja2VkJyl9PnNlYXJjaDwvYT5cclxuICAgICAgICAgIDxoNSBpZD1cIm1vdk5vdEluQ29sbFwiIHN0eWxlPXt7ZGlzcGxheTogJ25vbmUnLCBjb2xvcjpcInJlZFwifX0+e3RoaXMuc3RhdGUuc2VhcmNofSBpc24ndCBpbiB5b3VyIGNvbGxlY3Rpb248L2g1PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHtyZXN1bHRzfVxyXG4gICAgICAgIDxNb3ZpZUxpc3QgbW92aWVzPXt0aGlzLnN0YXRlLm1vdmllc31cclxuICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuTXlSYXRpbmdzID0gTXlSYXRpbmdzOyJdfQ==