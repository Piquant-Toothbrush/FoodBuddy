"use strict";

var FriendEntry = function FriendEntry(_ref) {
  var a = _ref.Friend,
      b = _ref.fof,
      c = _ref.Comp;
  return React.createElement(
    "div",
    { className: "FriendEntry collection-item row" },
    React.createElement(
      "div",
      { className: "col s3" },
      React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
    ),
    React.createElement(
      "div",
      { id: "Friend", className: "friendEntry col s9" },
      React.createElement(
        "a",
        { className: "friendEntryIndividual" },
        React.createElement(
          "h3",
          { className: "friendName", onClick: function onClick() {
              b(a);
            } },
          a
        )
      ),
      React.createElement(
        "div",
        { className: "friendEntryCompatability" },
        "Compatability: ",
        c === 'No comparison to be made' ? 'No comparison to be made' : c + '%'
      )
    )
  );
};

window.FriendEntry = FriendEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZEVudHJ5Vmlldy5qcyJdLCJuYW1lcyI6WyJGcmllbmRFbnRyeSIsIkZyaWVuZCIsImZvZiIsIkNvbXAiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsY0FBYyxTQUFkQSxXQUFjO0FBQUEsTUFBRUMsQ0FBRixRQUFFQSxNQUFGO0FBQUEsTUFBVUMsQ0FBVixRQUFVQSxHQUFWO0FBQUEsTUFBZUMsQ0FBZixRQUFlQSxJQUFmO0FBQUEsU0FDbEI7QUFBQTtBQUFBLE1BQUssV0FBVSxpQ0FBZjtBQUNDO0FBQUE7QUFBQSxRQUFLLFdBQVUsUUFBZjtBQUNDLG1DQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBSyxxQ0FBdEM7QUFERCxLQUREO0FBSUU7QUFBQTtBQUFBLFFBQUssSUFBRyxRQUFSLEVBQWlCLFdBQVUsb0JBQTNCO0FBQ0M7QUFBQTtBQUFBLFVBQUcsV0FBVSx1QkFBYjtBQUFxQztBQUFBO0FBQUEsWUFBSSxXQUFVLFlBQWQsRUFBMkIsU0FBUyxtQkFBSTtBQUFDRCxnQkFBSUQsQ0FBSjtBQUFZLGFBQXJEO0FBQXdEQTtBQUF4RDtBQUFyQyxPQUREO0FBRUM7QUFBQTtBQUFBLFVBQUssV0FBVSwwQkFBZjtBQUFBO0FBQTJERSxjQUFTLDBCQUFULEdBQXNDLDBCQUF0QyxHQUFtRUEsSUFBTztBQUFySTtBQUZEO0FBSkYsR0FEa0I7QUFBQSxDQUFwQjs7QUFZQUMsT0FBT0osV0FBUCxHQUFxQkEsV0FBckIiLCJmaWxlIjoiRnJpZW5kRW50cnlWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRnJpZW5kRW50cnkgPSAoe0ZyaWVuZCwgZm9mLCBDb21wIH0pID0+ICAoXHJcbiAgPGRpdiBjbGFzc05hbWU9XCJGcmllbmRFbnRyeSBjb2xsZWN0aW9uLWl0ZW0gcm93XCIgPlxyXG4gIFx0PGRpdiBjbGFzc05hbWU9XCJjb2wgczNcIj5cclxuICBcdFx0PGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XHJcbiAgXHQ8L2Rpdj5cclxuICAgIDxkaXYgaWQ9XCJGcmllbmRcIiBjbGFzc05hbWU9XCJmcmllbmRFbnRyeSBjb2wgczlcIj5cclxuICAgIFx0PGEgY2xhc3NOYW1lPSdmcmllbmRFbnRyeUluZGl2aWR1YWwnPjxoMyBjbGFzc05hbWU9XCJmcmllbmROYW1lXCIgb25DbGljaz17KCk9Pntmb2YoRnJpZW5kKX19PntGcmllbmR9PC9oMz48L2E+ICBcclxuICAgIFx0PGRpdiBjbGFzc05hbWU9XCJmcmllbmRFbnRyeUNvbXBhdGFiaWxpdHlcIiA+Q29tcGF0YWJpbGl0eToge0NvbXAgPT09ICdObyBjb21wYXJpc29uIHRvIGJlIG1hZGUnID8gJ05vIGNvbXBhcmlzb24gdG8gYmUgbWFkZScgOiBDb21wICsgJyUnfTwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbik7XHJcblxyXG53aW5kb3cuRnJpZW5kRW50cnkgPSBGcmllbmRFbnRyeTsiXX0=