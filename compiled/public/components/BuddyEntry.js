'use strict';

var BuddyEntry = function BuddyEntry(_ref) {
  var Buddy = _ref.Buddy;
  var BuddyScore = _ref.BuddyScore;
  var buddyfunc = _ref.buddyfunc;
  var idx = _ref.idx;
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
        Buddy
      ),
      React.createElement(
        'div',
        { className: 'buddyCompatibility' },
        BuddyScore === 'Nothing to compare' ? 'Compatability: ' + Buddy + ' has not rated any movies' : 'Compatability: ' + BuddyScore
      ),
      React.createElement(
        'a',
        { id: idx, className: 'waves-effect waves-light btn', onClick: function onClick() {
            buddyfunc(Buddy, idx);console.log('clicked the right oen');
          } },
        'Send friend request'
      ),
      React.createElement('div', { id: 'friendReqConf' })
    )
  );
};

window.BuddyEntry = BuddyEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0J1ZGR5RW50cnkuanMiXSwibmFtZXMiOlsiQnVkZHlFbnRyeSIsIkJ1ZGR5IiwiQnVkZHlTY29yZSIsImJ1ZGR5ZnVuYyIsImlkeCIsImNvbnNvbGUiLCJsb2ciLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsYUFBYSxTQUFiQSxVQUFhO0FBQUEsTUFBRUMsS0FBRixRQUFFQSxLQUFGO0FBQUEsTUFBU0MsVUFBVCxRQUFTQSxVQUFUO0FBQUEsTUFBb0JDLFNBQXBCLFFBQW9CQSxTQUFwQjtBQUFBLE1BQStCQyxHQUEvQixRQUErQkEsR0FBL0I7QUFBQSxTQUNqQjtBQUFBO0FBQUEsTUFBSyxXQUFVLHFCQUFmO0FBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxRQUFmO0FBQ0MsbUNBQUssV0FBVSxpQkFBZixFQUFpQyxLQUFLLHFDQUF0QztBQURELEtBREY7QUFJRTtBQUFBO0FBQUEsUUFBSyxJQUFHLFFBQVIsRUFBaUIsV0FBVSxjQUEzQjtBQUNDO0FBQUE7QUFBQSxVQUFJLFdBQVUsV0FBZDtBQUEyQkg7QUFBM0IsT0FERDtBQUVFO0FBQUE7QUFBQSxVQUFLLFdBQVUsb0JBQWY7QUFBc0NDLHVCQUFlLG9CQUFoQix1QkFBMERELEtBQTFELHFEQUErR0M7QUFBcEosT0FGRjtBQUdDO0FBQUE7QUFBQSxVQUFJLElBQUlFLEdBQVIsRUFBYSxXQUFVLDhCQUF2QixFQUFzRCxTQUFTLG1CQUFJO0FBQUNELHNCQUFVRixLQUFWLEVBQWlCRyxHQUFqQixFQUF1QkMsUUFBUUMsR0FBUixDQUFZLHVCQUFaO0FBQXFDLFdBQWhJO0FBQUE7QUFBQSxPQUhEO0FBSUUsbUNBQUssSUFBRyxlQUFSO0FBSkY7QUFKRixHQURpQjtBQUFBLENBQW5COztBQWVBQyxPQUFPUCxVQUFQLEdBQW9CQSxVQUFwQiIsImZpbGUiOiJCdWRkeUVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQnVkZHlFbnRyeSA9ICh7QnVkZHksIEJ1ZGR5U2NvcmUsYnVkZHlmdW5jLCBpZHh9KSA9PiAoXHJcbiAgPGRpdiBjbGFzc05hbWU9J2NvbGxlY3Rpb24taXRlbSByb3cnPlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczNcIj5cclxuICAgIFx0PGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgaWQ9XCJGcmllbmRcIiBjbGFzc05hbWU9XCJidWRkeSBjb2wgczlcIj5cclxuICAgXHRcdDxoMyBjbGFzc05hbWU9XCJidWRkeU5hbWVcIj57QnVkZHl9PC9oMz5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWRkeUNvbXBhdGliaWxpdHlcIj57KEJ1ZGR5U2NvcmUgPT09ICdOb3RoaW5nIHRvIGNvbXBhcmUnKSA/IGBDb21wYXRhYmlsaXR5OiAke0J1ZGR5fSBoYXMgbm90IHJhdGVkIGFueSBtb3ZpZXNgIDogYENvbXBhdGFiaWxpdHk6ICR7QnVkZHlTY29yZX1gfTwvZGl2PlxyXG4gICBcdFx0PGEgIGlkPXtpZHh9IGNsYXNzTmFtZT0nd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0bicgb25DbGljaz17KCk9PntidWRkeWZ1bmMoQnVkZHksIGlkeCk7IGNvbnNvbGUubG9nKCdjbGlja2VkIHRoZSByaWdodCBvZW4nKX19PlNlbmQgZnJpZW5kIHJlcXVlc3Q8L2E+IFxyXG4gICAgICA8ZGl2IGlkPVwiZnJpZW5kUmVxQ29uZlwiPjwvZGl2PlxyXG4gIFx0PC9kaXY+XHJcbiAgPC9kaXY+XHJcbilcclxuXHJcblxyXG53aW5kb3cuQnVkZHlFbnRyeSA9IEJ1ZGR5RW50cnk7XHJcblxyXG4iXX0=