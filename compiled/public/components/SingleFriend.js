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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpbmdsZUZyaWVuZC5qc3giXSwibmFtZXMiOlsiU2luZ2xlRnJpZW5kIiwibW92aWVzT2ZGcmllbmQiLCJvbkNsaWNrIiwiZnJpZW5kTmFtZSIsImNoYW5nZSIsImxlbmd0aCIsIm1hcCIsIm1vdmllIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGVBQWUsU0FBZkEsWUFBZSxPQUFpRDtBQUFBLEtBQS9DQyxDQUErQyxRQUEvQ0EsY0FBK0M7QUFBQSxLQUFoQ0MsQ0FBZ0MsUUFBaENBLE9BQWdDO0FBQUEsS0FBeEJDLENBQXdCLFFBQXhCQSxVQUF3QjtBQUFBLEtBQVpDLENBQVksUUFBWkEsTUFBWTs7QUFHbkU7QUFDQSxLQUFJLENBQUNILEVBQWVJLE1BQXBCLEVBQTJCO0FBQzFCLFNBQ0M7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLE1BQUcsSUFBRyxrQkFBTixFQUF5QixXQUFVLHFDQUFuQyxFQUF5RSxTQUFTO0FBQUEsYUFBT0gsRUFBUSxTQUFSLENBQVA7QUFBQSxNQUFsRjtBQUFBO0FBQUEsSUFEQTtBQUdBO0FBQUE7QUFBQSxNQUFJLElBQUcsZ0JBQVAsRUFBd0IsU0FBTSxjQUE5QjtBQUFBO0FBQXFEQyxLQUFyRDtBQUFBO0FBQUE7QUFIQSxHQUREO0FBUUEsRUFURCxNQVNPO0FBQ04sU0FDQztBQUFBO0FBQUEsS0FBSyxXQUFVLGlCQUFmO0FBQ0E7QUFBQTtBQUFBLE1BQUcsSUFBRyxrQkFBTixFQUF5QixXQUFVLHFDQUFuQyxFQUF5RSxTQUFTO0FBQUEsYUFBT0QsRUFBUSxTQUFSLENBQVA7QUFBQSxNQUFsRjtBQUFBO0FBQUEsSUFEQTtBQUVBO0FBQUE7QUFBQSxNQUFLLFdBQVUsY0FBZjtBQUFBO0FBQXdDQyxLQUF4QztBQUFBO0FBQUEsSUFGQTtBQUdBO0FBQUE7QUFBQSxNQUFLLFdBQVUsZ0JBQWY7QUFDRUYsTUFBZUssR0FBZixDQUFtQjtBQUFBLFlBQVMsb0JBQUMsY0FBRCxJQUFnQixZQUFZSCxDQUE1QixFQUF3QyxPQUFPSSxDQUEvQyxFQUFzRCxRQUFRSCxDQUE5RCxHQUFUO0FBQUEsS0FBbkI7QUFERjtBQUhBLEdBREQ7QUFTQTtBQUNELENBeEJEOztBQTBCQUksT0FBT1IsWUFBUCxHQUFzQkEsWUFBdEIiLCJmaWxlIjoiU2luZ2xlRnJpZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNpbmdsZUZyaWVuZCA9ICh7bW92aWVzT2ZGcmllbmQsb25DbGljayxmcmllbmROYW1lLCBjaGFuZ2V9KSA9PiB7XHJcblxyXG5jb25zb2xlLmxvZyhmcmllbmROYW1lLCdmcmllbmROYW1lJyk7XHJcblx0Ly8gY29uc29sZS5sb2coJ3Byb3BzLm1vdmllc09mRnJpZW5kJywgbW92aWVzT2ZGcmllbmQpXHJcblx0aWYgKCFtb3ZpZXNPZkZyaWVuZC5sZW5ndGgpe1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0PGEgaWQ9XCJiYWNrVG9BbGxGcmllbmRzXCIgY2xhc3NOYW1lPVwiY2VudGVyIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiAob25DbGljayhcIkZyaWVuZHNcIikpfT5CYWNrIHRvIGFsbCBmcmllbmRzPC9hPlxyXG5cdFx0XHRcclxuXHRcdFx0PGg1IGlkPVwibm9GcmllbmRNb3ZpZXNcIiBjbGFzcz1cImhlYWRlciBsYWJsZVwiPlNvcnJ5LCB7ZnJpZW5kTmFtZX0gaGFzbid0IHJhdGVkIGFueSBtb3ZpZXMuPC9oNT5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdClcclxuXHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiAoXHJcblx0ICA8ZGl2IGNsYXNzTmFtZT1cIkhvbWUgY29sbGVjdGlvblwiPlxyXG5cdFx0XHQ8YSBpZD1cImJhY2tUb0FsbEZyaWVuZHNcIiBjbGFzc05hbWU9XCJjZW50ZXIgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IChvbkNsaWNrKFwiRnJpZW5kc1wiKSl9PkJhY2sgdG8gYWxsIGZyaWVuZHM8L2E+XHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyIGxhcmdlXCI+IGxpc3Qgb2Yge2ZyaWVuZE5hbWV9J3MgbW92aWVzPC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtb3ZpZXNPZkZyaWVuZCc+XHJcblx0XHRcdFx0e21vdmllc09mRnJpZW5kLm1hcChtb3ZpZSA9PiA8TW92aWVMaXN0RW50cnkgZnJpZW5kTmFtZT17ZnJpZW5kTmFtZX0gbW92aWU9e21vdmllfSBjaGFuZ2U9e2NoYW5nZX0vPiApfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0KVxyXG5cdH1cclxufTtcclxuXHJcbndpbmRvdy5TaW5nbGVGcmllbmQgPSBTaW5nbGVGcmllbmQ7XHJcbiJdfQ==