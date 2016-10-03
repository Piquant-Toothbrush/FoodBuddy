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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanN4Il0sIm5hbWVzIjpbIk15UmF0aW5ncyIsInByb3BzIiwic3RhdGUiLCJtb3ZpZXMiLCJhbGxSYXRlZE1vdmllcyIsInNlYXJjaCIsImdldEFsbFJhdGVkTW92aWVzIiwiZXZlbnQiLCJzZXRTdGF0ZSIsInRhcmdldCIsInZhbHVlIiwiJCIsImdldCIsIlVybCIsInRoZW4iLCJ1c2VyUmF0ZWRNb3ZpZXMiLCJjaGFyQ29kZSIsInRoYXQiLCJmb3VuZCIsIm1vdmllc1RoYXRNYXRjaCIsImZvckVhY2giLCJlbCIsImlkeCIsInRpdGxlIiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwicHVzaCIsImZhZGVJbiIsImZhZGVPdXQiLCJsYWJsZSIsInJlc3VsdHMiLCJsZW5ndGgiLCJiaW5kIiwiaGFuZGxlQ2hhbmdlIiwiaGFuZGxlU2VhcmNoIiwiZGlzcGxheSIsImNvbG9yIiwiY2hhbmdlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsUzs7O0FBQ0osYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUdqQixNQUFLQyxLQUFMLEdBQWE7QUFDWEMsY0FBUSxFQURHO0FBRVhDLHdCQUZXO0FBR1hDLGNBQVE7QUFIRyxLQUFiO0FBSGlCO0FBUWxCOztBQUVEOzs7Ozt3Q0FDb0I7QUFDbEIsV0FBS0MsaUJBQUw7QUFDRDs7O2lDQUVZQyxDLEVBQU87QUFDbEIsV0FBS0MsUUFBTCxDQUFjO0FBQ1pILGdCQUFRRSxFQUFNRSxNQUFOLENBQWFDO0FBRFQsT0FBZDtBQUdEOzs7d0NBR21CO0FBQUE7O0FBRWxCQyxRQUFFQyxHQUFGLENBQU1DLE1BQU0saUJBQVosRUFDQ0MsSUFERCxDQUNNLGFBQW1CO0FBRXZCLGVBQUtOLFFBQUwsQ0FBYztBQUNaTCxrQkFBUVksQ0FESTtBQUVaWDtBQUZZ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b0MsTUFBWCxDQUFrQkwsSUFBbEIsQ0FBdUIsSUFBdkI7QUFEUjtBQWJGLE9BREY7QUFtQkQ7Ozs7RUF4R3FCTSxNQUFNQyxTOztBQTJHOUJDLE9BQU94QyxTQUFQLEdBQW1CQSxTQUFuQiIsImZpbGUiOiJNeVJhdGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNeVJhdGluZ3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgbW92aWVzOiBbXSxcclxuICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWUsXHJcbiAgICAgIHNlYXJjaDogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvL3Nob3cgcmVuZGVyIGEgbGlzdCBvZiByZWNlbnQgcmVsZWFzZXMgb24gaW5pdGlhbGl6ZVxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5nZXRBbGxSYXRlZE1vdmllcygpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgc2VhcmNoOiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGdldEFsbFJhdGVkTW92aWVzKCkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5tb3ZpZXMpO1xyXG4gICAgJC5nZXQoVXJsICsgJy9nZXRVc2VyUmF0aW5ncycpXHJcbiAgICAudGhlbih1c2VyUmF0ZWRNb3ZpZXMgPT4ge1xyXG4gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgdXNlclJhdGVkTW92aWVzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbW92aWVzOiB1c2VyUmF0ZWRNb3ZpZXMsXHJcbiAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWVcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xyXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcbiAgICBcclxuICAgIGlmIChldmVudC5jaGFyQ29kZSA9PSAxMyB8fCBldmVudCA9PT0gJ2NsaWNrZWQnKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuc2VhcmNoLHRoaXMuc3RhdGUubW92aWVzKTtcclxuICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgIGxldCBmb3VuZD1mYWxzZTtcclxuICAgICAgY29uc3QgbW92aWVzVGhhdE1hdGNoPVtdXHJcblxyXG4gICAgICB0aGlzLnN0YXRlLm1vdmllcy5mb3JFYWNoKChlbCxpZHgpPT57XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2hlcmUgaXQgaXMnLCBlbC50aXRsZS50b0xvd2VyQ2FzZSgpLHRoaXMuc3RhdGUuc2VhcmNoLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgIGlmIChlbC50aXRsZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5zdGF0ZS5zZWFyY2gudG9Mb3dlckNhc2UoKSk+LTEpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5zZWFyY2gpO1xyXG4gICAgICAgICAgbW92aWVzVGhhdE1hdGNoLnB1c2goZWwpO1xyXG4gICAgICAgICAgZm91bmQ9dHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAgIGlmICghZm91bmQpe1xyXG4gICAgICAgICAgJChcIiNtb3ZOb3RJbkNvbGxcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICAgJChcIiNtb3ZOb3RJbkNvbGxcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICAgY29uc29sZS5sb2coJ3Nob3VsZCBub3cgc2hvdyB0aGVtIG1lc3NhZ2UgdGhhdCB0aGVyZSBpcyBubyBzdWNoIG1vdmllJyk7XHJcbiAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoYXQuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBtb3ZpZXM6IG1vdmllc1RoYXRNYXRjaCxcclxuICAgICAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IGZhbHNlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgIH0gICAgXHJcbiAgICAgIH1cclxuICAgIH1cclxuICBcclxuXHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHZhciBsYWJsZTtcclxuICAgIHZhciByZXN1bHRzO1xyXG4gICAgaWYgKHRoaXMuc3RhdGUuYWxsUmF0ZWRNb3ZpZXMgPT09IGZhbHNlKSB7XHJcbiAgICAgIGxhYmxlID0gJ0JhY2sgVG8gQWxsIFJhdGVkIE1vdmllcyc7XHJcbiAgICAgIHJlc3VsdHMgPSAodGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSA/ICg8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+UmVzdWx0cyBjYW5ub3QgYmUgZm91bmQ8L2Rpdj4pIDogKDxoNSBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj5BbGwgbWF0Y2hpbmcgcmVzdWx0czwvaDU+KVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmFsbFJhdGVkTW92aWVzICYmIHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBsYWJsZSA9ICdZb3UgaGF2ZSBub3QgcmF0ZWQgYW55IG1vdmllcyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsYWJsZSA9ICdBbGwgUmF0ZWQgTW92aWVzJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nTXlSYXRpbmdzIGNvbGxlY3Rpb24nPiBcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJyBvbkNsaWNrPXt0aGlzLmdldEFsbFJhdGVkTW92aWVzLmJpbmQodGhpcyl9PntsYWJsZX08L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VhcmNoTW92aWUnPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGUgPSd0ZXh0JyBpZD0nbW92aWVJbnB1dCcgXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcclxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuc2VhcmNofVxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nSW5zZXJ0IE1vdmllIFRpdGxlJ1xyXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcykoJ2NsaWNrZWQnKX0+c2VhcmNoPC9hPlxyXG4gICAgICAgICAgPGg1IGlkPVwibW92Tm90SW5Db2xsXCIgc3R5bGU9e3tkaXNwbGF5OiAnbm9uZScsIGNvbG9yOlwicmVkXCJ9fT57dGhpcy5zdGF0ZS5zZWFyY2h9IGRvZXNuJ3QgbWF0Y2ggYW55dGhpbmcgaW4geW91ciBjb2xsZWN0aW9uPC9oNT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICB7cmVzdWx0c31cclxuICAgICAgICA8TW92aWVMaXN0IG1vdmllcz17dGhpcy5zdGF0ZS5tb3ZpZXN9XHJcbiAgICAgICAgY2hhbmdlPXt0aGlzLnByb3BzLmNoYW5nZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKVxyXG4gIH1cclxufVxyXG5cclxud2luZG93Lk15UmF0aW5ncyA9IE15UmF0aW5nczsiXX0=