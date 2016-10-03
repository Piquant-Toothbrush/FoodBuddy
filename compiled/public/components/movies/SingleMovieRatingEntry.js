"use strict";

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var d = c[i]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(b, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var SingleMovieRatingEntry = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      rating: c.rating
    };
    return d;
  }

  _createClass(b, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "handleClick",
    value: function handleClick(c) {}
  }, {
    key: "render",
    value: function render() {
      //note, on click of portrait, name, review
      //should be able to see all the movies reviewed by friend
      //on send watch request click, should send a watch request
      var c = this.state.rating,
          d = this;

      return React.createElement(
        "div",
        { className: "collection-item row", onClick: function onClick() {
            return void 0;
          } },
        React.createElement(
          "div",
          { className: "col s3" },
          React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
        ),
        React.createElement(
          "div",
          { id: "Friend", className: "MovieEntryFriend col s9" },
          React.createElement(
            "div",
            { className: "top" },
            React.createElement(
              "a",
              { className: "friendEntryIndividual individual" },
              React.createElement(
                "div",
                { className: "friendName", onClick: function onClick() {
                    return d.props.fof(c.friendUserName);
                  } },
                c.friendUserName
              )
            )
          ),
          React.createElement(
            "div",
            { className: "friendReview" },
            c.review === null ? c.friendUserName + ' did not leave a review' : c.friendUserName + "'s review: " + c.review
          ),
          React.createElement(
            "div",
            { className: "friendRating" },
            c.score === null ? c.friendUserName + ' have not rate the movie yet' : c.friendUserName + "'s rating is: " + c.score
          )
        )
      );
    }
  }]);

  return b;
}(React.Component);

