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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2ZpbmRNb3ZpZUJ1ZGR5Vmlldy5qc3giXSwibmFtZXMiOlsiRmluZE1vdmllQnVkZHkiLCJidWRkeWZ1bmMiLCJidWRkaWVzIiwiZW1wdHkiLCJsZW5ndGgiLCJkaXNwbGF5IiwibWFwIiwiYnVkZHkiLCJpZHgiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsaUJBQWlCLFNBQWpCQSxjQUFpQixPQUEwQjtBQUFBLE1BQXhCQyxDQUF3QixRQUF4QkEsU0FBd0I7QUFBQSxNQUFiQyxDQUFhLFFBQWJBLE9BQWE7QUFBQSxNQUM1Q0MsQ0FENEMsR0FDdENELEVBQVFFLE1BQVIsS0FBaUIsQ0FBakIsR0FBbUIsNEJBQW5CLEdBQWdELEVBRFY7O0FBRS9DLFNBQ0E7QUFBQTtBQUFBLE1BQUssV0FBVSx1QkFBZjtBQUNDO0FBQUE7QUFBQSxRQUFLLFdBQVUsUUFBZjtBQUFBO0FBQUEsS0FERDtBQUN5RCxtQ0FEekQ7QUFFRztBQUFBO0FBQUEsUUFBSyxXQUFVLFlBQWY7QUFDRCxxQ0FBTyxJQUFHLGtCQUFWLEVBQTZCLGFBQVksMENBQXpDLEdBREM7QUFFRDtBQUFBO0FBQUEsVUFBSSxJQUFHLGdCQUFQLEVBQXdCLFdBQVUsOEJBQWxDLEVBQWlFLFNBQVNILENBQTFFO0FBQUE7QUFBQTtBQUZDLEtBRkg7QUFNRyxtQ0FOSDtBQU9BO0FBQUE7QUFBQSxRQUFLLFdBQVUsVUFBZixFQUEwQixPQUFPLEVBQUNJLFNBQVMsTUFBVixFQUFqQyxFQUFvRCxJQUFHLGFBQXZEO0FBQUE7QUFBQSxLQVBBO0FBUUE7QUFBQTtBQUFBLFFBQUssV0FBVSxVQUFmLEVBQTBCLE9BQU8sRUFBQ0EsU0FBUyxNQUFWLEVBQWpDLEVBQW9ELElBQUcsa0JBQXZEO0FBQUE7QUFBQSxLQVJBO0FBU0E7QUFBQTtBQUFBLFFBQUssV0FBVSxVQUFmLEVBQTBCLE9BQU8sRUFBQ0EsU0FBUyxNQUFWLEVBQWpDLEVBQW9ELElBQUcsVUFBdkQ7QUFBQTtBQUFBLEtBVEE7QUFVQUYsS0FWQTtBQVdFRCxNQUFRSSxHQUFSLENBQVksVUFBQ0MsQ0FBRCxFQUFRQyxDQUFSLEVBQWM7QUFBRSxVQUFJRCxFQUFNLENBQU4sTUFBVyxJQUFmLEVBQXFCO0FBQUNBLFVBQU0sQ0FBTixJQUFTLG9CQUFUO0FBQThCLE9BQUMsT0FBUSxvQkFBQyxVQUFELElBQVksS0FBSyxTQUFPQyxDQUF4QixFQUE2QixXQUFXUCxDQUF4QyxFQUFtRCxPQUFPTSxFQUFNLENBQU4sQ0FBMUQsRUFBb0UsWUFBWUEsRUFBTSxDQUFOLENBQWhGLEdBQVI7QUFBdUcsS0FBeEw7QUFYRixHQURBO0FBZ0JBLENBbEJGOztBQW9CQUUsT0FBT1QsY0FBUCxHQUF3QkEsY0FBeEIiLCJmaWxlIjoiZmluZE1vdmllQnVkZHlWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRmluZE1vdmllQnVkZHkgPSAoe2J1ZGR5ZnVuYywgYnVkZGllc30pID0+IHtcclxuXHRsZXQgZW1wdHk9YnVkZGllcy5sZW5ndGg9PT0wP1wiWW91J3ZlIGZyaWVuZGVkIGV2ZXJ5Ym9keSFcIjpcIlwiO1xyXG4gIHJldHVybiAoXHJcbiAgPGRpdiBjbGFzc05hbWU9J21vdmllQnVkZHkgY29sbGVjdGlvbic+XHJcblx0ICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJz5GaW5kIFlvdXIgTmV4dCBNb3ZpZSBCdWRkeTwvZGl2Pjxici8+XHJcbiAgICAgPGRpdiBjbGFzc05hbWU9J2ZpbmRGcmllbmQnPlxyXG4gICAgPGlucHV0IGlkPSdmaW5kRnJpZW5kQnlOYW1lJyBwbGFjZWhvbGRlcj1cIkVudGVyIGZyaWVuZCB5b3UnZCBsaWtlIHRvIGFkZCBoZXJlIGhlcmVcIj48L2lucHV0PlxyXG4gICAgPGEgIGlkPVwicmVxdWVzdEFGcmllbmRcIiBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17YnVkZHlmdW5jfT5zZW5kIGEgZnJpZW5kIHJlcXVlc3Q8L2E+XHJcbiAgICA8L2Rpdj5cclxuXHQgICAgPGJyLz5cclxuICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCIgc3R5bGU9e3tkaXNwbGF5OiAnbm9uZSd9fSBpZD0nQWxyZWFkeVJlcTInPllvdXZlIGFscmVhZHkgc2VudCBhIHJlcXVlc3QgdG8gdGhpcyB1c2VyITwvZGl2PlxyXG4gIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIiBzdHlsZT17e2Rpc3BsYXk6ICdub25lJ319IGlkPSdlbnRlclJlYWxGcmllbmQyJz5QbGVhc2UgZW50ZXIgc29tZXRoaW5nITwvZGl2PlxyXG4gIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIiBzdHlsZT17e2Rpc3BsYXk6ICdub25lJ319IGlkPSdyZXFTZW50Mic+UmVxdWVzdCBzZW50ITwvZGl2PlxyXG5cdHtlbXB0eX1cclxuICAge2J1ZGRpZXMubWFwKChidWRkeSwgaWR4KT0+eyBpZiAoYnVkZHlbMV09PT1udWxsKSB7YnVkZHlbMV09J05vdGhpbmcgdG8gY29tcGFyZSd9IHJldHVybiAoPEJ1ZGR5RW50cnkgaWR4PXtcInZpZXdcIitpZHh9IGJ1ZGR5ZnVuYz17YnVkZHlmdW5jfSBCdWRkeT17YnVkZHlbMF19IEJ1ZGR5U2NvcmU9e2J1ZGR5WzFdfSAvPiApfSl9XHJcblxyXG4gIDwvZGl2PlxyXG4gICBcclxuKX07XHJcblxyXG53aW5kb3cuRmluZE1vdmllQnVkZHkgPSBGaW5kTW92aWVCdWRkeTtcclxuXHJcblxyXG5cclxuIl19