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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIl0sIm5hbWVzIjpbIlNpbmdsZU1vdmllUmF0aW5nRW50cnkiLCJwcm9wcyIsInN0YXRlIiwicmF0aW5nIiwiYnVkZHkiLCJ0aGF0IiwiZm9mIiwiZnJpZW5kVXNlck5hbWUiLCJyZXZpZXciLCJzY29yZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLHNCOzs7QUFDSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBRWpCLE1BQUtDLEtBQUwsR0FBYTtBQUNYQyxjQUFRRixFQUFNRTtBQURILEtBQWI7QUFGaUI7QUFLbEI7Ozs7d0NBRW1CLENBRW5COzs7Z0NBRVdDLEMsRUFBTyxDQUlsQjs7OzZCQUVRO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsVUFBSUQsSUFBUyxLQUFLRCxLQUFMLENBQVdDLE1BQXhCO0FBQUEsVUFDSUUsSUFBTyxJQURYOztBQUVBLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxxQkFBZixFQUFxQyxTQUFTO0FBQUE7QUFBQSxXQUE5QztBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZjtBQUNFLHVDQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBSyxxQ0FBdEM7QUFERixTQURGO0FBSUU7QUFBQTtBQUFBLFlBQUssSUFBRyxRQUFSLEVBQWlCLFdBQVUseUJBQTNCO0FBQ0U7QUFBQTtBQUFBLGNBQUssV0FBVSxLQUFmO0FBQ0U7QUFBQTtBQUFBLGdCQUFHLFdBQVUsa0NBQWI7QUFBZ0Q7QUFBQTtBQUFBLGtCQUFLLFdBQVUsWUFBZixFQUE0QixTQUFTO0FBQUEsMkJBQUlBLEVBQUtKLEtBQUwsQ0FBV0ssR0FBWCxDQUFlSCxFQUFPSSxjQUF0QixDQUFKO0FBQUEsbUJBQXJDO0FBQWlGSixrQkFBT0k7QUFBeEY7QUFBaEQ7QUFERixXQURGO0FBSUU7QUFBQTtBQUFBLGNBQUssV0FBVSxjQUFmO0FBQWdDSixjQUFPSyxNQUFQLEtBQWtCLElBQW5CLEdBQTJCTCxFQUFPSSxjQUFQLEdBQXdCLHlCQUFuRCxHQUErRUosRUFBT0ksY0FBUCxHQUF3QixhQUF4QixHQUF3Q0osRUFBT0s7QUFBN0osV0FKRjtBQUtFO0FBQUE7QUFBQSxjQUFLLFdBQVUsY0FBZjtBQUFnQ0wsY0FBT00sS0FBUCxLQUFpQixJQUFsQixHQUEwQk4sRUFBT0ksY0FBUCxHQUF3Qiw4QkFBbEQsR0FBbUZKLEVBQU9JLGNBQVAsR0FBd0IsZ0JBQXhCLEdBQTJDSixFQUFPTTtBQUFwSztBQUxGO0FBSkYsT0FERjtBQWNEOzs7O0VBdENrQ0MsTUFBTUMsUzs7QUEwQzNDQyxPQUFPWixzQkFBUCxHQUFnQ0Esc0JBQWhDIiwiZmlsZSI6IlNpbmdsZU1vdmllUmF0aW5nRW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgcmF0aW5nOiBwcm9wcy5yYXRpbmdcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2xpY2soYnVkZHkpIHtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMpXHJcbiAgICAvLyB0aGlzLnByb3BzLmZvZihidWRkeSk7XHJcbiAgICAvLyB0aGlzLnByb3BzLmNoYW5nZSgnc2luZ2xlRnJpZW5kJywgdGhpcy5zdGF0ZS5yYXRpbmcuZnJpZW5kVXNlck5hbWUpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgLy9ub3RlLCBvbiBjbGljayBvZiBwb3J0cmFpdCwgbmFtZSwgcmV2aWV3XHJcbiAgICAvL3Nob3VsZCBiZSBhYmxlIHRvIHNlZSBhbGwgdGhlIG1vdmllcyByZXZpZXdlZCBieSBmcmllbmRcclxuICAgIC8vb24gc2VuZCB3YXRjaCByZXF1ZXN0IGNsaWNrLCBzaG91bGQgc2VuZCBhIHdhdGNoIHJlcXVlc3RcclxuICAgIGxldCByYXRpbmcgPSB0aGlzLnN0YXRlLnJhdGluZztcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sbGVjdGlvbi1pdGVtIHJvd1wiIG9uQ2xpY2s9eygpPT4gY29uc29sZS5sb2codGhhdC5wcm9wcyl9PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XHJcbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0ncHJvZmlsZXRodW1uYWlsJyBzcmM9eydodHRwczovL3Vuc3BsYXNoLml0LzE3MC8xNzAvP3JhbmRvbSd9Lz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGlkPVwiRnJpZW5kXCIgY2xhc3NOYW1lPVwiTW92aWVFbnRyeUZyaWVuZCBjb2wgczlcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9wXCI+XHJcbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT0nZnJpZW5kRW50cnlJbmRpdmlkdWFsIGluZGl2aWR1YWwnPjxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kTmFtZVwiIG9uQ2xpY2s9eygpPT50aGF0LnByb3BzLmZvZihyYXRpbmcuZnJpZW5kVXNlck5hbWUpfT57cmF0aW5nLmZyaWVuZFVzZXJOYW1lfTwvZGl2PjwvYT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmllbmRSZXZpZXdcIj57KHJhdGluZy5yZXZpZXcgPT09IG51bGwpID8gcmF0aW5nLmZyaWVuZFVzZXJOYW1lICsgJyBkaWQgbm90IGxlYXZlIGEgcmV2aWV3JyA6IHJhdGluZy5mcmllbmRVc2VyTmFtZSArIFwiJ3MgcmV2aWV3OiBcIiArIHJhdGluZy5yZXZpZXd9PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyaWVuZFJhdGluZ1wiPnsocmF0aW5nLnNjb3JlID09PSBudWxsKSA/IHJhdGluZy5mcmllbmRVc2VyTmFtZSArICcgaGF2ZSBub3QgcmF0ZSB0aGUgbW92aWUgeWV0JyA6IHJhdGluZy5mcmllbmRVc2VyTmFtZSArIFwiJ3MgcmF0aW5nIGlzOiBcIiArIHJhdGluZy5zY29yZX08L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbndpbmRvdy5TaW5nbGVNb3ZpZVJhdGluZ0VudHJ5ID0gU2luZ2xlTW92aWVSYXRpbmdFbnRyeTtcclxuXHJcbiJdfQ==