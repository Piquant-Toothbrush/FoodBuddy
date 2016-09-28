"use strict";

var SingleFriend = function SingleFriend(_ref) {
	var moviesOfFriend = _ref.moviesOfFriend;
	var _onClick = _ref.onClick;
	var friendName = _ref.friendName;
	var change = _ref.change;


	console.log(friendName, 'friendName');
	// console.log('props.moviesOfFriend', moviesOfFriend)
	if (!moviesOfFriend.length) {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"a",
				{ id: "backToAllFriends", className: "center waves-effect waves-light btn", onClick: function onClick() {
						return _onClick("Friends");
					} },
				"Back to all friends"
			),
			React.createElement(
				"h5",
				{ id: "noFriendMovies", "class": "header lable" },
				"Sorry, ",
				friendName,
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
						return _onClick("Friends");
					} },
				"Back to all friends"
			),
			React.createElement(
				"div",
				{ className: "header large" },
				" list of ",
				friendName,
				"'s movies"
			),
			React.createElement(
				"div",
				{ className: "moviesOfFriend" },
				moviesOfFriend.map(function (movie) {
					return React.createElement(MovieListEntry, { friendName: friendName, movie: movie, change: change });
				})
			)
		);
	}
};

window.SingleFriend = SingleFriend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpbmdsZUZyaWVuZC5qcyJdLCJuYW1lcyI6WyJTaW5nbGVGcmllbmQiLCJtb3ZpZXNPZkZyaWVuZCIsIm9uQ2xpY2siLCJmcmllbmROYW1lIiwiY2hhbmdlIiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsIm1hcCIsIm1vdmllIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGVBQWUsU0FBZkEsWUFBZSxPQUFpRDtBQUFBLEtBQS9DQyxjQUErQyxRQUEvQ0EsY0FBK0M7QUFBQSxLQUFoQ0MsUUFBZ0MsUUFBaENBLE9BQWdDO0FBQUEsS0FBeEJDLFVBQXdCLFFBQXhCQSxVQUF3QjtBQUFBLEtBQVpDLE1BQVksUUFBWkEsTUFBWTs7O0FBRXBFQyxTQUFRQyxHQUFSLENBQVlILFVBQVosRUFBdUIsWUFBdkI7QUFDQztBQUNBLEtBQUksQ0FBQ0YsZUFBZU0sTUFBcEIsRUFBMkI7QUFDMUIsU0FDQztBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUEsTUFBRyxJQUFHLGtCQUFOLEVBQXlCLFdBQVUscUNBQW5DLEVBQXlFLFNBQVM7QUFBQSxhQUFPTCxTQUFRLFNBQVIsQ0FBUDtBQUFBLE1BQWxGO0FBQUE7QUFBQSxJQURBO0FBR0E7QUFBQTtBQUFBLE1BQUksSUFBRyxnQkFBUCxFQUF3QixTQUFNLGNBQTlCO0FBQUE7QUFBcURDLGNBQXJEO0FBQUE7QUFBQTtBQUhBLEdBREQ7QUFRQSxFQVRELE1BU087QUFDTixTQUNDO0FBQUE7QUFBQSxLQUFLLFdBQVUsaUJBQWY7QUFDQTtBQUFBO0FBQUEsTUFBRyxJQUFHLGtCQUFOLEVBQXlCLFdBQVUscUNBQW5DLEVBQXlFLFNBQVM7QUFBQSxhQUFPRCxTQUFRLFNBQVIsQ0FBUDtBQUFBLE1BQWxGO0FBQUE7QUFBQSxJQURBO0FBRUE7QUFBQTtBQUFBLE1BQUssV0FBVSxjQUFmO0FBQUE7QUFBd0NDLGNBQXhDO0FBQUE7QUFBQSxJQUZBO0FBR0E7QUFBQTtBQUFBLE1BQUssV0FBVSxnQkFBZjtBQUNFRixtQkFBZU8sR0FBZixDQUFtQjtBQUFBLFlBQVMsb0JBQUMsY0FBRCxJQUFnQixZQUFZTCxVQUE1QixFQUF3QyxPQUFPTSxLQUEvQyxFQUFzRCxRQUFRTCxNQUE5RCxHQUFUO0FBQUEsS0FBbkI7QUFERjtBQUhBLEdBREQ7QUFTQTtBQUNELENBeEJEOztBQTBCQU0sT0FBT1YsWUFBUCxHQUFzQkEsWUFBdEIiLCJmaWxlIjoiU2luZ2xlRnJpZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNpbmdsZUZyaWVuZCA9ICh7bW92aWVzT2ZGcmllbmQsb25DbGljayxmcmllbmROYW1lLCBjaGFuZ2V9KSA9PiB7XHJcblxyXG5jb25zb2xlLmxvZyhmcmllbmROYW1lLCdmcmllbmROYW1lJyk7XHJcblx0Ly8gY29uc29sZS5sb2coJ3Byb3BzLm1vdmllc09mRnJpZW5kJywgbW92aWVzT2ZGcmllbmQpXHJcblx0aWYgKCFtb3ZpZXNPZkZyaWVuZC5sZW5ndGgpe1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0PGEgaWQ9XCJiYWNrVG9BbGxGcmllbmRzXCIgY2xhc3NOYW1lPVwiY2VudGVyIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiAob25DbGljayhcIkZyaWVuZHNcIikpfT5CYWNrIHRvIGFsbCBmcmllbmRzPC9hPlxyXG5cdFx0XHRcclxuXHRcdFx0PGg1IGlkPVwibm9GcmllbmRNb3ZpZXNcIiBjbGFzcz1cImhlYWRlciBsYWJsZVwiPlNvcnJ5LCB7ZnJpZW5kTmFtZX0gaGFzbid0IHJhdGVkIGFueSBtb3ZpZXMuPC9oNT5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHRcdClcclxuXHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiAoXHJcblx0ICA8ZGl2IGNsYXNzTmFtZT1cIkhvbWUgY29sbGVjdGlvblwiPlxyXG5cdFx0XHQ8YSBpZD1cImJhY2tUb0FsbEZyaWVuZHNcIiBjbGFzc05hbWU9XCJjZW50ZXIgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IChvbkNsaWNrKFwiRnJpZW5kc1wiKSl9PkJhY2sgdG8gYWxsIGZyaWVuZHM8L2E+XHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyIGxhcmdlXCI+IGxpc3Qgb2Yge2ZyaWVuZE5hbWV9J3MgbW92aWVzPC9kaXY+XHJcblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtb3ZpZXNPZkZyaWVuZCc+XHJcblx0XHRcdFx0e21vdmllc09mRnJpZW5kLm1hcChtb3ZpZSA9PiA8TW92aWVMaXN0RW50cnkgZnJpZW5kTmFtZT17ZnJpZW5kTmFtZX0gbW92aWU9e21vdmllfSBjaGFuZ2U9e2NoYW5nZX0vPiApfVxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvZGl2PlxyXG5cdFx0KVxyXG5cdH1cclxufTtcclxuXHJcbndpbmRvdy5TaW5nbGVGcmllbmQgPSBTaW5nbGVGcmllbmQ7XHJcbiJdfQ==