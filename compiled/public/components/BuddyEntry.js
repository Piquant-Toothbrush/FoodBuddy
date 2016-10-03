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
        b === 'Nothing to compare' ? 'Compatability: ' + a + ' has not rated any movies' : 'Compatability: ' + b + '%'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0J1ZGR5RW50cnkuanN4Il0sIm5hbWVzIjpbIkJ1ZGR5RW50cnkiLCJCdWRkeSIsIkJ1ZGR5U2NvcmUiLCJidWRkeWZ1bmMiLCJpZHgiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsYUFBYSxTQUFiQSxVQUFhO0FBQUEsTUFBRUMsQ0FBRixRQUFFQSxLQUFGO0FBQUEsTUFBU0MsQ0FBVCxRQUFTQSxVQUFUO0FBQUEsTUFBb0JDLENBQXBCLFFBQW9CQSxTQUFwQjtBQUFBLE1BQStCQyxDQUEvQixRQUErQkEsR0FBL0I7QUFBQSxTQUNqQjtBQUFBO0FBQUEsTUFBSyxXQUFVLHFCQUFmO0FBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxRQUFmO0FBQ0MsbUNBQUssV0FBVSxpQkFBZixFQUFpQyxLQUFLLHFDQUF0QztBQURELEtBREY7QUFJRTtBQUFBO0FBQUEsUUFBSyxJQUFHLFFBQVIsRUFBaUIsV0FBVSxjQUEzQjtBQUNDO0FBQUE7QUFBQSxVQUFJLFdBQVUsV0FBZDtBQUEyQkg7QUFBM0IsT0FERDtBQUVFO0FBQUE7QUFBQSxVQUFLLFdBQVUsb0JBQWY7QUFBc0NDLGNBQWUsb0JBQWhCLHVCQUEwREQsQ0FBMUQscURBQStHQyxDQUEvRztBQUFyQyxPQUZGO0FBR0M7QUFBQTtBQUFBLFVBQUksSUFBSUUsQ0FBUixFQUFhLFdBQVUsOEJBQXZCLEVBQXNELFNBQVMsbUJBQUk7QUFBQ0QsY0FBVUYsQ0FBVixFQUFpQkcsQ0FBakI7QUFBNEQsV0FBaEk7QUFBQTtBQUFBLE9BSEQ7QUFJRSxtQ0FBSyxJQUFHLGVBQVI7QUFKRjtBQUpGLEdBRGlCO0FBQUEsQ0FBbkI7O0FBZUFDLE9BQU9MLFVBQVAsR0FBb0JBLFVBQXBCIiwiZmlsZSI6IkJ1ZGR5RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCdWRkeUVudHJ5ID0gKHtCdWRkeSwgQnVkZHlTY29yZSxidWRkeWZ1bmMsIGlkeH0pID0+IChcclxuICA8ZGl2IGNsYXNzTmFtZT0nY29sbGVjdGlvbi1pdGVtIHJvdyc+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzM1wiPlxyXG4gICAgXHQ8aW1nIGNsYXNzTmFtZT0ncHJvZmlsZXRodW1uYWlsJyBzcmM9eydodHRwczovL3Vuc3BsYXNoLml0LzE3MC8xNzAvP3JhbmRvbSd9Lz5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBpZD1cIkZyaWVuZFwiIGNsYXNzTmFtZT1cImJ1ZGR5IGNvbCBzOVwiPlxyXG4gICBcdFx0PGgzIGNsYXNzTmFtZT1cImJ1ZGR5TmFtZVwiPntCdWRkeX08L2gzPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1ZGR5Q29tcGF0aWJpbGl0eVwiPnsoQnVkZHlTY29yZSA9PT0gJ05vdGhpbmcgdG8gY29tcGFyZScpID8gYENvbXBhdGFiaWxpdHk6ICR7QnVkZHl9IGhhcyBub3QgcmF0ZWQgYW55IG1vdmllc2AgOiBgQ29tcGF0YWJpbGl0eTogJHtCdWRkeVNjb3JlfSVgfTwvZGl2PlxyXG4gICBcdFx0PGEgIGlkPXtpZHh9IGNsYXNzTmFtZT0nd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0bicgb25DbGljaz17KCk9PntidWRkeWZ1bmMoQnVkZHksIGlkeCk7IGNvbnNvbGUubG9nKCdjbGlja2VkIHRoZSByaWdodCBvZW4nKX19PlNlbmQgZnJpZW5kIHJlcXVlc3Q8L2E+IFxyXG4gICAgICA8ZGl2IGlkPVwiZnJpZW5kUmVxQ29uZlwiPjwvZGl2PlxyXG4gIFx0PC9kaXY+XHJcbiAgPC9kaXY+XHJcbilcclxuXHJcblxyXG53aW5kb3cuQnVkZHlFbnRyeSA9IEJ1ZGR5RW50cnk7XHJcbiJdfQ==