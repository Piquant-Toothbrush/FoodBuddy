"use strict";

var Friends = function Friends(_ref) {
  var a = _ref.fof,
      b = _ref.sendRequest,
      c = _ref.sendWatchRequest,
      d = _ref.myFriends;
  return React.createElement(
    "div",
    { className: "myFriends collection" },
    React.createElement("div", { className: "header" }),
    React.createElement(
      "div",
      { className: "errorMsg", style: { display: 'none' }, id: "enterRealFriend" },
      "Please enter something!"
    ),
    React.createElement(
      "div",
      { className: "updateMsg", style: { display: 'none' }, id: "reqSent" },
      "Request sent!"
    ),
    React.createElement("br", null),
    React.createElement(
      "div",
      { className: "errorMsg", style: { display: 'none' }, id: "AlreadyReq" },
      "Youve already sent a request to this user!"
    ),
    React.createElement("br", null),
    React.createElement("br", null),
    React.createElement(
      "h5",
      { className: "header lable" },
      "Your Friends"
    ),
    d.map(function (e) {
      return React.createElement(FriendEntry, { sendARequest: c, Friend: e[0], Comp: e[1], fof: a });
    })
  );
};

window.Friends = Friends;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZHMuanMiXSwibmFtZXMiOlsiRnJpZW5kcyIsImZvZiIsInNlbmRSZXF1ZXN0Iiwic2VuZFdhdGNoUmVxdWVzdCIsIm15RnJpZW5kcyIsImRpc3BsYXkiLCJtYXAiLCJmcmllbmQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsVUFBVSxTQUFWQSxPQUFVO0FBQUEsTUFBRUMsQ0FBRixRQUFFQSxHQUFGO0FBQUEsTUFBT0MsQ0FBUCxRQUFPQSxXQUFQO0FBQUEsTUFBb0JDLENBQXBCLFFBQW9CQSxnQkFBcEI7QUFBQSxNQUFzQ0MsQ0FBdEMsUUFBc0NBLFNBQXRDO0FBQUEsU0FFZDtBQUFBO0FBQUEsTUFBSyxXQUFVLHNCQUFmO0FBQ0UsaUNBQUssV0FBVSxRQUFmLEdBREY7QUFFRTtBQUFBO0FBQUEsUUFBSyxXQUFVLFVBQWYsRUFBMEIsT0FBTyxFQUFDQyxTQUFTLE1BQVYsRUFBakMsRUFBb0QsSUFBRyxpQkFBdkQ7QUFBQTtBQUFBLEtBRkY7QUFHRTtBQUFBO0FBQUEsUUFBSyxXQUFVLFdBQWYsRUFBMkIsT0FBTyxFQUFDQSxTQUFTLE1BQVYsRUFBbEMsRUFBcUQsSUFBRyxTQUF4RDtBQUFBO0FBQUEsS0FIRjtBQUlFLG1DQUpGO0FBS0U7QUFBQTtBQUFBLFFBQUssV0FBVSxVQUFmLEVBQTBCLE9BQU8sRUFBQ0EsU0FBUyxNQUFWLEVBQWpDLEVBQW9ELElBQUcsWUFBdkQ7QUFBQTtBQUFBLEtBTEY7QUFNRSxtQ0FORjtBQU9FLG1DQVBGO0FBUUU7QUFBQTtBQUFBLFFBQUksV0FBVSxjQUFkO0FBQUE7QUFBQSxLQVJGO0FBU0dELE1BQVVFLEdBQVYsQ0FBYztBQUFBLGFBQ2Qsb0JBQUMsV0FBRCxJQUFhLGNBQWNILENBQTNCLEVBQTZDLFFBQVFJLEVBQU8sQ0FBUCxDQUFyRCxFQUFnRSxNQUFNQSxFQUFPLENBQVAsQ0FBdEUsRUFBaUYsS0FBS04sQ0FBdEYsR0FEYztBQUFBLEtBQWQ7QUFUSCxHQUZjO0FBQUEsQ0FBZDs7QUFrQkFPLE9BQU9SLE9BQVAsR0FBaUJBLE9BQWpCIiwiZmlsZSI6IkZyaWVuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRnJpZW5kcyA9ICh7Zm9mLCBzZW5kUmVxdWVzdCwgc2VuZFdhdGNoUmVxdWVzdCwgbXlGcmllbmRzfSkgPT4gKFxyXG4gXHJcbjxkaXYgY2xhc3NOYW1lPVwibXlGcmllbmRzIGNvbGxlY3Rpb25cIj5cclxuICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJz48L2Rpdj5cclxuICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCIgc3R5bGU9e3tkaXNwbGF5OiAnbm9uZSd9fSBpZD0nZW50ZXJSZWFsRnJpZW5kJz5QbGVhc2UgZW50ZXIgc29tZXRoaW5nITwvZGl2PlxyXG4gIDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlTXNnXCIgc3R5bGU9e3tkaXNwbGF5OiAnbm9uZSd9fSBpZD0ncmVxU2VudCc+UmVxdWVzdCBzZW50ITwvZGl2PlxyXG4gIDxici8+XHJcbiAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiIHN0eWxlPXt7ZGlzcGxheTogJ25vbmUnfX0gaWQ9J0FscmVhZHlSZXEnPllvdXZlIGFscmVhZHkgc2VudCBhIHJlcXVlc3QgdG8gdGhpcyB1c2VyITwvZGl2PlxyXG4gIDxici8+XHJcbiAgPGJyLz5cclxuICA8aDUgY2xhc3NOYW1lPVwiaGVhZGVyIGxhYmxlXCI+WW91ciBGcmllbmRzPC9oNT4gXHJcbiAge215RnJpZW5kcy5tYXAoZnJpZW5kPT4oIFxyXG4gIFx0PEZyaWVuZEVudHJ5IHNlbmRBUmVxdWVzdD17c2VuZFdhdGNoUmVxdWVzdH0gRnJpZW5kPXtmcmllbmRbMF19IENvbXA9e2ZyaWVuZFsxXX0gZm9mPXtmb2Z9IC8+IFxyXG4gICApKX1cclxuPC9kaXY+XHJcblxyXG4pO1xyXG5cclxud2luZG93LkZyaWVuZHMgPSBGcmllbmRzO1xyXG4iXX0=