'use strict';

var MovieList = function MovieList(_ref) {
  var movies = _ref.movies;
  var change = _ref.change;

  return React.createElement(
    'div',
    { className: 'movieList' },
    movies.map(function (movie, i) {
      return React.createElement(MovieListEntry, {
        movie: movie,
        change: change,
        key: movie.title });
    })
  );
};

window.MovieList = MovieList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZUxpc3QuanMiXSwibmFtZXMiOlsiTW92aWVMaXN0IiwibW92aWVzIiwiY2hhbmdlIiwibWFwIiwibW92aWUiLCJpIiwidGl0bGUiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsWUFBWSxTQUFaQSxTQUFZLE9BQXNCO0FBQUEsTUFBcEJDLE1BQW9CLFFBQXBCQSxNQUFvQjtBQUFBLE1BQVpDLE1BQVksUUFBWkEsTUFBWTs7QUFDckMsU0FBUTtBQUFBO0FBQUEsTUFBSyxXQUFVLFdBQWY7QUFDTEQsV0FBT0UsR0FBUCxDQUFXLFVBQUNDLEtBQUQsRUFBUUMsQ0FBUjtBQUFBLGFBQWMsb0JBQUMsY0FBRDtBQUN2QixlQUFTRCxLQURjO0FBRXZCLGdCQUFVRixNQUZhO0FBR3ZCLGFBQU9FLE1BQU1FLEtBSFUsR0FBZDtBQUFBLEtBQVg7QUFESyxHQUFSO0FBTUEsQ0FQRDs7QUFTQUMsT0FBT1AsU0FBUCxHQUFtQkEsU0FBbkIiLCJmaWxlIjoiTW92aWVMaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1vdmllTGlzdCA9ICh7bW92aWVzLCBjaGFuZ2V9KSA9PiB7XHJcblx0cmV0dXJuICg8ZGl2IGNsYXNzTmFtZT0nbW92aWVMaXN0Jz5cclxuXHRcdHsgbW92aWVzLm1hcCgobW92aWUsIGkpID0+IDxNb3ZpZUxpc3RFbnRyeVxyXG4gICAgICBtb3ZpZSA9IHttb3ZpZX0gXHJcbiAgICAgIGNoYW5nZSA9IHtjaGFuZ2V9XHJcbiAgICAgIGtleSA9IHttb3ZpZS50aXRsZX0gLz4gKX1cclxuXHQ8L2Rpdj4pO1xyXG59O1xyXG5cclxud2luZG93Lk1vdmllTGlzdCA9IE1vdmllTGlzdDsiXX0=