"use strict";

var FriendRatingListEntry = function FriendRatingListEntry(_ref) {
  var a = _ref.name,
      b = _ref.rating;
  return React.createElement(
    "div",
    { className: "FriendRatingListEntry" },
    React.createElement(
      "span",
      { id: "friend" },
      "Name:",
      a
    ),
    React.createElement(
      "span",
      { id: "rating" },
      "Rating:",
      b
    ),
    React.createElement("br", null)
  );
};

window.FriendRatingListEntry = FriendRatingListEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZFJhdGluZ0xpc3RFbnRyeS5qc3giXSwibmFtZXMiOlsiRnJpZW5kUmF0aW5nTGlzdEVudHJ5IiwibmFtZSIsInJhdGluZyIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSx3QkFBd0IsU0FBeEJBLHFCQUF3QjtBQUFBLE1BQUVDLENBQUYsUUFBRUEsSUFBRjtBQUFBLE1BQVFDLENBQVIsUUFBUUEsTUFBUjtBQUFBLFNBQzFCO0FBQUE7QUFBQSxNQUFLLFdBQVUsdUJBQWY7QUFDRTtBQUFBO0FBQUEsUUFBTSxJQUFHLFFBQVQ7QUFBQTtBQUF3QkQ7QUFBeEIsS0FERjtBQUVFO0FBQUE7QUFBQSxRQUFNLElBQUcsUUFBVDtBQUFBO0FBQTBCQztBQUExQixLQUZGO0FBR0U7QUFIRixHQUQwQjtBQUFBLENBQTVCOztBQVFBQyxPQUFPSCxxQkFBUCxHQUErQkEscUJBQS9CIiwiZmlsZSI6IkZyaWVuZFJhdGluZ0xpc3RFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBGcmllbmRSYXRpbmdMaXN0RW50cnkgPSAoe25hbWUsIHJhdGluZ30pID0+IChcclxuICA8ZGl2IGNsYXNzTmFtZT1cIkZyaWVuZFJhdGluZ0xpc3RFbnRyeVwiPlxyXG4gICAgPHNwYW4gaWQ9XCJmcmllbmRcIj5OYW1lOntuYW1lfTwvc3Bhbj5cclxuICAgIDxzcGFuIGlkPVwicmF0aW5nXCI+UmF0aW5nOntyYXRpbmd9PC9zcGFuPlxyXG4gICAgPGJyLz5cclxuICA8L2Rpdj5cclxuKTtcclxuXHJcbndpbmRvdy5GcmllbmRSYXRpbmdMaXN0RW50cnkgPSBGcmllbmRSYXRpbmdMaXN0RW50cnk7Il19