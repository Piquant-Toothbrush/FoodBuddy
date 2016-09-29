"use strict";

var FindMovieBuddy = function FindMovieBuddy(_ref) {
  var a = _ref.buddyfunc,
      b = _ref.buddies,
      c = b.length === 0 ? "You've friended everybody!" : "";

  return React.createElement(
    "div",
    { className: "movieBuddy collection" },
    React.createElement(
      "div",
      { className: "header" },
      "Find Your Next Movie Buddy"
    ),
    React.createElement("br", null),
    React.createElement(
      "div",
      { className: "findFriend" },
      React.createElement("input", { id: "findFriendByName", placeholder: "Enter friend you'd like to add here here" }),
      React.createElement(
        "a",
        { id: "requestAFriend", className: "waves-effect waves-light btn", onClick: a },
        "send a friend request"
      )
    ),
    React.createElement("br", null),
    React.createElement(
      "div",
      { className: "errorMsg", style: { display: 'none' }, id: "AlreadyReq2" },
      "Youve already sent a request to this user!"
    ),
    React.createElement(
      "div",
      { className: "errorMsg", style: { display: 'none' }, id: "enterRealFriend2" },
      "Please enter something!"
    ),
    React.createElement(
      "div",
      { className: "errorMsg", style: { display: 'none' }, id: "reqSent2" },
      "Request sent!"
    ),
    c,
    b.map(function (d, e) {
      if (d[1] === null) {
        d[1] = 'Nothing to compare';
      }return React.createElement(BuddyEntry, { idx: "view" + e, buddyfunc: a, Buddy: d[0], BuddyScore: d[1] });
    })
  );
};

