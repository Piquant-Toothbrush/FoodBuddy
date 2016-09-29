'use strict';

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var d = c[i]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(b, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var MovieRating = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      value: ''
    };
    return d;
  }

  _createClass(b, [{
    key: 'handleSearch',
    value: function handleSearch(c) {
      this.props.handleSearchMovie(c.target.value);
      this.setState({
        value: c.target.value
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'friendMovieList' },
        'Movie Title: ',
        React.createElement('input', { type: 'text',
          id: 'movieInput',
          className: 'movieInput',
          placeholder: 'Insert Movie Title',
          value: this.state.value,
          onChange: this.handleSearch.bind(this)
        }),
        React.createElement(
          'button',
          { className: 'searchSubmitButton' },
          'Get Movie'
        ),
        React.createElement(
          'div',
          null,
          React.createElement(MovieDisplay, {
            movie: this.props.movie
          })
        )
      );
    }
  }]);

  return b;
}(React.Component);

window.MovieRating = MovieRating;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL01vdmllUmF0aW5nLmpzIl0sIm5hbWVzIjpbIk1vdmllUmF0aW5nIiwicHJvcHMiLCJzdGF0ZSIsInZhbHVlIiwiZXZlbnQiLCJoYW5kbGVTZWFyY2hNb3ZpZSIsInRhcmdldCIsInNldFN0YXRlIiwiaGFuZGxlU2VhcmNoIiwiYmluZCIsIm1vdmllIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsVzs7O0FBQ0osYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUdqQixNQUFLQyxLQUFMLEdBQWE7QUFDWEMsYUFBTztBQURJLEtBQWI7QUFIaUI7QUFNbEI7Ozs7aUNBRVlDLEMsRUFBTztBQUNsQixXQUFLSCxLQUFMLENBQVdJLGlCQUFYLENBQTZCRCxFQUFNRSxNQUFOLENBQWFILEtBQTFDO0FBQ0EsV0FBS0ksUUFBTCxDQUFjO0FBQ1pKLGVBQU9DLEVBQU1FLE1BQU4sQ0FBYUg7QUFEUixPQUFkO0FBR0Q7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxpQkFBZjtBQUFBO0FBRWUsdUNBQU8sTUFBTSxNQUFiO0FBQ2IsY0FBRyxZQURVO0FBRWIscUJBQVUsWUFGRztBQUdiLHVCQUFZLG9CQUhDO0FBSWIsaUJBQU8sS0FBS0QsS0FBTCxDQUFXQyxLQUpMO0FBS2Isb0JBQVUsS0FBS0ssWUFBTCxDQUFrQkMsSUFBbEIsQ0FBdUIsSUFBdkI7QUFMRyxVQUZmO0FBU0U7QUFBQTtBQUFBLFlBQVEsV0FBVSxvQkFBbEI7QUFBQTtBQUFBLFNBVEY7QUFXRTtBQUFBO0FBQUE7QUFDRSw4QkFBQyxZQUFEO0FBQ0EsbUJBQU8sS0FBS1IsS0FBTCxDQUFXUztBQURsQjtBQURGO0FBWEYsT0FERjtBQW1CRDs7OztFQXBDdUJDLE1BQU1DLFM7O0FBdUNoQ0MsT0FBT2IsV0FBUCxHQUFxQkEsV0FBckIiLCJmaWxlIjoiTW92aWVSYXRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNb3ZpZVJhdGluZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB2YWx1ZTogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBoYW5kbGVTZWFyY2goZXZlbnQpIHtcclxuICAgIHRoaXMucHJvcHMuaGFuZGxlU2VhcmNoTW92aWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdmcmllbmRNb3ZpZUxpc3QnPlxyXG5cclxuICAgICAgICBNb3ZpZSBUaXRsZTogPGlucHV0IHR5cGUgPSd0ZXh0JyBcclxuICAgICAgICBpZD0nbW92aWVJbnB1dCcgXHJcbiAgICAgICAgY2xhc3NOYW1lPSdtb3ZpZUlucHV0J1xyXG4gICAgICAgIHBsYWNlaG9sZGVyPSdJbnNlcnQgTW92aWUgVGl0bGUnXHJcbiAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9XHJcbiAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcyl9XHJcbiAgICAgICAgIC8+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J3NlYXJjaFN1Ym1pdEJ1dHRvbic+XHJcbiAgICAgICAgR2V0IE1vdmllPC9idXR0b24+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxNb3ZpZURpc3BsYXlcclxuICAgICAgICAgIG1vdmllPXt0aGlzLnByb3BzLm1vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxud2luZG93Lk1vdmllUmF0aW5nID0gTW92aWVSYXRpbmc7Il19