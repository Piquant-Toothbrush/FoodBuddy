"use strict";

var FindMovieBuddy = function FindMovieBuddy(_ref) {
  var buddyfunc = _ref.buddyfunc;
  var buddies = _ref.buddies;

  var empty = buddies.length === 0 ? "You've friended everybody!" : "";
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
        { className: "waves-effect waves-light btn", onClick: buddyfunc },
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
    empty,
    buddies.map(function (buddy, idx) {
      if (buddy[1] === null) {
        buddy[1] = 'Nothing to compare';
      }return React.createElement(BuddyEntry, { idx: "view" + idx, buddyfunc: buddyfunc, Buddy: buddy[0], BuddyScore: buddy[1] });
    })
  );
};

window.FindMovieBuddy = FindMovieBuddy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2ZpbmRNb3ZpZUJ1ZGR5Vmlldy5qcyJdLCJuYW1lcyI6WyJGaW5kTW92aWVCdWRkeSIsImJ1ZGR5ZnVuYyIsImJ1ZGRpZXMiLCJlbXB0eSIsImxlbmd0aCIsImRpc3BsYXkiLCJtYXAiLCJidWRkeSIsImlkeCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxpQkFBaUIsU0FBakJBLGNBQWlCLE9BQTBCO0FBQUEsTUFBeEJDLFNBQXdCLFFBQXhCQSxTQUF3QjtBQUFBLE1BQWJDLE9BQWEsUUFBYkEsT0FBYTs7QUFDaEQsTUFBSUMsUUFBTUQsUUFBUUUsTUFBUixLQUFpQixDQUFqQixHQUFtQiw0QkFBbkIsR0FBZ0QsRUFBMUQ7QUFDQyxTQUNBO0FBQUE7QUFBQSxNQUFLLFdBQVUsdUJBQWY7QUFDQztBQUFBO0FBQUEsUUFBSyxXQUFVLFFBQWY7QUFBQTtBQUFBLEtBREQ7QUFDeUQsbUNBRHpEO0FBRUc7QUFBQTtBQUFBLFFBQUssV0FBVSxZQUFmO0FBQ0QscUNBQU8sSUFBRyxrQkFBVixFQUE2QixhQUFZLDBDQUF6QyxHQURDO0FBRUQ7QUFBQTtBQUFBLFVBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTSCxTQUFyRDtBQUFBO0FBQUE7QUFGQyxLQUZIO0FBTUcsbUNBTkg7QUFPQTtBQUFBO0FBQUEsUUFBSyxXQUFVLFVBQWYsRUFBMEIsT0FBTyxFQUFDSSxTQUFTLE1BQVYsRUFBakMsRUFBb0QsSUFBRyxhQUF2RDtBQUFBO0FBQUEsS0FQQTtBQVFBO0FBQUE7QUFBQSxRQUFLLFdBQVUsVUFBZixFQUEwQixPQUFPLEVBQUNBLFNBQVMsTUFBVixFQUFqQyxFQUFvRCxJQUFHLGtCQUF2RDtBQUFBO0FBQUEsS0FSQTtBQVNBO0FBQUE7QUFBQSxRQUFLLFdBQVUsVUFBZixFQUEwQixPQUFPLEVBQUNBLFNBQVMsTUFBVixFQUFqQyxFQUFvRCxJQUFHLFVBQXZEO0FBQUE7QUFBQSxLQVRBO0FBVUFGLFNBVkE7QUFXRUQsWUFBUUksR0FBUixDQUFZLFVBQUNDLEtBQUQsRUFBUUMsR0FBUixFQUFjO0FBQUUsVUFBSUQsTUFBTSxDQUFOLE1BQVcsSUFBZixFQUFxQjtBQUFDQSxjQUFNLENBQU4sSUFBUyxvQkFBVDtBQUE4QixPQUFDLE9BQVEsb0JBQUMsVUFBRCxJQUFZLEtBQUssU0FBT0MsR0FBeEIsRUFBNkIsV0FBV1AsU0FBeEMsRUFBbUQsT0FBT00sTUFBTSxDQUFOLENBQTFELEVBQW9FLFlBQVlBLE1BQU0sQ0FBTixDQUFoRixHQUFSO0FBQXVHLEtBQXhMO0FBWEYsR0FEQTtBQWdCQSxDQWxCRjs7QUFvQkFFLE9BQU9ULGNBQVAsR0FBd0JBLGNBQXhCIiwiZmlsZSI6ImZpbmRNb3ZpZUJ1ZGR5Vmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEZpbmRNb3ZpZUJ1ZGR5ID0gKHtidWRkeWZ1bmMsIGJ1ZGRpZXN9KSA9PiB7XHJcblx0bGV0IGVtcHR5PWJ1ZGRpZXMubGVuZ3RoPT09MD9cIllvdSd2ZSBmcmllbmRlZCBldmVyeWJvZHkhXCI6XCJcIjtcclxuICByZXR1cm4gKFxyXG4gIDxkaXYgY2xhc3NOYW1lPSdtb3ZpZUJ1ZGR5IGNvbGxlY3Rpb24nPlxyXG5cdCAgPGRpdiBjbGFzc05hbWU9J2hlYWRlcic+RmluZCBZb3VyIE5leHQgTW92aWUgQnVkZHk8L2Rpdj48YnIvPlxyXG4gICAgIDxkaXYgY2xhc3NOYW1lPSdmaW5kRnJpZW5kJz5cclxuICAgIDxpbnB1dCBpZD0nZmluZEZyaWVuZEJ5TmFtZScgcGxhY2Vob2xkZXI9XCJFbnRlciBmcmllbmQgeW91J2QgbGlrZSB0byBhZGQgaGVyZSBoZXJlXCI+PC9pbnB1dD5cclxuICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXtidWRkeWZ1bmN9PnNlbmQgYSBmcmllbmQgcmVxdWVzdDwvYT5cclxuICAgIDwvZGl2PlxyXG5cdCAgICA8YnIvPlxyXG4gIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIiBzdHlsZT17e2Rpc3BsYXk6ICdub25lJ319IGlkPSdBbHJlYWR5UmVxMic+WW91dmUgYWxyZWFkeSBzZW50IGEgcmVxdWVzdCB0byB0aGlzIHVzZXIhPC9kaXY+XHJcbiAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiIHN0eWxlPXt7ZGlzcGxheTogJ25vbmUnfX0gaWQ9J2VudGVyUmVhbEZyaWVuZDInPlBsZWFzZSBlbnRlciBzb21ldGhpbmchPC9kaXY+XHJcbiAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiIHN0eWxlPXt7ZGlzcGxheTogJ25vbmUnfX0gaWQ9J3JlcVNlbnQyJz5SZXF1ZXN0IHNlbnQhPC9kaXY+XHJcblx0e2VtcHR5fVxyXG4gICB7YnVkZGllcy5tYXAoKGJ1ZGR5LCBpZHgpPT57IGlmIChidWRkeVsxXT09PW51bGwpIHtidWRkeVsxXT0nTm90aGluZyB0byBjb21wYXJlJ30gcmV0dXJuICg8QnVkZHlFbnRyeSBpZHg9e1widmlld1wiK2lkeH0gYnVkZHlmdW5jPXtidWRkeWZ1bmN9IEJ1ZGR5PXtidWRkeVswXX0gQnVkZHlTY29yZT17YnVkZHlbMV19IC8+ICl9KX1cclxuXHJcbiAgPC9kaXY+XHJcbiAgIFxyXG4pfTtcclxuXHJcbndpbmRvdy5GaW5kTW92aWVCdWRkeSA9IEZpbmRNb3ZpZUJ1ZGR5O1xyXG5cclxuXHJcblxyXG4iXX0=