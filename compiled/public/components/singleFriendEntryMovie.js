"use strict";

var FriendMovieEntry = function FriendMovieEntry(_ref) {
  var a = _ref.name,
      b = _ref.rating,
      c = _ref.review;


  return React.createElement(
    "div",
    { className: "FriendMovieEntry" },
    React.createElement(
      "h2",
      null,
      "Title:",
      a
    ),
    React.createElement("br", null),
    React.createElement(
      "h3",
      null,
      "Rating:",
      b
    ),
    React.createElement("br", null),
    React.createElement(
      "p",
      null,
      React.createElement(
        "i",
        null,
        "Comments:",
        c
      )
    ),
    React.createElement("br", null)
  );
};

window.FriendMovieEntry = FriendMovieEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL3NpbmdsZUZyaWVuZEVudHJ5TW92aWUuanN4Il0sIm5hbWVzIjpbIkZyaWVuZE1vdmllRW50cnkiLCJuYW1lIiwicmF0aW5nIiwicmV2aWV3Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLG1CQUFtQixTQUFuQkEsZ0JBQW1CLE9BQTRCO0FBQUEsTUFBMUJDLENBQTBCLFFBQTFCQSxJQUEwQjtBQUFBLE1BQXBCQyxDQUFvQixRQUFwQkEsTUFBb0I7QUFBQSxNQUFaQyxDQUFZLFFBQVpBLE1BQVk7OztBQUdqRCxTQUNBO0FBQUE7QUFBQSxNQUFLLFdBQVUsa0JBQWY7QUFDQztBQUFBO0FBQUE7QUFBQTtBQUFXRjtBQUFYLEtBREQ7QUFDc0IsbUNBRHRCO0FBRUM7QUFBQTtBQUFBO0FBQUE7QUFBWUM7QUFBWixLQUZEO0FBRXlCLG1DQUZ6QjtBQUdDO0FBQUE7QUFBQTtBQUFHO0FBQUE7QUFBQTtBQUFBO0FBQWFDO0FBQWI7QUFBSCxLQUhEO0FBR2dDO0FBSGhDLEdBREE7QUFNQSxDQVRGOztBQVdBQyxPQUFPSixnQkFBUCxHQUEwQkEsZ0JBQTFCIiwiZmlsZSI6InNpbmdsZUZyaWVuZEVudHJ5TW92aWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRnJpZW5kTW92aWVFbnRyeSA9ICh7bmFtZSwgcmF0aW5nLCByZXZpZXd9KSA9PiB7XHJcblxyXG5cclxuICByZXR1cm4gKFxyXG4gIDxkaXYgY2xhc3NOYW1lPVwiRnJpZW5kTW92aWVFbnRyeVwiPlxyXG4gICA8aDI+VGl0bGU6e25hbWV9PC9oMj48YnIvPlxyXG4gICA8aDM+UmF0aW5nOntyYXRpbmd9PC9oMz48YnIvPlxyXG4gICA8cD48aT5Db21tZW50czp7cmV2aWV3fTwvaT48L3A+PGJyLz5cclxuICA8L2Rpdj5cclxuKX07XHJcblxyXG53aW5kb3cuRnJpZW5kTW92aWVFbnRyeSA9IEZyaWVuZE1vdmllRW50cnk7Il19