"use strict";

var InboxEntry = function InboxEntry(_ref) {
  var a = _ref.inboxName,
      b = _ref.accept,
      c = _ref.requestMovie,
      d = _ref.decline,
      e = _ref.requestType,
      f = _ref.messageInfo;
  return React.createElement(
    "div",
    { className: "InboxEntry Reponses collection-item row" },
    React.createElement(
      "div",
      { className: "col s3" },
      React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
    ),
    React.createElement(
      "div",
      { className: "response col s9" },
      React.createElement(
        "span",
        { className: "inboxFriend" },
        " Name:",
        a,
        React.createElement(
          "a",
          { className: "waves-effect waves-light btn accept", onClick: function onClick() {
              b(a, c);
            } },
          "Accept ",
          a,
          "'s ",
          e,
          " request ",
          c
        ),
        React.createElement(
          "a",
          { className: "waves-effect waves-light btn decline", onClick: function onClick() {
              d(a, c);
            } },
          "Decline ",
          a,
          "'s ",
          e,
          " request ",
          c
        )
      ),
      React.createElement("br", null),
      " Message:",
      f === null ? 'No message' : f
    )
  );
};

window.InboxEntry = InboxEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94RW50cnkuanMiXSwibmFtZXMiOlsiSW5ib3hFbnRyeSIsImluYm94TmFtZSIsImFjY2VwdCIsInJlcXVlc3RNb3ZpZSIsImRlY2xpbmUiLCJyZXF1ZXN0VHlwZSIsIm1lc3NhZ2VJbmZvIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLGFBQWEsU0FBYkEsVUFBYTtBQUFBLE1BQUVDLENBQUYsUUFBRUEsU0FBRjtBQUFBLE1BQWFDLENBQWIsUUFBYUEsTUFBYjtBQUFBLE1BQXFCQyxDQUFyQixRQUFxQkEsWUFBckI7QUFBQSxNQUFtQ0MsQ0FBbkMsUUFBbUNBLE9BQW5DO0FBQUEsTUFBNENDLENBQTVDLFFBQTRDQSxXQUE1QztBQUFBLE1BQXlEQyxDQUF6RCxRQUF5REEsV0FBekQ7QUFBQSxTQUNuQjtBQUFBO0FBQUEsTUFBSyxXQUFVLHlDQUFmO0FBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxRQUFmO0FBQ0UsbUNBQUssV0FBVSxpQkFBZixFQUFpQyxLQUFNLHFDQUF2QztBQURGLEtBREY7QUFJRTtBQUFBO0FBQUEsUUFBSyxXQUFVLGlCQUFmO0FBQ0U7QUFBQTtBQUFBLFVBQU0sV0FBVSxhQUFoQjtBQUFBO0FBQXFDTCxTQUFyQztBQUNJO0FBQUE7QUFBQSxZQUFHLFdBQVUscUNBQWIsRUFBbUQsU0FBUyxtQkFBSTtBQUFDQyxnQkFBT0QsQ0FBUCxFQUFrQkUsQ0FBbEI7QUFBZ0MsYUFBakc7QUFBQTtBQUNRRixXQURSO0FBQUE7QUFDc0JJLFdBRHRCO0FBQUE7QUFDNENGO0FBRDVDLFNBREo7QUFHSTtBQUFBO0FBQUEsWUFBRyxXQUFVLHNDQUFiLEVBQW9ELFNBQVMsbUJBQUk7QUFBQ0MsZ0JBQVFILENBQVIsRUFBbUJFLENBQW5CO0FBQWlDLGFBQW5HO0FBQUE7QUFDU0YsV0FEVDtBQUFBO0FBQ3VCSSxXQUR2QjtBQUFBO0FBQzZDRjtBQUQ3QztBQUhKLE9BREY7QUFNRSxxQ0FORjtBQUFBO0FBTWlCRyxZQUFnQixJQUFoQixHQUF1QixZQUF2QixHQUFzQ0E7QUFOdkQ7QUFKRixHQURtQjtBQUFBLENBQW5COztBQWlCQUMsT0FBT1AsVUFBUCxHQUFvQkEsVUFBcEIiLCJmaWxlIjoiSW5ib3hFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEluYm94RW50cnkgPSAoe2luYm94TmFtZSwgYWNjZXB0LCByZXF1ZXN0TW92aWUsIGRlY2xpbmUsIHJlcXVlc3RUeXBlLCBtZXNzYWdlSW5mb30pID0+IChcclxuPGRpdiBjbGFzc05hbWU9XCJJbmJveEVudHJ5IFJlcG9uc2VzIGNvbGxlY3Rpb24taXRlbSByb3dcIj5cclxuICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzM1wiPlxyXG4gICAgPGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsgJ2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3NOYW1lPVwicmVzcG9uc2UgY29sIHM5XCI+XHJcbiAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmJveEZyaWVuZFwiPiBOYW1lOntpbmJveE5hbWV9IFxyXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG4gYWNjZXB0XCIgb25DbGljaz17KCk9PnthY2NlcHQoaW5ib3hOYW1lLCByZXF1ZXN0TW92aWUpfX0+IFxyXG4gICAgICAgIEFjY2VwdCB7aW5ib3hOYW1lfSdzIHtyZXF1ZXN0VHlwZX0gcmVxdWVzdCB7cmVxdWVzdE1vdmllfTwvYT5cclxuICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuIGRlY2xpbmVcIiBvbkNsaWNrPXsoKT0+e2RlY2xpbmUoaW5ib3hOYW1lLCByZXF1ZXN0TW92aWUpfX0+XHJcbiAgICAgICAgRGVjbGluZSB7aW5ib3hOYW1lfSdzIHtyZXF1ZXN0VHlwZX0gcmVxdWVzdCB7cmVxdWVzdE1vdmllfTwvYT48L3NwYW4+XHJcbiAgICA8YnIvPiBNZXNzYWdlOnttZXNzYWdlSW5mbyA9PT0gbnVsbCA/ICdObyBtZXNzYWdlJyA6IG1lc3NhZ2VJbmZvfVxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuXHJcbik7XHJcblxyXG53aW5kb3cuSW5ib3hFbnRyeSA9IEluYm94RW50cnk7Il19