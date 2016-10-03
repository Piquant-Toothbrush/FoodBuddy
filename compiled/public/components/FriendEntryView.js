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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZEVudHJ5Vmlldy5qc3giXSwibmFtZXMiOlsiRnJpZW5kRW50cnkiLCJGcmllbmQiLCJmb2YiLCJDb21wIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLGNBQWMsU0FBZEEsV0FBYztBQUFBLE1BQUVDLENBQUYsUUFBRUEsTUFBRjtBQUFBLE1BQVVDLENBQVYsUUFBVUEsR0FBVjtBQUFBLE1BQWVDLENBQWYsUUFBZUEsSUFBZjtBQUFBLFNBQ2xCO0FBQUE7QUFBQSxNQUFLLFdBQVUsaUNBQWY7QUFDQztBQUFBO0FBQUEsUUFBSyxXQUFVLFFBQWY7QUFDQyxtQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREQsS0FERDtBQUlFO0FBQUE7QUFBQSxRQUFLLElBQUcsUUFBUixFQUFpQixXQUFVLG9CQUEzQjtBQUNDO0FBQUE7QUFBQSxVQUFHLFdBQVUsdUJBQWI7QUFBcUM7QUFBQTtBQUFBLFlBQUksV0FBVSxZQUFkLEVBQTJCLFNBQVMsbUJBQUk7QUFBQ0QsZ0JBQUlELENBQUo7QUFBWSxhQUFyRDtBQUF3REE7QUFBeEQ7QUFBckMsT0FERDtBQUVDO0FBQUE7QUFBQSxVQUFLLFdBQVUsMEJBQWY7QUFBQTtBQUEyREUsY0FBUywwQkFBVCxHQUFzQywwQkFBdEMsR0FBbUVBLElBQU87QUFBckk7QUFGRDtBQUpGLEdBRGtCO0FBQUEsQ0FBcEI7O0FBWUFDLE9BQU9KLFdBQVAsR0FBcUJBLFdBQXJCIiwiZmlsZSI6IkZyaWVuZEVudHJ5Vmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEZyaWVuZEVudHJ5ID0gKHtGcmllbmQsIGZvZiwgQ29tcCB9KSA9PiAgKFxyXG4gIDxkaXYgY2xhc3NOYW1lPVwiRnJpZW5kRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvd1wiID5cclxuICBcdDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XHJcbiAgXHRcdDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17J2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxyXG4gIFx0PC9kaXY+XHJcbiAgICA8ZGl2IGlkPVwiRnJpZW5kXCIgY2xhc3NOYW1lPVwiZnJpZW5kRW50cnkgY29sIHM5XCI+XHJcbiAgICBcdDxhIGNsYXNzTmFtZT0nZnJpZW5kRW50cnlJbmRpdmlkdWFsJz48aDMgY2xhc3NOYW1lPVwiZnJpZW5kTmFtZVwiIG9uQ2xpY2s9eygpPT57Zm9mKEZyaWVuZCl9fT57RnJpZW5kfTwvaDM+PC9hPiAgXHJcbiAgICBcdDxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kRW50cnlDb21wYXRhYmlsaXR5XCIgPkNvbXBhdGFiaWxpdHk6IHtDb21wID09PSAnTm8gY29tcGFyaXNvbiB0byBiZSBtYWRlJyA/ICdObyBjb21wYXJpc29uIHRvIGJlIG1hZGUnIDogQ29tcCArICclJ308L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4pO1xyXG5cclxud2luZG93LkZyaWVuZEVudHJ5ID0gRnJpZW5kRW50cnk7Il19