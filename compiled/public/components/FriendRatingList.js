'use strict';

var FriendRatingList = function FriendRatingList(_ref) {
  var a = _ref.friendRatings,
      b = _ref.getFriendMovieRatings;
  return React.createElement(
    'div',
    { className: 'friendRating-list' },
    React.createElement(
      'div',
      { id: 'inputAndButton' },
      React.createElement('input', { type: 'text', name: 'movie', id: 'movieToView' }),
      React.createElement(
        'button',
        { type: 'submit', onClick: b },
        'Click Me'
      )
    ),
    a.map(function (c) {
      return React.createElement(FriendRatingListEntry, { rating: c.rating, name: c.name });
    })
  );
};

window.FriendRatingList = FriendRatingList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZFJhdGluZ0xpc3QuanN4Il0sIm5hbWVzIjpbIkZyaWVuZFJhdGluZ0xpc3QiLCJmcmllbmRSYXRpbmdzIiwiZ2V0RnJpZW5kTW92aWVSYXRpbmdzIiwibWFwIiwiZnJpZW5kUmF0aW5nIiwicmF0aW5nIiwibmFtZSIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxtQkFBbUIsU0FBbkJBLGdCQUFtQjtBQUFBLE1BQUVDLENBQUYsUUFBRUEsYUFBRjtBQUFBLE1BQWlCQyxDQUFqQixRQUFpQkEscUJBQWpCO0FBQUEsU0FDckI7QUFBQTtBQUFBLE1BQUssV0FBVSxtQkFBZjtBQUNFO0FBQUE7QUFBQSxRQUFLLElBQUcsZ0JBQVI7QUFBeUIscUNBQU8sTUFBSyxNQUFaLEVBQW1CLE1BQUssT0FBeEIsRUFBZ0MsSUFBRyxhQUFuQyxHQUF6QjtBQUNBO0FBQUE7QUFBQSxVQUFRLE1BQUssUUFBYixFQUFzQixTQUFTQSxDQUEvQjtBQUFBO0FBQUE7QUFEQSxLQURGO0FBR0dELE1BQWNFLEdBQWQsQ0FBa0I7QUFBQSxhQUFnQixvQkFBQyxxQkFBRCxJQUF1QixRQUFRQyxFQUFhQyxNQUE1QyxFQUFvRCxNQUFNRCxFQUFhRSxJQUF2RSxHQUFoQjtBQUFBLEtBQWxCO0FBSEgsR0FEcUI7QUFBQSxDQUF2Qjs7QUFRQUMsT0FBT1AsZ0JBQVAsR0FBMEJBLGdCQUExQiIsImZpbGUiOiJGcmllbmRSYXRpbmdMaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEZyaWVuZFJhdGluZ0xpc3QgPSAoe2ZyaWVuZFJhdGluZ3MsIGdldEZyaWVuZE1vdmllUmF0aW5nc30pID0+IChcclxuICA8ZGl2IGNsYXNzTmFtZT1cImZyaWVuZFJhdGluZy1saXN0XCI+XHJcbiAgICA8ZGl2IGlkPSdpbnB1dEFuZEJ1dHRvbic+PGlucHV0IHR5cGU9J3RleHQnIG5hbWU9J21vdmllJyBpZD1cIm1vdmllVG9WaWV3XCIvPlxyXG4gICAgPGJ1dHRvbiB0eXBlPSdzdWJtaXQnIG9uQ2xpY2s9e2dldEZyaWVuZE1vdmllUmF0aW5nc30+Q2xpY2sgTWU8L2J1dHRvbj48L2Rpdj5cclxuICAgIHtmcmllbmRSYXRpbmdzLm1hcChmcmllbmRSYXRpbmcgPT4gPEZyaWVuZFJhdGluZ0xpc3RFbnRyeSByYXRpbmc9e2ZyaWVuZFJhdGluZy5yYXRpbmd9IG5hbWU9e2ZyaWVuZFJhdGluZy5uYW1lfS8+KX1cclxuICA8L2Rpdj5cclxuKTtcclxuXHJcbndpbmRvdy5GcmllbmRSYXRpbmdMaXN0ID0gRnJpZW5kUmF0aW5nTGlzdDsiXX0=