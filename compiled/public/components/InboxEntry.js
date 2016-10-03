"use strict";

var InboxEntry = function InboxEntry(_ref) {
  var a = _ref.inboxName,
      b = _ref.accept,
      c = _ref.requestMovie,
      d = _ref.decline,
      e = _ref.requestType,
      f = _ref.messageInfo;
  return React.createElement(
    "div",
    { className: "InboxEntry Reponses collection-item row" },
    React.createElement(
      "div",
      { className: "col s3" },
      React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
    ),
    React.createElement(
      "div",
      { className: "response col s9" },
      React.createElement(
        "span",
        { className: "inboxFriend" },
        " Name:",
        a,
        React.createElement(
          "a",
          { className: "waves-effect waves-light btn accept", onClick: function onClick() {
              b(a, c);
            } },
          "Accept ",
          a,
          "'s ",
          e,
          " request ",
          c
        ),
        React.createElement(
          "a",
          { className: "waves-effect waves-light btn decline", onClick: function onClick() {
              d(a, c);
            } },
          "Decline ",
          a,
          "'s ",
          e,
          " request ",
          c
        )
      ),
      React.createElement("br", null),
      " Message:",
      f === null ? 'No message' : f
    )
  );
};

window.InboxEntry = InboxEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94RW50cnkuanN4Il0sIm5hbWVzIjpbIkluYm94RW50cnkiLCJpbmJveE5hbWUiLCJhY2NlcHQiLCJyZXF1ZXN0TW92aWUiLCJkZWNsaW5lIiwicmVxdWVzdFR5cGUiLCJtZXNzYWdlSW5mbyIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxhQUFhLFNBQWJBLFVBQWE7QUFBQSxNQUFFQyxDQUFGLFFBQUVBLFNBQUY7QUFBQSxNQUFhQyxDQUFiLFFBQWFBLE1BQWI7QUFBQSxNQUFxQkMsQ0FBckIsUUFBcUJBLFlBQXJCO0FBQUEsTUFBbUNDLENBQW5DLFFBQW1DQSxPQUFuQztBQUFBLE1BQTRDQyxDQUE1QyxRQUE0Q0EsV0FBNUM7QUFBQSxNQUF5REMsQ0FBekQsUUFBeURBLFdBQXpEO0FBQUEsU0FDbkI7QUFBQTtBQUFBLE1BQUssV0FBVSx5Q0FBZjtBQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsUUFBZjtBQUNFLG1DQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBTSxxQ0FBdkM7QUFERixLQURGO0FBSUU7QUFBQTtBQUFBLFFBQUssV0FBVSxpQkFBZjtBQUNFO0FBQUE7QUFBQSxVQUFNLFdBQVUsYUFBaEI7QUFBQTtBQUFxQ0wsU0FBckM7QUFDSTtBQUFBO0FBQUEsWUFBRyxXQUFVLHFDQUFiLEVBQW1ELFNBQVMsbUJBQUk7QUFBQ0MsZ0JBQU9ELENBQVAsRUFBa0JFLENBQWxCO0FBQWdDLGFBQWpHO0FBQUE7QUFDUUYsV0FEUjtBQUFBO0FBQ3NCSSxXQUR0QjtBQUFBO0FBQzRDRjtBQUQ1QyxTQURKO0FBR0k7QUFBQTtBQUFBLFlBQUcsV0FBVSxzQ0FBYixFQUFvRCxTQUFTLG1CQUFJO0FBQUNDLGdCQUFRSCxDQUFSLEVBQW1CRSxDQUFuQjtBQUFpQyxhQUFuRztBQUFBO0FBQ1NGLFdBRFQ7QUFBQTtBQUN1QkksV0FEdkI7QUFBQTtBQUM2Q0Y7QUFEN0M7QUFISixPQURGO0FBTUUscUNBTkY7QUFBQTtBQU1pQkcsWUFBZ0IsSUFBaEIsR0FBdUIsWUFBdkIsR0FBc0NBO0FBTnZEO0FBSkYsR0FEbUI7QUFBQSxDQUFuQjs7QUFpQkFDLE9BQU9QLFVBQVAsR0FBb0JBLFVBQXBCIiwiZmlsZSI6IkluYm94RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBJbmJveEVudHJ5ID0gKHtpbmJveE5hbWUsIGFjY2VwdCwgcmVxdWVzdE1vdmllLCBkZWNsaW5lLCByZXF1ZXN0VHlwZSwgbWVzc2FnZUluZm99KSA9PiAoXHJcbjxkaXYgY2xhc3NOYW1lPVwiSW5ib3hFbnRyeSBSZXBvbnNlcyBjb2xsZWN0aW9uLWl0ZW0gcm93XCI+XHJcbiAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczNcIj5cclxuICAgIDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17ICdodHRwczovL3Vuc3BsYXNoLml0LzE3MC8xNzAvP3JhbmRvbSd9Lz5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzTmFtZT1cInJlc3BvbnNlIGNvbCBzOVwiPlxyXG4gICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5ib3hGcmllbmRcIj4gTmFtZTp7aW5ib3hOYW1lfSBcclxuICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuIGFjY2VwdFwiIG9uQ2xpY2s9eygpPT57YWNjZXB0KGluYm94TmFtZSwgcmVxdWVzdE1vdmllKX19PiBcclxuICAgICAgICBBY2NlcHQge2luYm94TmFtZX0ncyB7cmVxdWVzdFR5cGV9IHJlcXVlc3Qge3JlcXVlc3RNb3ZpZX08L2E+XHJcbiAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0biBkZWNsaW5lXCIgb25DbGljaz17KCk9PntkZWNsaW5lKGluYm94TmFtZSwgcmVxdWVzdE1vdmllKX19PlxyXG4gICAgICAgIERlY2xpbmUge2luYm94TmFtZX0ncyB7cmVxdWVzdFR5cGV9IHJlcXVlc3Qge3JlcXVlc3RNb3ZpZX08L2E+PC9zcGFuPlxyXG4gICAgPGJyLz4gTWVzc2FnZTp7bWVzc2FnZUluZm8gPT09IG51bGwgPyAnTm8gbWVzc2FnZScgOiBtZXNzYWdlSW5mb31cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcblxyXG4pO1xyXG5cclxud2luZG93LkluYm94RW50cnkgPSBJbmJveEVudHJ5OyJdfQ==