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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1Jlc3BvbnNlcy5qc3giXSwibmFtZXMiOlsiUmVzcG9uc2VzIiwibW92aWUiLCJyZXNwb25zZXNJbmZvIiwicmVzcG9uc2VBbnN3ZXIiLCJyZXNwb25zZVR5cGUiLCJyZW1vdmUiLCJzZWxmIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFlBQVksU0FBWkEsU0FBWSxPQUF3RTtBQUFBLE1BQXRFQyxDQUFzRSxRQUF0RUEsS0FBc0U7QUFBQSxNQUEvREMsQ0FBK0QsUUFBL0RBLGFBQStEO0FBQUEsTUFBaERDLENBQWdELFFBQWhEQSxjQUFnRDtBQUFBLE1BQWhDQyxDQUFnQyxRQUFoQ0EsWUFBZ0M7QUFBQSxNQUFsQkMsQ0FBa0IsUUFBbEJBLE1BQWtCO0FBQUEsTUFBVkMsQ0FBVSxRQUFWQSxJQUFVOztBQUV4RixNQUFJTCxNQUFVLElBQWQsRUFBb0I7QUFDbEIsV0FDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLDhCQUFmO0FBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxRQUFmO0FBQ0UscUNBQUssV0FBVSxpQkFBZixFQUFpQyxLQUFLLHFDQUF0QztBQURGLE9BREY7QUFJRTtBQUFBO0FBQUEsVUFBSyxXQUFVLGlCQUFmO0FBQ0U7QUFBQTtBQUFBLFlBQUssV0FBVSxhQUFmO0FBQThCQyxXQUE5QjtBQUFBO0FBQW1EQyxXQUFuRDtBQUFBO0FBQTRFQyxXQUE1RTtBQUFBO0FBQTRHSCxXQUE1RztBQUFBO0FBQ0E7QUFBQTtBQUFBLGNBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTO0FBQUEsdUJBQUlJLEVBQU9ILENBQVAsRUFBc0JJLENBQXRCLEVBQTRCTCxDQUE1QixDQUFKO0FBQUEsZUFBckQ7QUFBQTtBQUFBO0FBREE7QUFERjtBQUpGLEtBREY7QUFZRCxHQWJELE1BYU87QUFDTCxXQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsOEJBQWY7QUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLFFBQWY7QUFDRSxxQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREYsT0FERjtBQUtFO0FBQUE7QUFBQSxVQUFLLFdBQVUsaUJBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFBOEJDLFdBQTlCO0FBQUE7QUFBbURDLFdBQW5EO0FBQUE7QUFBNEVDLFdBQTVFO0FBQUE7QUFBQSxTQURGO0FBRUU7QUFBQTtBQUFBLFlBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTO0FBQUEscUJBQUlDLEVBQU9ILENBQVAsRUFBc0JJLENBQXRCLEVBQTRCLElBQTVCLENBQUo7QUFBQSxhQUFyRDtBQUFBO0FBQUE7QUFGRjtBQUxGLEtBREY7QUFZRDtBQUNGLENBN0JEOztBQStCQUMsT0FBT1AsU0FBUCxHQUFtQkEsU0FBbkIiLCJmaWxlIjoiUmVzcG9uc2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgUmVzcG9uc2VzID0gKHttb3ZpZSwgcmVzcG9uc2VzSW5mbywgcmVzcG9uc2VBbnN3ZXIsIHJlc3BvbnNlVHlwZSwgcmVtb3ZlLCBzZWxmfSkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdwcm9wcy5tb3ZpZScsIG1vdmllKVxyXG4gIGlmIChtb3ZpZSAhPT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJSZXBvbnNlcyBjb2xsZWN0aW9uLWl0ZW0gcm93XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczNcIj5cclxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17J2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzcG9uc2UgY29sIHM5XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3BvbnNlTXNnXCI+e3Jlc3BvbnNlc0luZm99IHNhaWQge3Jlc3BvbnNlQW5zd2VyfSB0byB5b3VyIHtyZXNwb25zZVR5cGV9IHJlcXVlc3QgdG8gd2F0Y2gge21vdmllfSEgIFxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpPT5yZW1vdmUocmVzcG9uc2VzSW5mbywgc2VsZiwgbW92aWUpfT5Hb3QgaXQ8L2E+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUmVwb25zZXMgY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XHJcbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0ncHJvZmlsZXRodW1uYWlsJyBzcmM9eydodHRwczovL3Vuc3BsYXNoLml0LzE3MC8xNzAvP3JhbmRvbSd9Lz5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXNwb25zZSBjb2wgczlcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzcG9uc2VNc2dcIj57cmVzcG9uc2VzSW5mb30gc2FpZCB7cmVzcG9uc2VBbnN3ZXJ9IHRvIHlvdXIge3Jlc3BvbnNlVHlwZX0gcmVxdWVzdCE8L2Rpdj5cclxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKT0+cmVtb3ZlKHJlc3BvbnNlc0luZm8sIHNlbGYsIG51bGwpfT5Hb3QgaXQ8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn07XHJcblxyXG53aW5kb3cuUmVzcG9uc2VzID0gUmVzcG9uc2VzOyJdfQ==