'use strict';

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var g = c[i]; g.enumerable = g.enumerable || !1; g.configurable = !0; if ("value" in g) g.writable = !0; Object.defineProperty(b, g.key, g); } } return function (b, c, g) { if (c) a(b.prototype, c); if (g) a(b, g); return b; }; }();

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
              e = !1,
              f = [];


          _this3.state.movies.forEach(function (g, h) {
            if (g.title.toLowerCase().indexOf(_this3.state.search.toLowerCase()) > 0) {
              f.push(g);
              e = !0;
            }
          });
          if (!e) {
            $("#movNotInColl").fadeIn(1000);
            $("#movNotInColl").fadeOut(1000);
          } else {
            d.setState({
              movies: f,
              allRatedMovies: !1
            });
          }
        })();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this,
          c,
          g;

      if (this.state.allRatedMovies === !1) {
        c = 'Back To All Rated Movies';
        g = this.state.movies.length === 0 ? React.createElement(
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
        g,
        React.createElement(MovieList, { movies: this.state.movies,
          change: this.props.change.bind(this)
        })
      );
    }
  }]);

  return b;
}(React.Component);

window.MyRatings = MyRatings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOlsiTXlSYXRpbmdzIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsImFsbFJhdGVkTW92aWVzIiwic2VhcmNoIiwiZ2V0QWxsUmF0ZWRNb3ZpZXMiLCJldmVudCIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCIkIiwiZ2V0IiwiVXJsIiwidGhlbiIsInVzZXJSYXRlZE1vdmllcyIsImNoYXJDb2RlIiwidGhhdCIsImZvdW5kIiwibW92aWVzVGhhdE1hdGNoIiwiZm9yRWFjaCIsImVsIiwiaWR4IiwidGl0bGUiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiLCJwdXNoIiwiZmFkZUluIiwiZmFkZU91dCIsImxhYmxlIiwicmVzdWx0cyIsImxlbmd0aCIsImJpbmQiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVTZWFyY2giLCJkaXNwbGF5IiwiY29sb3IiLCJjaGFuZ2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxTOzs7QUFDSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBR2pCLE1BQUtDLEtBQUwsR0FBYTtBQUNYQyxjQUFRLEVBREc7QUFFWEMsd0JBRlc7QUFHWEMsY0FBUTtBQUhHLEtBQWI7QUFIaUI7QUFRbEI7O0FBRUQ7Ozs7O3dDQUNvQjtBQUNsQixXQUFLQyxpQkFBTDtBQUNEOzs7aUNBRVlDLEMsRUFBTztBQUNsQixXQUFLQyxRQUFMLENBQWM7QUFDWkgsZ0JBQVFFLEVBQU1FLE1BQU4sQ0FBYUM7QUFEVCxPQUFkO0FBR0Q7Ozt3Q0FHbUI7QUFBQTs7QUFFbEJDLFFBQUVDLEdBQUYsQ0FBTUMsTUFBTSxpQkFBWixFQUNDQyxJQURELENBQ00sYUFBbUI7QUFFdkIsZUFBS04sUUFBTCxDQUFjO0FBQ1pMLGtCQUFRWSxDQURJO0FBRVpYO0FBRlks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WCxDQUFrQkwsSUFBbEIsQ0FBdUIsSUFBdkI7QUFEUjtBQWJGLE9BREY7QUFtQkQ7Ozs7RUF2R3FCTSxNQUFNQyxTOztBQTBHOUJDLE9BQU94QyxTQUFQLEdBQW1CQSxTQUFuQiIsImZpbGUiOiJNeVJhdGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNeVJhdGluZ3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgbW92aWVzOiBbXSxcclxuICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWUsXHJcbiAgICAgIHNlYXJjaDogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvL3Nob3cgcmVuZGVyIGEgbGlzdCBvZiByZWNlbnQgcmVsZWFzZXMgb24gaW5pdGlhbGl6ZVxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5nZXRBbGxSYXRlZE1vdmllcygpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgc2VhcmNoOiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGdldEFsbFJhdGVkTW92aWVzKCkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5tb3ZpZXMpO1xyXG4gICAgJC5nZXQoVXJsICsgJy9nZXRVc2VyUmF0aW5ncycpXHJcbiAgICAudGhlbih1c2VyUmF0ZWRNb3ZpZXMgPT4ge1xyXG4gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgdXNlclJhdGVkTW92aWVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbW92aWVzOiB1c2VyUmF0ZWRNb3ZpZXMsXHJcbiAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWVcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xyXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnNlYXJjaCx0aGlzLnN0YXRlLm1vdmllcyk7XHJcbiAgICBpZiAoZXZlbnQuY2hhckNvZGUgPT0gMTMgfHwgZXZlbnQgPT09ICdjbGlja2VkJykge1xyXG4gICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgbGV0IGZvdW5kPWZhbHNlO1xyXG4gICAgICBjb25zdCBtb3ZpZXNUaGF0TWF0Y2g9W11cclxuXHJcbiAgICAgIHRoaXMuc3RhdGUubW92aWVzLmZvckVhY2goKGVsLGlkeCk9PntcclxuICAgICAgICBjb25zb2xlLmxvZyhlbCk7XHJcbiAgICAgICAgaWYgKGVsLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnN0YXRlLnNlYXJjaC50b0xvd2VyQ2FzZSgpKT4wKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuc2VhcmNoKTtcclxuICAgICAgICAgIG1vdmllc1RoYXRNYXRjaC5wdXNoKGVsKTtcclxuICAgICAgICAgIGZvdW5kPXRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgICBpZiAoIWZvdW5kKXtcclxuICAgICAgICAgICQoXCIjbW92Tm90SW5Db2xsXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgICAgICQoXCIjbW92Tm90SW5Db2xsXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdzaG91bGQgbm93IHNob3cgdGhlbSBtZXNzYWdlIHRoYXQgdGhlcmUgaXMgbm8gc3VjaCBtb3ZpZScpO1xyXG4gICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICAgICAgbW92aWVzOiBtb3ZpZXNUaGF0TWF0Y2gsXHJcbiAgICAgICAgICAgIGFsbFJhdGVkTW92aWVzOiBmYWxzZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICB9ICAgIFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgXHJcblxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICB2YXIgbGFibGU7XHJcbiAgICB2YXIgcmVzdWx0cztcclxuICAgIGlmICh0aGlzLnN0YXRlLmFsbFJhdGVkTW92aWVzID09PSBmYWxzZSkge1xyXG4gICAgICBsYWJsZSA9ICdCYWNrIFRvIEFsbCBSYXRlZCBNb3ZpZXMnO1xyXG4gICAgICByZXN1bHRzID0gKHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkgPyAoPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPlJlc3VsdHMgY2Fubm90IGJlIGZvdW5kPC9kaXY+KSA6ICg8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPkFsbCBtYXRjaCByZXN1bHRzOjwvZGl2PilcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5hbGxSYXRlZE1vdmllcyAmJiB0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgbGFibGUgPSAnWW91IGhhdmUgbm90IHJhdGVkIGFueSBtb3ZpZXMnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGFibGUgPSAnQWxsIFJhdGVkIE1vdmllcyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9J015UmF0aW5ncyBjb2xsZWN0aW9uJz4gXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2hlYWRlcicgb25DbGljaz17dGhpcy5nZXRBbGxSYXRlZE1vdmllcy5iaW5kKHRoaXMpfT57bGFibGV9PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlYXJjaE1vdmllJz5cclxuICAgICAgICAgIDxpbnB1dCB0eXBlID0ndGV4dCcgaWQ9J21vdmllSW5wdXQnIFxyXG4gICAgICAgICAgICBjbGFzc05hbWU9J21vdmllSW5wdXQnXHJcbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnNlYXJjaH1cclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0luc2VydCBNb3ZpZSBUaXRsZSdcclxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpKCdjbGlja2VkJyl9PnNlYXJjaDwvYT5cclxuICAgICAgICAgIDxoNSBpZD1cIm1vdk5vdEluQ29sbFwiIHN0eWxlPXt7ZGlzcGxheTogJ25vbmUnLCBjb2xvcjpcInJlZFwifX0+e3RoaXMuc3RhdGUuc2VhcmNofSBpc24ndCBpbiB5b3VyIGNvbGxlY3Rpb248L2g1PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHtyZXN1bHRzfVxyXG4gICAgICAgIDxNb3ZpZUxpc3QgbW92aWVzPXt0aGlzLnN0YXRlLm1vdmllc31cclxuICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuTXlSYXRpbmdzID0gTXlSYXRpbmdzOyJdfQ==