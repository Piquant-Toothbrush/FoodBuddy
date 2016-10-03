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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZHMuanN4Il0sIm5hbWVzIjpbIkZyaWVuZHMiLCJmb2YiLCJzZW5kUmVxdWVzdCIsInNlbmRXYXRjaFJlcXVlc3QiLCJteUZyaWVuZHMiLCJkaXNwbGF5IiwibWFwIiwiZnJpZW5kIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFVBQVUsU0FBVkEsT0FBVTtBQUFBLE1BQUVDLENBQUYsUUFBRUEsR0FBRjtBQUFBLE1BQU9DLENBQVAsUUFBT0EsV0FBUDtBQUFBLE1BQW9CQyxDQUFwQixRQUFvQkEsZ0JBQXBCO0FBQUEsTUFBc0NDLENBQXRDLFFBQXNDQSxTQUF0QztBQUFBLFNBRWQ7QUFBQTtBQUFBLE1BQUssV0FBVSxzQkFBZjtBQUNFLGlDQUFLLFdBQVUsUUFBZixHQURGO0FBRUU7QUFBQTtBQUFBLFFBQUssV0FBVSxVQUFmLEVBQTBCLE9BQU8sRUFBQ0MsU0FBUyxNQUFWLEVBQWpDLEVBQW9ELElBQUcsaUJBQXZEO0FBQUE7QUFBQSxLQUZGO0FBR0U7QUFBQTtBQUFBLFFBQUssV0FBVSxXQUFmLEVBQTJCLE9BQU8sRUFBQ0EsU0FBUyxNQUFWLEVBQWxDLEVBQXFELElBQUcsU0FBeEQ7QUFBQTtBQUFBLEtBSEY7QUFJRSxtQ0FKRjtBQUtFO0FBQUE7QUFBQSxRQUFLLFdBQVUsVUFBZixFQUEwQixPQUFPLEVBQUNBLFNBQVMsTUFBVixFQUFqQyxFQUFvRCxJQUFHLFlBQXZEO0FBQUE7QUFBQSxLQUxGO0FBTUUsbUNBTkY7QUFPRSxtQ0FQRjtBQVFFO0FBQUE7QUFBQSxRQUFJLFdBQVUsY0FBZDtBQUFBO0FBQUEsS0FSRjtBQVNHRCxNQUFVRSxHQUFWLENBQWM7QUFBQSxhQUNkLG9CQUFDLFdBQUQsSUFBYSxjQUFjSCxDQUEzQixFQUE2QyxRQUFRSSxFQUFPLENBQVAsQ0FBckQsRUFBZ0UsTUFBTUEsRUFBTyxDQUFQLENBQXRFLEVBQWlGLEtBQUtOLENBQXRGLEdBRGM7QUFBQSxLQUFkO0FBVEgsR0FGYztBQUFBLENBQWQ7O0FBa0JBTyxPQUFPUixPQUFQLEdBQWlCQSxPQUFqQiIsImZpbGUiOiJGcmllbmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEZyaWVuZHMgPSAoe2ZvZiwgc2VuZFJlcXVlc3QsIHNlbmRXYXRjaFJlcXVlc3QsIG15RnJpZW5kc30pID0+IChcclxuIFxyXG48ZGl2IGNsYXNzTmFtZT1cIm15RnJpZW5kcyBjb2xsZWN0aW9uXCI+XHJcbiAgPGRpdiBjbGFzc05hbWU9J2hlYWRlcic+PC9kaXY+XHJcbiAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiIHN0eWxlPXt7ZGlzcGxheTogJ25vbmUnfX0gaWQ9J2VudGVyUmVhbEZyaWVuZCc+UGxlYXNlIGVudGVyIHNvbWV0aGluZyE8L2Rpdj5cclxuICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiIHN0eWxlPXt7ZGlzcGxheTogJ25vbmUnfX0gaWQ9J3JlcVNlbnQnPlJlcXVlc3Qgc2VudCE8L2Rpdj5cclxuICA8YnIvPlxyXG4gIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIiBzdHlsZT17e2Rpc3BsYXk6ICdub25lJ319IGlkPSdBbHJlYWR5UmVxJz5Zb3V2ZSBhbHJlYWR5IHNlbnQgYSByZXF1ZXN0IHRvIHRoaXMgdXNlciE8L2Rpdj5cclxuICA8YnIvPlxyXG4gIDxici8+XHJcbiAgPGg1IGNsYXNzTmFtZT1cImhlYWRlciBsYWJsZVwiPllvdXIgRnJpZW5kczwvaDU+IFxyXG4gIHtteUZyaWVuZHMubWFwKGZyaWVuZD0+KCBcclxuICBcdDxGcmllbmRFbnRyeSBzZW5kQVJlcXVlc3Q9e3NlbmRXYXRjaFJlcXVlc3R9IEZyaWVuZD17ZnJpZW5kWzBdfSBDb21wPXtmcmllbmRbMV19IGZvZj17Zm9mfSAvPiBcclxuICAgKSl9XHJcbjwvZGl2PlxyXG5cclxuKTtcclxuXHJcbndpbmRvdy5GcmllbmRzID0gRnJpZW5kcztcclxuIl19