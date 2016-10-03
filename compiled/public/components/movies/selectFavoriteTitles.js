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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9zZWxlY3RGYXZvcml0ZVRpdGxlcy5qc3giXSwibmFtZXMiOlsiU2VsZWN0RmF2b3JpdGVUaXRsZXMiLCJwcm9wcyIsInN0YXRlIiwibW92aWVzIiwiZ2V0QWxsUmF0ZWRNb3ZpZXMiLCJldmVudCIsImNoYXJDb2RlIiwidGhhdCIsIiQiLCJnZXQiLCJVcmwiLCJ0aXRsZSIsInRhcmdldCIsInZhbHVlIiwidGhlbiIsInNldFN0YXRlIiwic2VhcmNoUmVzdWx0cyIsImFsbFJhdGVkTW92aWVzIiwibGFibGUiLCJyZXN1bHRzIiwibGVuZ3RoIiwiYmluZCIsImhhbmRsZVNlYXJjaCIsImNoYW5nZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93IiwiTXlSYXRpbmdzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLG9COzs7QUFDSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBR2pCLE1BQUtDLEtBQUwsR0FBYTtBQUNYQyxjQUFRO0FBREcsS0FBYjtBQUhpQjtBQU1sQjs7QUFFRDs7Ozs7d0NBQ29CO0FBQ2xCLFdBQUtDLGlCQUFMO0FBQ0Q7O0FBR0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7aUNBQ2FDLEMsRUFBTztBQUFBOztBQUNsQixVQUFJQSxFQUFNQyxRQUFOLElBQWtCLEVBQXRCLEVBQTBCO0FBQ3hCLFlBQUlDLElBQU8sSUFBWDs7QUFFQTtBQUNGQyxVQUFFQyxHQUFGLENBQU1DLE1BQU0sbUJBQVosRUFBaUMsRUFBQ0MsT0FBT04sRUFBTU8sTUFBTixDQUFhQyxLQUFyQixFQUFqQyxFQUNDQyxJQURELENBQ00sYUFBaUI7QUFDckI7QUFDQSxpQkFBS0MsUUFBTCxDQUFjO0FBQ1paLG9CQUFRYSxDQURJO0FBRVpDO0FBRlksV0FBZDtBQUlELFNBUEQ7QUFRQztBQUNGOzs7NkJBRVE7QUFDUCxVQUFJQyxDQUFKLEVBQ0lDLENBREo7O0FBRUEsVUFBSSxLQUFLakIsS0FBTCxDQUFXZSxjQUFYLE9BQUosRUFBeUM7QUFDdkNDLFlBQVEsMEJBQVI7QUFDQUMsWUFBVyxLQUFLakIsS0FBTCxDQUFXQyxNQUFYLENBQWtCaUIsTUFBbEIsS0FBNkIsQ0FBOUIsR0FBb0M7QUFBQTtBQUFBLFlBQUssV0FBVSxVQUFmO0FBQUE7QUFBQSxTQUFwQyxHQUFnRztBQUFBO0FBQUEsWUFBSyxXQUFVLFdBQWY7QUFBQTtBQUFBLFNBQTFHO0FBQ0QsT0FIRCxNQUdPLElBQUksS0FBS2xCLEtBQUwsQ0FBV2UsY0FBWCxJQUE2QixLQUFLZixLQUFMLENBQVdDLE1BQVgsQ0FBa0JpQixNQUFsQixLQUE2QixDQUE5RCxFQUFpRTtBQUN0RUYsWUFBUSwrQkFBUjtBQUNELE9BRk0sTUFFQTtBQUNMQSxZQUFRLGtCQUFSO0FBQ0Q7O0FBRUQsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLFdBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxTQUFTLEtBQUtkLGlCQUFMLENBQXVCaUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBZDtBQUFrREg7QUFBbEQsU0FERjtBQUVFO0FBQUE7QUFBQSxZQUFLLFdBQVUsYUFBZjtBQUNFLHlDQUFPLE1BQU0sTUFBYixFQUFvQixJQUFHLFlBQXZCO0FBQ0UsdUJBQVUsWUFEWjtBQUVFLHlCQUFZLG9CQUZkO0FBR0Usd0JBQVksS0FBS0ksWUFBTCxDQUFrQkQsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FIZDtBQURGLFNBRkY7QUFRR0YsU0FSSDtBQVNFLDRCQUFDLFNBQUQsSUFBVyxRQUFRLEtBQUtqQixLQUFMLENBQVdDLE1BQTlCO0FBQ0Esa0JBQVEsS0FBS0YsS0FBTCxDQUFXc0IsTUFBWCxDQUFrQkYsSUFBbEIsQ0FBdUIsSUFBdkI7QUFEUjtBQVRGLE9BREY7QUFlRDs7OztFQWhFZ0NHLE1BQU1DLFM7O0FBbUV6Q0MsT0FBT0MsU0FBUCxHQUFtQkEsU0FBbkIiLCJmaWxlIjoic2VsZWN0RmF2b3JpdGVUaXRsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTZWxlY3RGYXZvcml0ZVRpdGxlcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBtb3ZpZXM6IFtdLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vc2hvdyByZW5kZXIgYSBsaXN0IG9mIHJlY2VudCByZWxlYXNlcyBvbiBpbml0aWFsaXplXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICB0aGlzLmdldEFsbFJhdGVkTW92aWVzKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vLy8vRXZlbnQgSGFuZGxlcnNcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIC8vdGhpcyB3aWxsIGNhbGwgc2VhcmNoIGZvciBhIG1vdmllIGZyb20gZXh0ZXJuYWwgQVBJLCBkbyBhIGRhdGFiYXNlIHF1ZXJ5IGZvciByYXRpbmdcclxuICAvL2FuZCBzZXQgdGhlIHJlcG9uc2UgdG8gdGhlIG1vdmllcyBzdGF0ZVxyXG4gIGhhbmRsZVNlYXJjaChldmVudCkge1xyXG4gICAgaWYgKGV2ZW50LmNoYXJDb2RlID09IDEzKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgIC8vdGhpcyB3aWxsIHNlYXJjaCBkYXRhYmFzZVxyXG4gICAgJC5nZXQoVXJsICsgJy9zZWFyY2hSYXRlZE1vdmllJywge3RpdGxlOiBldmVudC50YXJnZXQudmFsdWV9KVxyXG4gICAgLnRoZW4oc2VhcmNoUmVzdWx0cyA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIHNlYXJjaFJlc3VsdHMpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBtb3ZpZXM6IHNlYXJjaFJlc3VsdHMsXHJcbiAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHZhciBsYWJsZTtcclxuICAgIHZhciByZXN1bHRzO1xyXG4gICAgaWYgKHRoaXMuc3RhdGUuYWxsUmF0ZWRNb3ZpZXMgPT09IGZhbHNlKSB7XHJcbiAgICAgIGxhYmxlID0gJ2JhY2sgdG8gYWxsIHJhdGVkIG1vdmllcyc7XHJcbiAgICAgIHJlc3VsdHMgPSAodGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSA/ICg8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+cmVzdWx0cyBjYW5ub3QgYmUgZm91bmQ8L2Rpdj4pIDogKDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlTXNnXCI+YWxsIG1hdGNoIHJlc3VsdHM6PC9kaXY+KVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmFsbFJhdGVkTW92aWVzICYmIHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBsYWJsZSA9ICdZb3UgaGF2ZSBub3QgcmF0ZWQgYW55IG1vdmllcyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsYWJsZSA9ICdBbGwgUmF0ZWQgTW92aWVzJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nTXlSYXRpbmdzJz4gXHJcbiAgICAgICAgPGRpdiBvbkNsaWNrPXt0aGlzLmdldEFsbFJhdGVkTW92aWVzLmJpbmQodGhpcyl9PntsYWJsZX08L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VhcmNoTW92aWUnPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGUgPSd0ZXh0JyBpZD0nbW92aWVJbnB1dCcgXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0luc2VydCBNb3ZpZSBUaXRsZSdcclxuICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKX0vPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHtyZXN1bHRzfVxyXG4gICAgICAgIDxNb3ZpZUxpc3QgbW92aWVzPXt0aGlzLnN0YXRlLm1vdmllc31cclxuICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuTXlSYXRpbmdzID0gTXlSYXRpbmdzOyJdfQ==