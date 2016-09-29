"use strict";

var Nav = function Nav(_ref) {
  var a = _ref.onClick,
      b = _ref.Home,
      c = _ref.find,
      d = _ref.logout,
      e = _ref.name;
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "navbar-fixed movieBuddyNav" },
      React.createElement(
        "nav",
        null,
        React.createElement(
          "div",
          { className: "nav-wrapper" },
          React.createElement(
            "a",
            { href: "#", onClick: function onClick() {
                return a("Home");
              }, className: "brand-logo center" },
            "ReelPals"
          ),
          React.createElement(
            "ul",
            { id: "nav-mobile", className: "left hide-on-med-and-down" },
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { className: b === !0 ? "active" : "", onClick: function onClick() {
                    return a("Home");
                  } },
                "Home"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: function onClick() {
                    return a("MyRatings");
                  } },
                "My Ratings"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: function onClick() {
                    return a("Friends");
                  } },
                "My Friends"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: c },
                "New Buddies"
              )
            )
          ),
          React.createElement(
            "ul",
            { id: "nav-mobile", className: "right hide-on-med-and-down" },
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: d },
                "Log Out"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: function onClick() {
                    return a("Inbox");
                  } },
                "Notifications"
              )
            )
          )
        )
      )
    ),
    React.createElement(
      "div",
      { className: "headBand" },
      React.createElement(
        "h3",
        null,
        "Hi, ",
        e,
        "!"
      )
    )
  );
};

window.Nav = Nav;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL05hdi5qcyJdLCJuYW1lcyI6WyJOYXYiLCJvbkNsaWNrIiwiSG9tZSIsImZpbmQiLCJsb2dvdXQiLCJuYW1lIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLE1BQU0sU0FBTkEsR0FBTTtBQUFBLE1BQUVDLENBQUYsUUFBRUEsT0FBRjtBQUFBLE1BQVdDLENBQVgsUUFBV0EsSUFBWDtBQUFBLE1BQWlCQyxDQUFqQixRQUFpQkEsSUFBakI7QUFBQSxNQUF1QkMsQ0FBdkIsUUFBdUJBLE1BQXZCO0FBQUEsTUFBK0JDLENBQS9CLFFBQStCQSxJQUEvQjtBQUFBLFNBQ1I7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSw0QkFBZjtBQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsYUFBZjtBQUNFO0FBQUE7QUFBQSxjQUFHLE1BQUssR0FBUixFQUFZLFNBQVM7QUFBQSx1QkFBT0osRUFBUSxNQUFSLENBQVA7QUFBQSxlQUFyQixFQUE4QyxXQUFVLG1CQUF4RDtBQUFBO0FBQUEsV0FERjtBQUVFO0FBQUE7QUFBQSxjQUFJLElBQUcsWUFBUCxFQUFvQixXQUFVLDJCQUE5QjtBQUNFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxXQUFZQyxRQUFELEdBQWtCLFFBQWxCLEdBQTZCLEVBQTNDLEVBQStDLFNBQVM7QUFBQSwyQkFBT0QsRUFBUSxNQUFSLENBQVA7QUFBQSxtQkFBeEQ7QUFBQTtBQUFBO0FBQUosYUFERjtBQUVFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxTQUFTO0FBQUEsMkJBQU9BLEVBQVEsV0FBUixDQUFQO0FBQUEsbUJBQVo7QUFBQTtBQUFBO0FBQUosYUFGRjtBQUdFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxTQUFTO0FBQUEsMkJBQU9BLEVBQVEsU0FBUixDQUFQO0FBQUEsbUJBQVo7QUFBQTtBQUFBO0FBQUosYUFIRjtBQUlFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxTQUFTRSxDQUFaO0FBQUE7QUFBQTtBQUFKO0FBSkYsV0FGRjtBQVFFO0FBQUE7QUFBQSxjQUFJLElBQUcsWUFBUCxFQUFvQixXQUFVLDRCQUE5QjtBQUNFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxTQUFTQyxDQUFaO0FBQUE7QUFBQTtBQUFKLGFBREY7QUFFRTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUEsa0JBQUcsU0FBUztBQUFBLDJCQUFPSCxFQUFRLE9BQVIsQ0FBUDtBQUFBLG1CQUFaO0FBQUE7QUFBQTtBQUFKO0FBRkY7QUFSRjtBQURGO0FBREYsS0FERjtBQWtCRTtBQUFBO0FBQUEsUUFBSyxXQUFVLFVBQWY7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFTSSxTQUFUO0FBQUE7QUFBQTtBQURGO0FBbEJGLEdBRFE7QUFBQSxDQUFaOztBQXlCQUMsT0FBT04sR0FBUCxHQUFhQSxHQUFiIiwiZmlsZSI6Ik5hdi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE5hdiA9ICh7b25DbGljaywgSG9tZSwgZmluZCwgbG9nb3V0LCBuYW1lfSkgPT4gKFxyXG4gICAgPGRpdj5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItZml4ZWQgbW92aWVCdWRkeU5hdlwiPlxyXG4gICAgICAgIDxuYXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdi13cmFwcGVyXCI+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gKG9uQ2xpY2soXCJIb21lXCIpKX0gY2xhc3NOYW1lPVwiYnJhbmQtbG9nbyBjZW50ZXJcIj5SZWVsUGFsczwvYT5cclxuICAgICAgICAgICAgPHVsIGlkPVwibmF2LW1vYmlsZVwiIGNsYXNzTmFtZT1cImxlZnQgaGlkZS1vbi1tZWQtYW5kLWRvd25cIj5cclxuICAgICAgICAgICAgICA8bGk+PGEgY2xhc3NOYW1lPXsoSG9tZSA9PT0gdHJ1ZSkgPyBcImFjdGl2ZVwiIDogXCJcIn0gb25DbGljaz17KCkgPT4gKG9uQ2xpY2soXCJIb21lXCIpKX0+SG9tZTwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBvbkNsaWNrPXsoKSA9PiAob25DbGljayhcIk15UmF0aW5nc1wiKSl9Pk15IFJhdGluZ3M8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgb25DbGljaz17KCkgPT4gKG9uQ2xpY2soXCJGcmllbmRzXCIpKX0+TXkgRnJpZW5kczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBvbkNsaWNrPXtmaW5kfT5OZXcgQnVkZGllczwvYT48L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8dWwgaWQ9XCJuYXYtbW9iaWxlXCIgY2xhc3NOYW1lPVwicmlnaHQgaGlkZS1vbi1tZWQtYW5kLWRvd25cIj5cclxuICAgICAgICAgICAgICA8bGk+PGEgb25DbGljaz17bG9nb3V0fT5Mb2cgT3V0PC9hPjwvbGk+ICAgICAgXHJcbiAgICAgICAgICAgICAgPGxpPjxhIG9uQ2xpY2s9eygpID0+IChvbkNsaWNrKFwiSW5ib3hcIikpfT5Ob3RpZmljYXRpb25zPC9hPjwvbGk+ICAgICBcclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbmF2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkQmFuZFwiPlxyXG4gICAgICAgIDxoMz5IaSwge25hbWV9ITwvaDM+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbik7XHJcblxyXG53aW5kb3cuTmF2ID0gTmF2O1xyXG4iXX0=