window.SingleMovieRatingEntry = SingleMovieRatingEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzeCJdLCJuYW1lcyI6WyJTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5IiwicHJvcHMiLCJzdGF0ZSIsInJhdGluZyIsImJ1ZGR5IiwidGhhdCIsImZvZiIsImZyaWVuZFVzZXJOYW1lIiwicmV2aWV3Iiwic2NvcmUiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxzQjs7O0FBQ0osYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUVqQixNQUFLQyxLQUFMLEdBQWE7QUFDWEMsY0FBUUYsRUFBTUU7QUFESCxLQUFiO0FBRmlCO0FBS2xCOzs7O3dDQUVtQixDQUVuQjs7O2dDQUVXQyxDLEVBQU8sQ0FJbEI7Ozs2QkFFUTtBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQUlELElBQVMsS0FBS0QsS0FBTCxDQUFXQyxNQUF4QjtBQUFBLFVBQ0lFLElBQU8sSUFEWDs7QUFFQSxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUscUJBQWYsRUFBcUMsU0FBUztBQUFBO0FBQUEsV0FBOUM7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFFBQWY7QUFDRSx1Q0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREYsU0FERjtBQUlFO0FBQUE7QUFBQSxZQUFLLElBQUcsUUFBUixFQUFpQixXQUFVLHlCQUEzQjtBQUNFO0FBQUE7QUFBQSxjQUFLLFdBQVUsS0FBZjtBQUNFO0FBQUE7QUFBQSxnQkFBRyxXQUFVLGtDQUFiO0FBQWdEO0FBQUE7QUFBQSxrQkFBSyxXQUFVLFlBQWYsRUFBNEIsU0FBUztBQUFBLDJCQUFJQSxFQUFLSixLQUFMLENBQVdLLEdBQVgsQ0FBZUgsRUFBT0ksY0FBdEIsQ0FBSjtBQUFBLG1CQUFyQztBQUFpRkosa0JBQU9JO0FBQXhGO0FBQWhEO0FBREYsV0FERjtBQUlFO0FBQUE7QUFBQSxjQUFLLFdBQVUsY0FBZjtBQUFnQ0osY0FBT0ssTUFBUCxLQUFrQixJQUFuQixHQUEyQkwsRUFBT0ksY0FBUCxHQUF3Qix5QkFBbkQsR0FBK0VKLEVBQU9JLGNBQVAsR0FBd0IsYUFBeEIsR0FBd0NKLEVBQU9LO0FBQTdKLFdBSkY7QUFLRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGNBQWY7QUFBZ0NMLGNBQU9NLEtBQVAsS0FBaUIsSUFBbEIsR0FBMEJOLEVBQU9JLGNBQVAsR0FBd0IsOEJBQWxELEdBQW1GSixFQUFPSSxjQUFQLEdBQXdCLGdCQUF4QixHQUEyQ0osRUFBT007QUFBcEs7QUFMRjtBQUpGLE9BREY7QUFjRDs7OztFQXRDa0NDLE1BQU1DLFM7O0FBMEMzQ0MsT0FBT1osc0JBQVAsR0FBZ0NBLHNCQUFoQyIsImZpbGUiOiJTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2luZ2xlTW92aWVSYXRpbmdFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHJhdGluZzogcHJvcHMucmF0aW5nXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNsaWNrKGJ1ZGR5KSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzKVxyXG4gICAgLy8gdGhpcy5wcm9wcy5mb2YoYnVkZHkpO1xyXG4gICAgLy8gdGhpcy5wcm9wcy5jaGFuZ2UoJ3NpbmdsZUZyaWVuZCcsIHRoaXMuc3RhdGUucmF0aW5nLmZyaWVuZFVzZXJOYW1lKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIC8vbm90ZSwgb24gY2xpY2sgb2YgcG9ydHJhaXQsIG5hbWUsIHJldmlld1xyXG4gICAgLy9zaG91bGQgYmUgYWJsZSB0byBzZWUgYWxsIHRoZSBtb3ZpZXMgcmV2aWV3ZWQgYnkgZnJpZW5kXHJcbiAgICAvL29uIHNlbmQgd2F0Y2ggcmVxdWVzdCBjbGljaywgc2hvdWxkIHNlbmQgYSB3YXRjaCByZXF1ZXN0XHJcbiAgICBsZXQgcmF0aW5nID0gdGhpcy5zdGF0ZS5yYXRpbmc7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbGxlY3Rpb24taXRlbSByb3dcIiBvbkNsaWNrPXsoKT0+IGNvbnNvbGUubG9nKHRoYXQucHJvcHMpfT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzM1wiPlxyXG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBpZD1cIkZyaWVuZFwiIGNsYXNzTmFtZT1cIk1vdmllRW50cnlGcmllbmQgY29sIHM5XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvcFwiPlxyXG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9J2ZyaWVuZEVudHJ5SW5kaXZpZHVhbCBpbmRpdmlkdWFsJz48ZGl2IGNsYXNzTmFtZT1cImZyaWVuZE5hbWVcIiBvbkNsaWNrPXsoKT0+dGhhdC5wcm9wcy5mb2YocmF0aW5nLmZyaWVuZFVzZXJOYW1lKX0+e3JhdGluZy5mcmllbmRVc2VyTmFtZX08L2Rpdj48L2E+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kUmV2aWV3XCI+eyhyYXRpbmcucmV2aWV3ID09PSBudWxsKSA/IHJhdGluZy5mcmllbmRVc2VyTmFtZSArICcgZGlkIG5vdCBsZWF2ZSBhIHJldmlldycgOiByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyBcIidzIHJldmlldzogXCIgKyByYXRpbmcucmV2aWV3fTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmllbmRSYXRpbmdcIj57KHJhdGluZy5zY29yZSA9PT0gbnVsbCkgPyByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyAnIGhhdmUgbm90IHJhdGUgdGhlIG1vdmllIHlldCcgOiByYXRpbmcuZnJpZW5kVXNlck5hbWUgKyBcIidzIHJhdGluZyBpczogXCIgKyByYXRpbmcuc2NvcmV9PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcblxyXG59XHJcblxyXG53aW5kb3cuU2luZ2xlTW92aWVSYXRpbmdFbnRyeSA9IFNpbmdsZU1vdmllUmF0aW5nRW50cnk7XHJcblxyXG4iXX0=