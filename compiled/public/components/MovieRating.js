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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL01vdmllUmF0aW5nLmpzeCJdLCJuYW1lcyI6WyJNb3ZpZVJhdGluZyIsInByb3BzIiwic3RhdGUiLCJ2YWx1ZSIsImV2ZW50IiwiaGFuZGxlU2VhcmNoTW92aWUiLCJ0YXJnZXQiLCJzZXRTdGF0ZSIsImhhbmRsZVNlYXJjaCIsImJpbmQiLCJtb3ZpZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLFc7OztBQUNKLGFBQVlDLENBQVosRUFBbUI7QUFBQTs7QUFBQSxrR0FDWEEsQ0FEVzs7QUFHakIsTUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU87QUFESSxLQUFiO0FBSGlCO0FBTWxCOzs7O2lDQUVZQyxDLEVBQU87QUFDbEIsV0FBS0gsS0FBTCxDQUFXSSxpQkFBWCxDQUE2QkQsRUFBTUUsTUFBTixDQUFhSCxLQUExQztBQUNBLFdBQUtJLFFBQUwsQ0FBYztBQUNaSixlQUFPQyxFQUFNRSxNQUFOLENBQWFIO0FBRFIsT0FBZDtBQUdEOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsaUJBQWY7QUFBQTtBQUVlLHVDQUFPLE1BQU0sTUFBYjtBQUNiLGNBQUcsWUFEVTtBQUViLHFCQUFVLFlBRkc7QUFHYix1QkFBWSxvQkFIQztBQUliLGlCQUFPLEtBQUtELEtBQUwsQ0FBV0MsS0FKTDtBQUtiLG9CQUFVLEtBQUtLLFlBQUwsQ0FBa0JDLElBQWxCLENBQXVCLElBQXZCO0FBTEcsVUFGZjtBQVNFO0FBQUE7QUFBQSxZQUFRLFdBQVUsb0JBQWxCO0FBQUE7QUFBQSxTQVRGO0FBV0U7QUFBQTtBQUFBO0FBQ0UsOEJBQUMsWUFBRDtBQUNBLG1CQUFPLEtBQUtSLEtBQUwsQ0FBV1M7QUFEbEI7QUFERjtBQVhGLE9BREY7QUFtQkQ7Ozs7RUFwQ3VCQyxNQUFNQyxTOztBQXVDaENDLE9BQU9iLFdBQVAsR0FBcUJBLFdBQXJCIiwiZmlsZSI6Ik1vdmllUmF0aW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTW92aWVSYXRpbmcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdmFsdWU6ICcnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcbiAgICB0aGlzLnByb3BzLmhhbmRsZVNlYXJjaE1vdmllKGV2ZW50LnRhcmdldC52YWx1ZSk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nZnJpZW5kTW92aWVMaXN0Jz5cclxuXHJcbiAgICAgICAgTW92aWUgVGl0bGU6IDxpbnB1dCB0eXBlID0ndGV4dCcgXHJcbiAgICAgICAgaWQ9J21vdmllSW5wdXQnIFxyXG4gICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcclxuICAgICAgICBwbGFjZWhvbGRlcj0nSW5zZXJ0IE1vdmllIFRpdGxlJ1xyXG4gICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxyXG4gICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAvPlxyXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPSdzZWFyY2hTdWJtaXRCdXR0b24nPlxyXG4gICAgICAgIEdldCBNb3ZpZTwvYnV0dG9uPlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8TW92aWVEaXNwbGF5XHJcbiAgICAgICAgICBtb3ZpZT17dGhpcy5wcm9wcy5tb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5Nb3ZpZVJhdGluZyA9IE1vdmllUmF0aW5nOyJdfQ==