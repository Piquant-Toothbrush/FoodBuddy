"use strict";

var Responses = function Responses(_ref) {
  var a = _ref.movie,
      b = _ref.responsesInfo,
      c = _ref.responseAnswer,
      d = _ref.responseType,
      e = _ref.remove,
      f = _ref.self;

  if (a !== null) {
    return React.createElement(
      "div",
      { className: "Reponses collection-item row" },
      React.createElement(
        "div",
        { className: "col s3" },
        React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
      ),
      React.createElement(
        "div",
        { className: "response col s9" },
        React.createElement(
          "div",
          { className: "responseMsg" },
          b,
          " said ",
          c,
          " to your ",
          d,
          " request to watch ",
          a,
          "!",
          React.createElement(
            "a",
            { className: "waves-effect waves-light btn", onClick: function onClick() {
                return e(b, f, a);
              } },
            "Got it"
          )
        )
      )
    );
  } else {
    return React.createElement(
      "div",
      { className: "Reponses collection-item row" },
      React.createElement(
        "div",
        { className: "col s3" },
        React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
      ),
      React.createElement(
        "div",
        { className: "response col s9" },
        React.createElement(
          "div",
          { className: "responseMsg" },
          b,
          " said ",
          c,
          " to your ",
          d,
          " request!"
        ),
        React.createElement(
          "a",
          { className: "waves-effect waves-light btn", onClick: function onClick() {
              return e(b, f, null);
            } },
          "Got it"
        )
      )
    );
  }
};

window.Responses = Responses;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1Jlc3BvbnNlcy5qcyJdLCJuYW1lcyI6WyJSZXNwb25zZXMiLCJtb3ZpZSIsInJlc3BvbnNlc0luZm8iLCJyZXNwb25zZUFuc3dlciIsInJlc3BvbnNlVHlwZSIsInJlbW92ZSIsInNlbGYiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsWUFBWSxTQUFaQSxTQUFZLE9BQXdFO0FBQUEsTUFBdEVDLENBQXNFLFFBQXRFQSxLQUFzRTtBQUFBLE1BQS9EQyxDQUErRCxRQUEvREEsYUFBK0Q7QUFBQSxNQUFoREMsQ0FBZ0QsUUFBaERBLGNBQWdEO0FBQUEsTUFBaENDLENBQWdDLFFBQWhDQSxZQUFnQztBQUFBLE1BQWxCQyxDQUFrQixRQUFsQkEsTUFBa0I7QUFBQSxNQUFWQyxDQUFVLFFBQVZBLElBQVU7O0FBRXhGLE1BQUlMLE1BQVUsSUFBZCxFQUFvQjtBQUNsQixXQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsOEJBQWY7QUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLFFBQWY7QUFDRSxxQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREYsT0FERjtBQUlFO0FBQUE7QUFBQSxVQUFLLFdBQVUsaUJBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFBOEJDLFdBQTlCO0FBQUE7QUFBbURDLFdBQW5EO0FBQUE7QUFBNEVDLFdBQTVFO0FBQUE7QUFBNEdILFdBQTVHO0FBQUE7QUFDQTtBQUFBO0FBQUEsY0FBRyxXQUFVLDhCQUFiLEVBQTRDLFNBQVM7QUFBQSx1QkFBSUksRUFBT0gsQ0FBUCxFQUFzQkksQ0FBdEIsRUFBNEJMLENBQTVCLENBQUo7QUFBQSxlQUFyRDtBQUFBO0FBQUE7QUFEQTtBQURGO0FBSkYsS0FERjtBQVlELEdBYkQsTUFhTztBQUNMLFdBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSw4QkFBZjtBQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsUUFBZjtBQUNFLHFDQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBSyxxQ0FBdEM7QUFERixPQURGO0FBS0U7QUFBQTtBQUFBLFVBQUssV0FBVSxpQkFBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsYUFBZjtBQUE4QkMsV0FBOUI7QUFBQTtBQUFtREMsV0FBbkQ7QUFBQTtBQUE0RUMsV0FBNUU7QUFBQTtBQUFBLFNBREY7QUFFRTtBQUFBO0FBQUEsWUFBRyxXQUFVLDhCQUFiLEVBQTRDLFNBQVM7QUFBQSxxQkFBSUMsRUFBT0gsQ0FBUCxFQUFzQkksQ0FBdEIsRUFBNEIsSUFBNUIsQ0FBSjtBQUFBLGFBQXJEO0FBQUE7QUFBQTtBQUZGO0FBTEYsS0FERjtBQVlEO0FBQ0YsQ0E3QkQ7O0FBK0JBQyxPQUFPUCxTQUFQLEdBQW1CQSxTQUFuQiIsImZpbGUiOiJSZXNwb25zZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBSZXNwb25zZXMgPSAoe21vdmllLCByZXNwb25zZXNJbmZvLCByZXNwb25zZUFuc3dlciwgcmVzcG9uc2VUeXBlLCByZW1vdmUsIHNlbGZ9KSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ3Byb3BzLm1vdmllJywgbW92aWUpXHJcbiAgaWYgKG1vdmllICE9PSBudWxsKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIlJlcG9uc2VzIGNvbGxlY3Rpb24taXRlbSByb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzM1wiPlxyXG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXNwb25zZSBjb2wgczlcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzcG9uc2VNc2dcIj57cmVzcG9uc2VzSW5mb30gc2FpZCB7cmVzcG9uc2VBbnN3ZXJ9IHRvIHlvdXIge3Jlc3BvbnNlVHlwZX0gcmVxdWVzdCB0byB3YXRjaCB7bW92aWV9ISAgXHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCk9PnJlbW92ZShyZXNwb25zZXNJbmZvLCBzZWxmLCBtb3ZpZSl9PkdvdCBpdDwvYT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIClcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJSZXBvbnNlcyBjb2xsZWN0aW9uLWl0ZW0gcm93XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczNcIj5cclxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17J2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3BvbnNlIGNvbCBzOVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXNwb25zZU1zZ1wiPntyZXNwb25zZXNJbmZvfSBzYWlkIHtyZXNwb25zZUFuc3dlcn0gdG8geW91ciB7cmVzcG9uc2VUeXBlfSByZXF1ZXN0ITwvZGl2PlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpPT5yZW1vdmUocmVzcG9uc2VzSW5mbywgc2VsZiwgbnVsbCl9PkdvdCBpdDwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuXHJcbndpbmRvdy5SZXNwb25zZXMgPSBSZXNwb25zZXM7Il19