window.FindMovieBuddy = FindMovieBuddy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2ZpbmRNb3ZpZUJ1ZGR5Vmlldy5qcyJdLCJuYW1lcyI6WyJGaW5kTW92aWVCdWRkeSIsImJ1ZGR5ZnVuYyIsImJ1ZGRpZXMiLCJlbXB0eSIsImxlbmd0aCIsImRpc3BsYXkiLCJtYXAiLCJidWRkeSIsImlkeCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxpQkFBaUIsU0FBakJBLGNBQWlCLE9BQTBCO0FBQUEsTUFBeEJDLENBQXdCLFFBQXhCQSxTQUF3QjtBQUFBLE1BQWJDLENBQWEsUUFBYkEsT0FBYTtBQUFBLE1BQzVDQyxDQUQ0QyxHQUN0Q0QsRUFBUUUsTUFBUixLQUFpQixDQUFqQixHQUFtQiw0QkFBbkIsR0FBZ0QsRUFEVjs7QUFFL0MsU0FDQTtBQUFBO0FBQUEsTUFBSyxXQUFVLHVCQUFmO0FBQ0M7QUFBQTtBQUFBLFFBQUssV0FBVSxRQUFmO0FBQUE7QUFBQSxLQUREO0FBQ3lELG1DQUR6RDtBQUVHO0FBQUE7QUFBQSxRQUFLLFdBQVUsWUFBZjtBQUNELHFDQUFPLElBQUcsa0JBQVYsRUFBNkIsYUFBWSwwQ0FBekMsR0FEQztBQUVEO0FBQUE7QUFBQSxVQUFJLElBQUcsZ0JBQVAsRUFBd0IsV0FBVSw4QkFBbEMsRUFBaUUsU0FBU0gsQ0FBMUU7QUFBQTtBQUFBO0FBRkMsS0FGSDtBQU1HLG1DQU5IO0FBT0E7QUFBQTtBQUFBLFFBQUssV0FBVSxVQUFmLEVBQTBCLE9BQU8sRUFBQ0ksU0FBUyxNQUFWLEVBQWpDLEVBQW9ELElBQUcsYUFBdkQ7QUFBQTtBQUFBLEtBUEE7QUFRQTtBQUFBO0FBQUEsUUFBSyxXQUFVLFVBQWYsRUFBMEIsT0FBTyxFQUFDQSxTQUFTLE1BQVYsRUFBakMsRUFBb0QsSUFBRyxrQkFBdkQ7QUFBQTtBQUFBLEtBUkE7QUFTQTtBQUFBO0FBQUEsUUFBSyxXQUFVLFVBQWYsRUFBMEIsT0FBTyxFQUFDQSxTQUFTLE1BQVYsRUFBakMsRUFBb0QsSUFBRyxVQUF2RDtBQUFBO0FBQUEsS0FUQTtBQVVBRixLQVZBO0FBV0VELE1BQVFJLEdBQVIsQ0FBWSxVQUFDQyxDQUFELEVBQVFDLENBQVIsRUFBYztBQUFFLFVBQUlELEVBQU0sQ0FBTixNQUFXLElBQWYsRUFBcUI7QUFBQ0EsVUFBTSxDQUFOLElBQVMsb0JBQVQ7QUFBOEIsT0FBQyxPQUFRLG9CQUFDLFVBQUQsSUFBWSxLQUFLLFNBQU9DLENBQXhCLEVBQTZCLFdBQVdQLENBQXhDLEVBQW1ELE9BQU9NLEVBQU0sQ0FBTixDQUExRCxFQUFvRSxZQUFZQSxFQUFNLENBQU4sQ0FBaEYsR0FBUjtBQUF1RyxLQUF4TDtBQVhGLEdBREE7QUFnQkEsQ0FsQkY7O0FBb0JBRSxPQUFPVCxjQUFQLEdBQXdCQSxjQUF4QiIsImZpbGUiOiJmaW5kTW92aWVCdWRkeVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBGaW5kTW92aWVCdWRkeSA9ICh7YnVkZHlmdW5jLCBidWRkaWVzfSkgPT4ge1xyXG5cdGxldCBlbXB0eT1idWRkaWVzLmxlbmd0aD09PTA/XCJZb3UndmUgZnJpZW5kZWQgZXZlcnlib2R5IVwiOlwiXCI7XHJcbiAgcmV0dXJuIChcclxuICA8ZGl2IGNsYXNzTmFtZT0nbW92aWVCdWRkeSBjb2xsZWN0aW9uJz5cclxuXHQgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInPkZpbmQgWW91ciBOZXh0IE1vdmllIEJ1ZGR5PC9kaXY+PGJyLz5cclxuICAgICA8ZGl2IGNsYXNzTmFtZT0nZmluZEZyaWVuZCc+XHJcbiAgICA8aW5wdXQgaWQ9J2ZpbmRGcmllbmRCeU5hbWUnIHBsYWNlaG9sZGVyPVwiRW50ZXIgZnJpZW5kIHlvdSdkIGxpa2UgdG8gYWRkIGhlcmUgaGVyZVwiPjwvaW5wdXQ+XHJcbiAgICA8YSAgaWQ9XCJyZXF1ZXN0QUZyaWVuZFwiIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXtidWRkeWZ1bmN9PnNlbmQgYSBmcmllbmQgcmVxdWVzdDwvYT5cclxuICAgIDwvZGl2PlxyXG5cdCAgICA8YnIvPlxyXG4gIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIiBzdHlsZT17e2Rpc3BsYXk6ICdub25lJ319IGlkPSdBbHJlYWR5UmVxMic+WW91dmUgYWxyZWFkeSBzZW50IGEgcmVxdWVzdCB0byB0aGlzIHVzZXIhPC9kaXY+XHJcbiAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiIHN0eWxlPXt7ZGlzcGxheTogJ25vbmUnfX0gaWQ9J2VudGVyUmVhbEZyaWVuZDInPlBsZWFzZSBlbnRlciBzb21ldGhpbmchPC9kaXY+XHJcbiAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiIHN0eWxlPXt7ZGlzcGxheTogJ25vbmUnfX0gaWQ9J3JlcVNlbnQyJz5SZXF1ZXN0IHNlbnQhPC9kaXY+XHJcblx0e2VtcHR5fVxyXG4gICB7YnVkZGllcy5tYXAoKGJ1ZGR5LCBpZHgpPT57IGlmIChidWRkeVsxXT09PW51bGwpIHtidWRkeVsxXT0nTm90aGluZyB0byBjb21wYXJlJ30gcmV0dXJuICg8QnVkZHlFbnRyeSBpZHg9e1widmlld1wiK2lkeH0gYnVkZHlmdW5jPXtidWRkeWZ1bmN9IEJ1ZGR5PXtidWRkeVswXX0gQnVkZHlTY29yZT17YnVkZHlbMV19IC8+ICl9KX1cclxuXHJcbiAgPC9kaXY+XHJcbiAgIFxyXG4pfTtcclxuXHJcbndpbmRvdy5GaW5kTW92aWVCdWRkeSA9IEZpbmRNb3ZpZUJ1ZGR5O1xyXG5cclxuXHJcblxyXG4iXX0=