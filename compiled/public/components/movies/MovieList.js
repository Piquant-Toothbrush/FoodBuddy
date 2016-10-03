'use strict';

var MovieList = function MovieList(_ref) {
  var a = _ref.movies,
      b = _ref.change;

  return React.createElement(
    'div',
    { className: 'movieList' },
    a.map(function (c, i) {
      return React.createElement(MovieListEntry, {
        movie: c,
        change: b,
        key: c.title });
    })
  );
};

window.MovieList = MovieList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZUxpc3QuanN4Il0sIm5hbWVzIjpbIk1vdmllTGlzdCIsIm1vdmllcyIsImNoYW5nZSIsIm1hcCIsIm1vdmllIiwiaSIsInRpdGxlIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFlBQVksU0FBWkEsU0FBWSxPQUFzQjtBQUFBLE1BQXBCQyxDQUFvQixRQUFwQkEsTUFBb0I7QUFBQSxNQUFaQyxDQUFZLFFBQVpBLE1BQVk7O0FBQ3JDLFNBQVE7QUFBQTtBQUFBLE1BQUssV0FBVSxXQUFmO0FBQ0xELE1BQU9FLEdBQVAsQ0FBVyxVQUFDQyxDQUFELEVBQVFDLENBQVI7QUFBQSxhQUFjLG9CQUFDLGNBQUQ7QUFDdkIsZUFBU0QsQ0FEYztBQUV2QixnQkFBVUYsQ0FGYTtBQUd2QixhQUFPRSxFQUFNRSxLQUhVLEdBQWQ7QUFBQSxLQUFYO0FBREssR0FBUjtBQU1BLENBUEQ7O0FBU0FDLE9BQU9QLFNBQVAsR0FBbUJBLFNBQW5CIiwiZmlsZSI6Ik1vdmllTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNb3ZpZUxpc3QgPSAoe21vdmllcywgY2hhbmdlfSkgPT4ge1xyXG5cdHJldHVybiAoPGRpdiBjbGFzc05hbWU9J21vdmllTGlzdCc+XHJcblx0XHR7IG1vdmllcy5tYXAoKG1vdmllLCBpKSA9PiA8TW92aWVMaXN0RW50cnlcclxuICAgICAgbW92aWUgPSB7bW92aWV9IFxyXG4gICAgICBjaGFuZ2UgPSB7Y2hhbmdlfVxyXG4gICAgICBrZXkgPSB7bW92aWUudGl0bGV9IC8+ICl9XHJcblx0PC9kaXY+KTtcclxufTtcclxuXHJcbndpbmRvdy5Nb3ZpZUxpc3QgPSBNb3ZpZUxpc3Q7Il19