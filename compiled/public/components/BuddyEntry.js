'use strict';

var BuddyEntry = function BuddyEntry(_ref) {
  var a = _ref.Buddy,
      b = _ref.BuddyScore,
      c = _ref.buddyfunc,
      d = _ref.idx;
  return React.createElement(
    'div',
    { className: 'collection-item row' },
    React.createElement(
      'div',
      { className: 'col s3' },
      React.createElement('img', { className: 'profilethumnail', src: 'https://unsplash.it/170/170/?random' })
    ),
    React.createElement(
      'div',
      { id: 'Friend', className: 'buddy col s9' },
      React.createElement(
        'h3',
        { className: 'buddyName' },
        a
      ),
      React.createElement(
        'div',
        { className: 'buddyCompatibility' },
        b === 'Nothing to compare' ? 'Compatability: ' + a + ' has not rated any movies' : 'Compatability: ' + b
      ),
      React.createElement(
        'a',
        { id: d, className: 'waves-effect waves-light btn', onClick: function onClick() {
            c(a, d);
          } },
        'Send friend request'
      ),
      React.createElement('div', { id: 'friendReqConf' })
    )
  );
};

window.BuddyEntry = BuddyEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0J1ZGR5RW50cnkuanMiXSwibmFtZXMiOlsiQnVkZHlFbnRyeSIsIkJ1ZGR5IiwiQnVkZHlTY29yZSIsImJ1ZGR5ZnVuYyIsImlkeCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxhQUFhLFNBQWJBLFVBQWE7QUFBQSxNQUFFQyxDQUFGLFFBQUVBLEtBQUY7QUFBQSxNQUFTQyxDQUFULFFBQVNBLFVBQVQ7QUFBQSxNQUFvQkMsQ0FBcEIsUUFBb0JBLFNBQXBCO0FBQUEsTUFBK0JDLENBQS9CLFFBQStCQSxHQUEvQjtBQUFBLFNBQ2pCO0FBQUE7QUFBQSxNQUFLLFdBQVUscUJBQWY7QUFDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLFFBQWY7QUFDQyxtQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREQsS0FERjtBQUlFO0FBQUE7QUFBQSxRQUFLLElBQUcsUUFBUixFQUFpQixXQUFVLGNBQTNCO0FBQ0M7QUFBQTtBQUFBLFVBQUksV0FBVSxXQUFkO0FBQTJCSDtBQUEzQixPQUREO0FBRUU7QUFBQTtBQUFBLFVBQUssV0FBVSxvQkFBZjtBQUFzQ0MsY0FBZSxvQkFBaEIsdUJBQTBERCxDQUExRCxxREFBK0dDO0FBQXBKLE9BRkY7QUFHQztBQUFBO0FBQUEsVUFBSSxJQUFJRSxDQUFSLEVBQWEsV0FBVSw4QkFBdkIsRUFBc0QsU0FBUyxtQkFBSTtBQUFDRCxjQUFVRixDQUFWLEVBQWlCRyxDQUFqQjtBQUE0RCxXQUFoSTtBQUFBO0FBQUEsT0FIRDtBQUlFLG1DQUFLLElBQUcsZUFBUjtBQUpGO0FBSkYsR0FEaUI7QUFBQSxDQUFuQjs7QUFlQUMsT0FBT0wsVUFBUCxHQUFvQkEsVUFBcEIiLCJmaWxlIjoiQnVkZHlFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEJ1ZGR5RW50cnkgPSAoe0J1ZGR5LCBCdWRkeVNjb3JlLGJ1ZGR5ZnVuYywgaWR4fSkgPT4gKFxyXG4gIDxkaXYgY2xhc3NOYW1lPSdjb2xsZWN0aW9uLWl0ZW0gcm93Jz5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XHJcbiAgICBcdDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17J2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGlkPVwiRnJpZW5kXCIgY2xhc3NOYW1lPVwiYnVkZHkgY29sIHM5XCI+XHJcbiAgIFx0XHQ8aDMgY2xhc3NOYW1lPVwiYnVkZHlOYW1lXCI+e0J1ZGR5fTwvaDM+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnVkZHlDb21wYXRpYmlsaXR5XCI+eyhCdWRkeVNjb3JlID09PSAnTm90aGluZyB0byBjb21wYXJlJykgPyBgQ29tcGF0YWJpbGl0eTogJHtCdWRkeX0gaGFzIG5vdCByYXRlZCBhbnkgbW92aWVzYCA6IGBDb21wYXRhYmlsaXR5OiAke0J1ZGR5U2NvcmV9YH08L2Rpdj5cclxuICAgXHRcdDxhICBpZD17aWR4fSBjbGFzc05hbWU9J3dhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG4nIG9uQ2xpY2s9eygpPT57YnVkZHlmdW5jKEJ1ZGR5LCBpZHgpOyBjb25zb2xlLmxvZygnY2xpY2tlZCB0aGUgcmlnaHQgb2VuJyl9fT5TZW5kIGZyaWVuZCByZXF1ZXN0PC9hPiBcclxuICAgICAgPGRpdiBpZD1cImZyaWVuZFJlcUNvbmZcIj48L2Rpdj5cclxuICBcdDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4pXHJcblxyXG5cclxud2luZG93LkJ1ZGR5RW50cnkgPSBCdWRkeUVudHJ5O1xyXG5cclxuIl19