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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL05hdi5qc3giXSwibmFtZXMiOlsiTmF2Iiwib25DbGljayIsIkhvbWUiLCJmaW5kIiwibG9nb3V0IiwibmFtZSIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxNQUFNLFNBQU5BLEdBQU07QUFBQSxNQUFFQyxDQUFGLFFBQUVBLE9BQUY7QUFBQSxNQUFXQyxDQUFYLFFBQVdBLElBQVg7QUFBQSxNQUFpQkMsQ0FBakIsUUFBaUJBLElBQWpCO0FBQUEsTUFBdUJDLENBQXZCLFFBQXVCQSxNQUF2QjtBQUFBLE1BQStCQyxDQUEvQixRQUErQkEsSUFBL0I7QUFBQSxTQUNSO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsNEJBQWY7QUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFDRTtBQUFBO0FBQUEsY0FBRyxNQUFLLEdBQVIsRUFBWSxTQUFTO0FBQUEsdUJBQU9KLEVBQVEsTUFBUixDQUFQO0FBQUEsZUFBckIsRUFBOEMsV0FBVSxtQkFBeEQ7QUFBQTtBQUFBLFdBREY7QUFFRTtBQUFBO0FBQUEsY0FBSSxJQUFHLFlBQVAsRUFBb0IsV0FBVSwyQkFBOUI7QUFDRTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUEsa0JBQUcsV0FBWUMsUUFBRCxHQUFrQixRQUFsQixHQUE2QixFQUEzQyxFQUErQyxTQUFTO0FBQUEsMkJBQU9ELEVBQVEsTUFBUixDQUFQO0FBQUEsbUJBQXhEO0FBQUE7QUFBQTtBQUFKLGFBREY7QUFFRTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUEsa0JBQUcsU0FBUztBQUFBLDJCQUFPQSxFQUFRLFdBQVIsQ0FBUDtBQUFBLG1CQUFaO0FBQUE7QUFBQTtBQUFKLGFBRkY7QUFHRTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUEsa0JBQUcsU0FBUztBQUFBLDJCQUFPQSxFQUFRLFNBQVIsQ0FBUDtBQUFBLG1CQUFaO0FBQUE7QUFBQTtBQUFKLGFBSEY7QUFJRTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUEsa0JBQUcsU0FBU0UsQ0FBWjtBQUFBO0FBQUE7QUFBSjtBQUpGLFdBRkY7QUFRRTtBQUFBO0FBQUEsY0FBSSxJQUFHLFlBQVAsRUFBb0IsV0FBVSw0QkFBOUI7QUFDRTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUEsa0JBQUcsU0FBU0MsQ0FBWjtBQUFBO0FBQUE7QUFBSixhQURGO0FBRUU7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFNBQVM7QUFBQSwyQkFBT0gsRUFBUSxPQUFSLENBQVA7QUFBQSxtQkFBWjtBQUFBO0FBQUE7QUFBSjtBQUZGO0FBUkY7QUFERjtBQURGLEtBREY7QUFrQkU7QUFBQTtBQUFBLFFBQUssV0FBVSxVQUFmO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBU0ksU0FBVDtBQUFBO0FBQUE7QUFERjtBQWxCRixHQURRO0FBQUEsQ0FBWjs7QUF5QkFDLE9BQU9OLEdBQVAsR0FBYUEsR0FBYiIsImZpbGUiOiJOYXYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBOYXYgPSAoe29uQ2xpY2ssIEhvbWUsIGZpbmQsIGxvZ291dCwgbmFtZX0pID0+IChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWZpeGVkIG1vdmllQnVkZHlOYXZcIj5cclxuICAgICAgICA8bmF2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXYtd3JhcHBlclwiPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9eygpID0+IChvbkNsaWNrKFwiSG9tZVwiKSl9IGNsYXNzTmFtZT1cImJyYW5kLWxvZ28gY2VudGVyXCI+UmVlbFBhbHM8L2E+XHJcbiAgICAgICAgICAgIDx1bCBpZD1cIm5hdi1tb2JpbGVcIiBjbGFzc05hbWU9XCJsZWZ0IGhpZGUtb24tbWVkLWFuZC1kb3duXCI+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGNsYXNzTmFtZT17KEhvbWUgPT09IHRydWUpID8gXCJhY3RpdmVcIiA6IFwiXCJ9IG9uQ2xpY2s9eygpID0+IChvbkNsaWNrKFwiSG9tZVwiKSl9PkhvbWU8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgb25DbGljaz17KCkgPT4gKG9uQ2xpY2soXCJNeVJhdGluZ3NcIikpfT5NeSBSYXRpbmdzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIG9uQ2xpY2s9eygpID0+IChvbkNsaWNrKFwiRnJpZW5kc1wiKSl9Pk15IEZyaWVuZHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgb25DbGljaz17ZmluZH0+TmV3IEJ1ZGRpZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPHVsIGlkPVwibmF2LW1vYmlsZVwiIGNsYXNzTmFtZT1cInJpZ2h0IGhpZGUtb24tbWVkLWFuZC1kb3duXCI+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIG9uQ2xpY2s9e2xvZ291dH0+TG9nIE91dDwvYT48L2xpPiAgICAgIFxyXG4gICAgICAgICAgICAgIDxsaT48YSBvbkNsaWNrPXsoKSA9PiAob25DbGljayhcIkluYm94XCIpKX0+Tm90aWZpY2F0aW9uczwvYT48L2xpPiAgICAgXHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L25hdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZEJhbmRcIj5cclxuICAgICAgICA8aDM+SGksIHtuYW1lfSE8L2gzPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG5cclxud2luZG93Lk5hdiA9IE5hdjtcclxuIl19