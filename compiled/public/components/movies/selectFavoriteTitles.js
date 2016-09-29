'use strict';

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var d = c[i]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(b, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var SelectFavoriteTitles = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      movies: []
    };
    return d;
  }

  //show render a list of recent releases on initialize


  _createClass(b, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getAllRatedMovies();
    }

    //////////////////////
    /////Event Handlers
    //////////////////////

    //this will call search for a movie from external API, do a database query for rating
    //and set the reponse to the movies state

  }, {
    key: 'handleSearch',
    value: function handleSearch(c) {
      var _this2 = this;

      if (c.charCode == 13) {
        var d = this;

        //this will search database
        $.get(Url + '/searchRatedMovie', { title: c.target.value }).then(function (e) {
          // console.log('response from server', searchResults);
          _this2.setState({
            movies: e,
            allRatedMovies: !1
          });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var c, d;

      if (this.state.allRatedMovies === !1) {
        c = 'back to all rated movies';
        d = this.state.movies.length === 0 ? React.createElement(
          'div',
          { className: 'errorMsg' },
          'results cannot be found'
        ) : React.createElement(
          'div',
          { className: 'updateMsg' },
          'all match results:'
        );
      } else if (this.state.allRatedMovies && this.state.movies.length === 0) {
        c = 'You have not rated any movies';
      } else {
        c = 'All Rated Movies';
      }

      return React.createElement(
        'div',
        { className: 'MyRatings' },
        React.createElement(
          'div',
          { onClick: this.getAllRatedMovies.bind(this) },
          c
        ),
        React.createElement(
          'div',
          { className: 'searchMovie' },
          React.createElement('input', { type: 'text', id: 'movieInput',
            className: 'movieInput',
            placeholder: 'Insert Movie Title',
            onKeyPress: this.handleSearch.bind(this) })
        ),
        d,
        React.createElement(MovieList, { movies: this.state.movies,
          change: this.props.change.bind(this)
        })
      );
    }
  }]);

  return b;
}(React.Component);

