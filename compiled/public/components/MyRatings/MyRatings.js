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
            if (g.title.toLowerCase().indexOf(_this3.state.search.toLowerCase()) > -1) {
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
          'h5',
          { className: 'updateMsg' },
          'All matching results'
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
            ' doesn\'t match anything in your collection'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOlsiTXlSYXRpbmdzIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsImFsbFJhdGVkTW92aWVzIiwic2VhcmNoIiwiZ2V0QWxsUmF0ZWRNb3ZpZXMiLCJldmVudCIsInNldFN0YXRlIiwidGFyZ2V0IiwidmFsdWUiLCIkIiwiZ2V0IiwiVXJsIiwidGhlbiIsInVzZXJSYXRlZE1vdmllcyIsImNoYXJDb2RlIiwidGhhdCIsImZvdW5kIiwibW92aWVzVGhhdE1hdGNoIiwiZm9yRWFjaCIsImVsIiwiaWR4IiwidGl0bGUiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiLCJwdXNoIiwiZmFkZUluIiwiZmFkZU91dCIsImxhYmxlIiwicmVzdWx0cyIsImxlbmd0aCIsImJpbmQiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVTZWFyY2giLCJkaXNwbGF5IiwiY29sb3IiLCJjaGFuZ2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxTOzs7QUFDSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBR2pCLE1BQUtDLEtBQUwsR0FBYTtBQUNYQyxjQUFRLEVBREc7QUFFWEMsd0JBRlc7QUFHWEMsY0FBUTtBQUhHLEtBQWI7QUFIaUI7QUFRbEI7O0FBRUQ7Ozs7O3dDQUNvQjtBQUNsQixXQUFLQyxpQkFBTDtBQUNEOzs7aUNBRVlDLEMsRUFBTztBQUNsQixXQUFLQyxRQUFMLENBQWM7QUFDWkgsZ0JBQVFFLEVBQU1FLE1BQU4sQ0FBYUM7QUFEVCxPQUFkO0FBR0Q7Ozt3Q0FHbUI7QUFBQTs7QUFFbEJDLFFBQUVDLEdBQUYsQ0FBTUMsTUFBTSxpQkFBWixFQUNDQyxJQURELENBQ00sYUFBbUI7QUFFdkIsZUFBS04sUUFBTCxDQUFjO0FBQ1pMLGtCQUFRWSxDQURJO0FBRVpYO0FBRlks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QyxNQUFYLENBQWtCTCxJQUFsQixDQUF1QixJQUF2QjtBQURSO0FBYkYsT0FERjtBQW1CRDs7OztFQXhHcUJNLE1BQU1DLFM7O0FBMkc5QkMsT0FBT3hDLFNBQVAsR0FBbUJBLFNBQW5CIiwiZmlsZSI6Ik15UmF0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE15UmF0aW5ncyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBtb3ZpZXM6IFtdLFxyXG4gICAgICBhbGxSYXRlZE1vdmllczogdHJ1ZSxcclxuICAgICAgc2VhcmNoOiAnJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vc2hvdyByZW5kZXIgYSBsaXN0IG9mIHJlY2VudCByZWxlYXNlcyBvbiBpbml0aWFsaXplXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICB0aGlzLmdldEFsbFJhdGVkTW92aWVzKCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBzZWFyY2g6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0QWxsUmF0ZWRNb3ZpZXMoKSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLm1vdmllcyk7XHJcbiAgICAkLmdldChVcmwgKyAnL2dldFVzZXJSYXRpbmdzJylcclxuICAgIC50aGVuKHVzZXJSYXRlZE1vdmllcyA9PiB7XHJcbiAgICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCB1c2VyUmF0ZWRNb3ZpZXMpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBtb3ZpZXM6IHVzZXJSYXRlZE1vdmllcyxcclxuICAgICAgICBhbGxSYXRlZE1vdmllczogdHJ1ZVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgICBcclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL0V2ZW50IEhhbmRsZXJzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAvL3RoaXMgd2lsbCBjYWxsIHNlYXJjaCBmb3IgYSBtb3ZpZSBmcm9tIGV4dGVybmFsIEFQSSwgZG8gYSBkYXRhYmFzZSBxdWVyeSBmb3IgcmF0aW5nXHJcbiAgLy9hbmQgc2V0IHRoZSByZXBvbnNlIHRvIHRoZSBtb3ZpZXMgc3RhdGVcclxuICBoYW5kbGVTZWFyY2goZXZlbnQpIHtcclxuICAgIFxyXG4gICAgaWYgKGV2ZW50LmNoYXJDb2RlID09IDEzIHx8IGV2ZW50ID09PSAnY2xpY2tlZCcpIHtcclxuICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5zZWFyY2gsdGhpcy5zdGF0ZS5tb3ZpZXMpO1xyXG4gICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgbGV0IGZvdW5kPWZhbHNlO1xyXG4gICAgICBjb25zdCBtb3ZpZXNUaGF0TWF0Y2g9W11cclxuXHJcbiAgICAgIHRoaXMuc3RhdGUubW92aWVzLmZvckVhY2goKGVsLGlkeCk9PntcclxuICAgICAgICBjb25zb2xlLmxvZygnaGVyZSBpdCBpcycsIGVsLnRpdGxlLnRvTG93ZXJDYXNlKCksdGhpcy5zdGF0ZS5zZWFyY2gudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgaWYgKGVsLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnN0YXRlLnNlYXJjaC50b0xvd2VyQ2FzZSgpKT4tMSl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnNlYXJjaCk7XHJcbiAgICAgICAgICBtb3ZpZXNUaGF0TWF0Y2gucHVzaChlbCk7XHJcbiAgICAgICAgICBmb3VuZD10cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCFmb3VuZCl7XHJcbiAgICAgICAgICAkKFwiI21vdk5vdEluQ29sbFwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgICAkKFwiI21vdk5vdEluQ29sbFwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgICBjb25zb2xlLmxvZygnc2hvdWxkIG5vdyBzaG93IHRoZW0gbWVzc2FnZSB0aGF0IHRoZXJlIGlzIG5vIHN1Y2ggbW92aWUnKTtcclxuICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhhdC5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIG1vdmllczogbW92aWVzVGhhdE1hdGNoLFxyXG4gICAgICAgICAgICBhbGxSYXRlZE1vdmllczogZmFsc2VcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgfSAgICBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIFxyXG5cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgdmFyIGxhYmxlO1xyXG4gICAgdmFyIHJlc3VsdHM7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5hbGxSYXRlZE1vdmllcyA9PT0gZmFsc2UpIHtcclxuICAgICAgbGFibGUgPSAnQmFjayBUbyBBbGwgUmF0ZWQgTW92aWVzJztcclxuICAgICAgcmVzdWx0cyA9ICh0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApID8gKDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj5SZXN1bHRzIGNhbm5vdCBiZSBmb3VuZDwvZGl2PikgOiAoPGg1IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPkFsbCBtYXRjaGluZyByZXN1bHRzPC9oNT4pXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuYWxsUmF0ZWRNb3ZpZXMgJiYgdGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGxhYmxlID0gJ1lvdSBoYXZlIG5vdCByYXRlZCBhbnkgbW92aWVzJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxhYmxlID0gJ0FsbCBSYXRlZCBNb3ZpZXMnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdNeVJhdGluZ3MgY29sbGVjdGlvbic+IFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInIG9uQ2xpY2s9e3RoaXMuZ2V0QWxsUmF0ZWRNb3ZpZXMuYmluZCh0aGlzKX0+e2xhYmxlfTwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWFyY2hNb3ZpZSc+XHJcbiAgICAgICAgICA8aW5wdXQgdHlwZSA9J3RleHQnIGlkPSdtb3ZpZUlucHV0JyBcclxuICAgICAgICAgICAgY2xhc3NOYW1lPSdtb3ZpZUlucHV0J1xyXG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5zZWFyY2h9XHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdJbnNlcnQgTW92aWUgVGl0bGUnXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gdGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKSgnY2xpY2tlZCcpfT5zZWFyY2g8L2E+XHJcbiAgICAgICAgICA8aDUgaWQ9XCJtb3ZOb3RJbkNvbGxcIiBzdHlsZT17e2Rpc3BsYXk6ICdub25lJywgY29sb3I6XCJyZWRcIn19Pnt0aGlzLnN0YXRlLnNlYXJjaH0gZG9lc24ndCBtYXRjaCBhbnl0aGluZyBpbiB5b3VyIGNvbGxlY3Rpb248L2g1PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHtyZXN1bHRzfVxyXG4gICAgICAgIDxNb3ZpZUxpc3QgbW92aWVzPXt0aGlzLnN0YXRlLm1vdmllc31cclxuICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuTXlSYXRpbmdzID0gTXlSYXRpbmdzOyJdfQ==