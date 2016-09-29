"use strict";

var SingleFriend = function SingleFriend(_ref) {
	var a = _ref.moviesOfFriend,
	    b = _ref.onClick,
	    c = _ref.friendName,
	    d = _ref.change;

	// console.log('props.moviesOfFriend', moviesOfFriend)
	if (!a.length) {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"a",
				{ id: "backToAllFriends", className: "center waves-effect waves-light btn", onClick: function onClick() {
						return b("Friends");
					} },
				"Back to all friends"
			),
			React.createElement(
				"h5",
				{ id: "noFriendMovies", "class": "header lable" },
				"Sorry, ",
				c,
				" hasn't rated any movies."
			)
		);
	} else {
		return React.createElement(
			"div",
			{ className: "Home collection" },
			React.createElement(
				"a",
				{ id: "backToAllFriends", className: "center waves-effect waves-light btn", onClick: function onClick() {
						return b("Friends");
					} },
				"Back to all friends"
			),
			React.createElement(
				"div",
				{ className: "header large" },
				" list of ",
				c,
				"'s movies"
			),
			React.createElement(
				"div",
				{ className: "moviesOfFriend" },
				a.map(function (e) {
					return React.createElement(MovieListEntry, { friendName: c, movie: e, change: d });
				})
			)
		);
	}
};

window.SingleFriend = SingleFriend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpbmdsZUZyaWVuZC5qcyJdLCJuYW1lcyI6WyJTaW5nbGVGcmllbmQiLCJtb3ZpZXNPZkZyaWVuZCIsIm9uQ2xpY2siLCJmcmllbmROYW1lIiwiY2hhbmdlIiwibGVuZ3RoIiwibWFwIiwibW92aWUiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsZUFBZSxTQUFmQSxZQUFlLE9BQWlEO0FBQUEsS0FBL0NDLENBQStDLFFBQS9DQSxjQUErQztBQUFBLEtBQWhDQyxDQUFnQyxRQUFoQ0EsT0FBZ0M7QUFBQSxLQUF4QkMsQ0FBd0IsUUFBeEJBLFVBQXdCO0FBQUEsS0FBWkMsQ0FBWSxRQUFaQSxNQUFZOztBQUduRTtBQUNBLEtBQUksQ0FBQ0gsRUFBZUksTUFBcEIsRUFBMkI7QUFDMUIsU0FDQztBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUEsTUFBRyxJQUFHLGtCQUFOLEVBQXlCLFdBQVUscUNBQW5DLEVBQXlFLFNBQVM7QUFBQSxhQUFPSCxFQUFRLFNBQVIsQ0FBUDtBQUFBLE1BQWxGO0FBQUE7QUFBQSxJQURBO0FBR0E7QUFBQTtBQUFBLE1BQUksSUFBRyxnQkFBUCxFQUF3QixTQUFNLGNBQTlCO0FBQUE7QUFBcURDLEtBQXJEO0FBQUE7QUFBQTtBQUhBLEdBREQ7QUFRQSxFQVRELE1BU087QUFDTixTQUNDO0FBQUE7QUFBQSxLQUFLLFdBQVUsaUJBQWY7QUFDQTtBQUFBO0FBQUEsTUFBRyxJQUFHLGtCQUFOLEVBQXlCLFdBQVUscUNBQW5DLEVBQXlFLFNBQVM7QUFBQSxhQUFPRCxFQUFRLFNBQVIsQ0FBUDtBQUFBLE1BQWxGO0FBQUE7QUFBQSxJQURBO0FBRUE7QUFBQTtBQUFBLE1BQUssV0FBVSxjQUFmO0FBQUE7QUFBd0NDLEtBQXhDO0FBQUE7QUFBQSxJQUZBO0FBR0E7QUFBQTtBQUFBLE1BQUssV0FBVSxnQkFBZjtBQUNFRixNQUFlSyxHQUFmLENBQW1CO0FBQUEsWUFBUyxvQkFBQyxjQUFELElBQWdCLFlBQVlILENBQTVCLEVBQXdDLE9BQU9JLENBQS9DLEVBQXNELFFBQVFILENBQTlELEdBQVQ7QUFBQSxLQUFuQjtBQURGO0FBSEEsR0FERDtBQVNBO0FBQ0QsQ0F4QkQ7O0FBMEJBSSxPQUFPUixZQUFQLEdBQXNCQSxZQUF0QiIsImZpbGUiOiJTaW5nbGVGcmllbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU2luZ2xlRnJpZW5kID0gKHttb3ZpZXNPZkZyaWVuZCxvbkNsaWNrLGZyaWVuZE5hbWUsIGNoYW5nZX0pID0+IHtcclxuXHJcbmNvbnNvbGUubG9nKGZyaWVuZE5hbWUsJ2ZyaWVuZE5hbWUnKTtcclxuXHQvLyBjb25zb2xlLmxvZygncHJvcHMubW92aWVzT2ZGcmllbmQnLCBtb3ZpZXNPZkZyaWVuZClcclxuXHRpZiAoIW1vdmllc09mRnJpZW5kLmxlbmd0aCl7XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0XHQ8ZGl2PlxyXG5cdFx0XHQ8YSBpZD1cImJhY2tUb0FsbEZyaWVuZHNcIiBjbGFzc05hbWU9XCJjZW50ZXIgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IChvbkNsaWNrKFwiRnJpZW5kc1wiKSl9PkJhY2sgdG8gYWxsIGZyaWVuZHM8L2E+XHJcblx0XHRcdFxyXG5cdFx0XHQ8aDUgaWQ9XCJub0ZyaWVuZE1vdmllc1wiIGNsYXNzPVwiaGVhZGVyIGxhYmxlXCI+U29ycnksIHtmcmllbmROYW1lfSBoYXNuJ3QgcmF0ZWQgYW55IG1vdmllcy48L2g1PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0KVxyXG5cclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIChcclxuXHQgIDxkaXYgY2xhc3NOYW1lPVwiSG9tZSBjb2xsZWN0aW9uXCI+XHJcblx0XHRcdDxhIGlkPVwiYmFja1RvQWxsRnJpZW5kc1wiIGNsYXNzTmFtZT1cImNlbnRlciB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gKG9uQ2xpY2soXCJGcmllbmRzXCIpKX0+QmFjayB0byBhbGwgZnJpZW5kczwvYT5cclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJoZWFkZXIgbGFyZ2VcIj4gbGlzdCBvZiB7ZnJpZW5kTmFtZX0ncyBtb3ZpZXM8L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J21vdmllc09mRnJpZW5kJz5cclxuXHRcdFx0XHR7bW92aWVzT2ZGcmllbmQubWFwKG1vdmllID0+IDxNb3ZpZUxpc3RFbnRyeSBmcmllbmROYW1lPXtmcmllbmROYW1lfSBtb3ZpZT17bW92aWV9IGNoYW5nZT17Y2hhbmdlfS8+ICl9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0PC9kaXY+XHJcblx0XHQpXHJcblx0fVxyXG59O1xyXG5cclxud2luZG93LlNpbmdsZUZyaWVuZCA9IFNpbmdsZUZyaWVuZDtcclxuIl19