window.MyRatings = MyRatings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9zZWxlY3RGYXZvcml0ZVRpdGxlcy5qcyJdLCJuYW1lcyI6WyJTZWxlY3RGYXZvcml0ZVRpdGxlcyIsInByb3BzIiwic3RhdGUiLCJtb3ZpZXMiLCJnZXRBbGxSYXRlZE1vdmllcyIsImV2ZW50IiwiY2hhckNvZGUiLCJ0aGF0IiwiJCIsImdldCIsIlVybCIsInRpdGxlIiwidGFyZ2V0IiwidmFsdWUiLCJ0aGVuIiwic2V0U3RhdGUiLCJzZWFyY2hSZXN1bHRzIiwiYWxsUmF0ZWRNb3ZpZXMiLCJsYWJsZSIsInJlc3VsdHMiLCJsZW5ndGgiLCJiaW5kIiwiaGFuZGxlU2VhcmNoIiwiY2hhbmdlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciLCJNeVJhdGluZ3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsb0I7OztBQUNKLGFBQVlDLENBQVosRUFBbUI7QUFBQTs7QUFBQSxrR0FDWEEsQ0FEVzs7QUFHakIsTUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGNBQVE7QUFERyxLQUFiO0FBSGlCO0FBTWxCOztBQUVEOzs7Ozt3Q0FDb0I7QUFDbEIsV0FBS0MsaUJBQUw7QUFDRDs7QUFHRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7OztpQ0FDYUMsQyxFQUFPO0FBQUE7O0FBQ2xCLFVBQUlBLEVBQU1DLFFBQU4sSUFBa0IsRUFBdEIsRUFBMEI7QUFDeEIsWUFBSUMsSUFBTyxJQUFYOztBQUVBO0FBQ0ZDLFVBQUVDLEdBQUYsQ0FBTUMsTUFBTSxtQkFBWixFQUFpQyxFQUFDQyxPQUFPTixFQUFNTyxNQUFOLENBQWFDLEtBQXJCLEVBQWpDLEVBQ0NDLElBREQsQ0FDTSxhQUFpQjtBQUNyQjtBQUNBLGlCQUFLQyxRQUFMLENBQWM7QUFDWlosb0JBQVFhLENBREk7QUFFWkM7QUFGWSxXQUFkO0FBSUQsU0FQRDtBQVFDO0FBQ0Y7Ozs2QkFFUTtBQUNQLFVBQUlDLENBQUosRUFDSUMsQ0FESjs7QUFFQSxVQUFJLEtBQUtqQixLQUFMLENBQVdlLGNBQVgsT0FBSixFQUF5QztBQUN2Q0MsWUFBUSwwQkFBUjtBQUNBQyxZQUFXLEtBQUtqQixLQUFMLENBQVdDLE1BQVgsQ0FBa0JpQixNQUFsQixLQUE2QixDQUE5QixHQUFvQztBQUFBO0FBQUEsWUFBSyxXQUFVLFVBQWY7QUFBQTtBQUFBLFNBQXBDLEdBQWdHO0FBQUE7QUFBQSxZQUFLLFdBQVUsV0FBZjtBQUFBO0FBQUEsU0FBMUc7QUFDRCxPQUhELE1BR08sSUFBSSxLQUFLbEIsS0FBTCxDQUFXZSxjQUFYLElBQTZCLEtBQUtmLEtBQUwsQ0FBV0MsTUFBWCxDQUFrQmlCLE1BQWxCLEtBQTZCLENBQTlELEVBQWlFO0FBQ3RFRixZQUFRLCtCQUFSO0FBQ0QsT0FGTSxNQUVBO0FBQ0xBLFlBQVEsa0JBQVI7QUFDRDs7QUFFRCxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsV0FBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFNBQVMsS0FBS2QsaUJBQUwsQ0FBdUJpQixJQUF2QixDQUE0QixJQUE1QixDQUFkO0FBQWtESDtBQUFsRCxTQURGO0FBRUU7QUFBQTtBQUFBLFlBQUssV0FBVSxhQUFmO0FBQ0UseUNBQU8sTUFBTSxNQUFiLEVBQW9CLElBQUcsWUFBdkI7QUFDRSx1QkFBVSxZQURaO0FBRUUseUJBQVksb0JBRmQ7QUFHRSx3QkFBWSxLQUFLSSxZQUFMLENBQWtCRCxJQUFsQixDQUF1QixJQUF2QixDQUhkO0FBREYsU0FGRjtBQVFHRixTQVJIO0FBU0UsNEJBQUMsU0FBRCxJQUFXLFFBQVEsS0FBS2pCLEtBQUwsQ0FBV0MsTUFBOUI7QUFDQSxrQkFBUSxLQUFLRixLQUFMLENBQVdzQixNQUFYLENBQWtCRixJQUFsQixDQUF1QixJQUF2QjtBQURSO0FBVEYsT0FERjtBQWVEOzs7O0VBaEVnQ0csTUFBTUMsUzs7QUFtRXpDQyxPQUFPQyxTQUFQLEdBQW1CQSxTQUFuQiIsImZpbGUiOiJzZWxlY3RGYXZvcml0ZVRpdGxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNlbGVjdEZhdm9yaXRlVGl0bGVzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIG1vdmllczogW10sXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy9zaG93IHJlbmRlciBhIGxpc3Qgb2YgcmVjZW50IHJlbGVhc2VzIG9uIGluaXRpYWxpemVcclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIHRoaXMuZ2V0QWxsUmF0ZWRNb3ZpZXMoKTtcclxuICB9XHJcblxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xyXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQuY2hhckNvZGUgPT0gMTMpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgLy90aGlzIHdpbGwgc2VhcmNoIGRhdGFiYXNlXHJcbiAgICAkLmdldChVcmwgKyAnL3NlYXJjaFJhdGVkTW92aWUnLCB7dGl0bGU6IGV2ZW50LnRhcmdldC52YWx1ZX0pXHJcbiAgICAudGhlbihzZWFyY2hSZXN1bHRzID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgc2VhcmNoUmVzdWx0cyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG1vdmllczogc2VhcmNoUmVzdWx0cyxcclxuICAgICAgICBhbGxSYXRlZE1vdmllczogZmFsc2VcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgdmFyIGxhYmxlO1xyXG4gICAgdmFyIHJlc3VsdHM7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5hbGxSYXRlZE1vdmllcyA9PT0gZmFsc2UpIHtcclxuICAgICAgbGFibGUgPSAnYmFjayB0byBhbGwgcmF0ZWQgbW92aWVzJztcclxuICAgICAgcmVzdWx0cyA9ICh0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApID8gKDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj5yZXN1bHRzIGNhbm5vdCBiZSBmb3VuZDwvZGl2PikgOiAoPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj5hbGwgbWF0Y2ggcmVzdWx0czo8L2Rpdj4pXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuYWxsUmF0ZWRNb3ZpZXMgJiYgdGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGxhYmxlID0gJ1lvdSBoYXZlIG5vdCByYXRlZCBhbnkgbW92aWVzJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxhYmxlID0gJ0FsbCBSYXRlZCBNb3ZpZXMnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdNeVJhdGluZ3MnPiBcclxuICAgICAgICA8ZGl2IG9uQ2xpY2s9e3RoaXMuZ2V0QWxsUmF0ZWRNb3ZpZXMuYmluZCh0aGlzKX0+e2xhYmxlfTwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWFyY2hNb3ZpZSc+XHJcbiAgICAgICAgICA8aW5wdXQgdHlwZSA9J3RleHQnIGlkPSdtb3ZpZUlucHV0JyBcclxuICAgICAgICAgICAgY2xhc3NOYW1lPSdtb3ZpZUlucHV0J1xyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nSW5zZXJ0IE1vdmllIFRpdGxlJ1xyXG4gICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAge3Jlc3VsdHN9XHJcbiAgICAgICAgPE1vdmllTGlzdCBtb3ZpZXM9e3RoaXMuc3RhdGUubW92aWVzfVxyXG4gICAgICAgIGNoYW5nZT17dGhpcy5wcm9wcy5jaGFuZ2UuYmluZCh0aGlzKX1cclxuICAgICAgICAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIClcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5NeVJhdGluZ3MgPSBNeVJhdGluZ3M7Il19