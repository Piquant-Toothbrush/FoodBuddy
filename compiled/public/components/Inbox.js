"use strict";

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var d = c[i]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(b, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var Inbox = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      requests: null
    };
    return d;
  }

  _createClass(b, [{
    key: "render",
    value: function render() {

      var c = this,
          d = this.props.pplWhoWantToBeFriends.length === 0 ? "No pending requests" : "",
          e = this.props.responsesAnswered.length === 0 ? "No request responses" : "";


      return React.createElement(
        "div",
        { className: "notification collection" },
        React.createElement(
          "div",
          { className: "header" },
          "Inbox"
        ),
        React.createElement(
          "div",
          { className: "notificationLable" },
          "Your pending requests"
        ),
        React.createElement(
          "div",
          { className: "updateMsg" },
          d
        ),
        this.props.pplWhoWantToBeFriends.map(function (f) {
          return React.createElement(InboxEntry, {
            accept: c.props.accept,
            decline: c.props.decline,
            inboxName: f[0],
            requestType: f[1],
            requestMovie: f[2],
            messageInfo: f[3]
          });
        }),
        React.createElement(
          "div",
          { className: "notificationLable" },
          "request responses"
        ),
        React.createElement(
          "div",
          { className: "updateMsg" },
          e
        ),
        this.props.responsesAnswered.map(function (f) {
          return React.createElement(Responses, {
            responsesInfo: f.requestee,
            responseAnswer: f.response,
            responseType: f.requestTyp,
            movie: f.movie,
            self: f.requestor,
            remove: c.props.remove
          });
        })
      );
    }
  }]);

  return b;
}(React.Component);

window.Inbox = Inbox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94LmpzeCJdLCJuYW1lcyI6WyJJbmJveCIsInByb3BzIiwic3RhdGUiLCJyZXF1ZXN0cyIsInRoYXQiLCJlbXB0eSIsInBwbFdob1dhbnRUb0JlRnJpZW5kcyIsImxlbmd0aCIsImVtcHR5MiIsInJlc3BvbnNlc0Fuc3dlcmVkIiwibWFwIiwiYWNjZXB0IiwiZGVjbGluZSIsImZyaWVuZCIsInVuaXQiLCJyZXF1ZXN0ZWUiLCJyZXNwb25zZSIsInJlcXVlc3RUeXAiLCJtb3ZpZSIsInJlcXVlc3RvciIsInJlbW92ZSIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLEs7OztBQUNKLGFBQVlDLENBQVosRUFBbUI7QUFBQTs7QUFBQSxrR0FDWEEsQ0FEVzs7QUFHakIsTUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGdCQUFVO0FBREMsS0FBYjtBQUhpQjtBQU1sQjs7Ozs2QkFFUTs7QUFLUCxVQUFJQyxJQUFPLElBQVg7QUFBQSxVQUNJQyxJQUFRLEtBQUtKLEtBQUwsQ0FBV0sscUJBQVgsQ0FBaUNDLE1BQWpDLEtBQTRDLENBQTVDLEdBQWdELHFCQUFoRCxHQUF3RSxFQURwRjtBQUFBLFVBRUlDLElBQVMsS0FBS1AsS0FBTCxDQUFXUSxpQkFBWCxDQUE2QkYsTUFBN0IsS0FBd0MsQ0FBeEMsR0FBNEMsc0JBQTVDLEdBQXFFLEVBRmxGOzs7QUFJQSxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUseUJBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFFBQWY7QUFBQTtBQUFBLFNBREY7QUFHRTtBQUFBO0FBQUEsWUFBSyxXQUFVLG1CQUFmO0FBQUE7QUFBQSxTQUhGO0FBSUU7QUFBQTtBQUFBLFlBQUssV0FBVSxXQUFmO0FBQTRCRjtBQUE1QixTQUpGO0FBS0csYUFBS0osS0FBTCxDQUFXSyxxQkFBWCxDQUFpQ0ksR0FBakMsQ0FBcUM7QUFBQSxpQkFDcEMsb0JBQUMsVUFBRDtBQUNFLG9CQUFRTixFQUFLSCxLQUFMLENBQVdVLE1BRHJCO0FBRUUscUJBQVNQLEVBQUtILEtBQUwsQ0FBV1csT0FGdEI7QUFHRSx1QkFBV0MsRUFBTyxDQUFQLENBSGI7QUFJRSx5QkFBYUEsRUFBTyxDQUFQLENBSmY7QUFLRSwwQkFBY0EsRUFBTyxDQUFQLENBTGhCO0FBTUUseUJBQWFBLEVBQU8sQ0FBUDtBQU5mLFlBRG9DO0FBQUEsU0FBckMsQ0FMSDtBQWdCRTtBQUFBO0FBQUEsWUFBSyxXQUFVLG1CQUFmO0FBQUE7QUFBQSxTQWhCRjtBQWlCRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFdBQWY7QUFBNEJMO0FBQTVCLFNBakJGO0FBa0JHLGFBQUtQLEtBQUwsQ0FBV1EsaUJBQVgsQ0FBNkJDLEdBQTdCLENBQWlDLFVBQUNJLENBQUQ7QUFBQSxpQkFDaEMsb0JBQUMsU0FBRDtBQUNFLDJCQUFlQSxFQUFLQyxTQUR0QjtBQUVFLDRCQUFnQkQsRUFBS0UsUUFGdkI7QUFHRSwwQkFBY0YsRUFBS0csVUFIckI7QUFJRSxtQkFBT0gsRUFBS0ksS0FKZDtBQUtFLGtCQUFNSixFQUFLSyxTQUxiO0FBTUUsb0JBQVFmLEVBQUtILEtBQUwsQ0FBV21CO0FBTnJCLFlBRGdDO0FBQUEsU0FBakM7QUFsQkgsT0FERjtBQStCRDs7OztFQWpEaUJDLE1BQU1DLFM7O0FBb0QxQkMsT0FBT3ZCLEtBQVAsR0FBZUEsS0FBZiIsImZpbGUiOiJJbmJveC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEluYm94IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHJlcXVlc3RzOiBudWxsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG5cclxuXHJcblxyXG5cclxuICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgIHZhciBlbXB0eSA9IHRoaXMucHJvcHMucHBsV2hvV2FudFRvQmVGcmllbmRzLmxlbmd0aCA9PT0gMCA/IFwiTm8gcGVuZGluZyByZXF1ZXN0c1wiIDogXCJcIjtcclxuICAgIHZhciBlbXB0eTIgPSB0aGlzLnByb3BzLnJlc3BvbnNlc0Fuc3dlcmVkLmxlbmd0aCA9PT0gMCA/IFwiTm8gcmVxdWVzdCByZXNwb25zZXNcIiA6IFwiXCI7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9J25vdGlmaWNhdGlvbiBjb2xsZWN0aW9uJz5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJz5JbmJveDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbkxhYmxlXCI+WW91ciBwZW5kaW5nIHJlcXVlc3RzPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj57ZW1wdHl9PC9kaXY+XHJcbiAgICAgICAge3RoaXMucHJvcHMucHBsV2hvV2FudFRvQmVGcmllbmRzLm1hcChmcmllbmQgPT5cclxuICAgICAgICAgIDxJbmJveEVudHJ5XHJcbiAgICAgICAgICAgIGFjY2VwdD17dGhhdC5wcm9wcy5hY2NlcHR9XHJcbiAgICAgICAgICAgIGRlY2xpbmU9e3RoYXQucHJvcHMuZGVjbGluZX1cclxuICAgICAgICAgICAgaW5ib3hOYW1lPXtmcmllbmRbMF19XHJcbiAgICAgICAgICAgIHJlcXVlc3RUeXBlPXtmcmllbmRbMV19XHJcbiAgICAgICAgICAgIHJlcXVlc3RNb3ZpZT17ZnJpZW5kWzJdfVxyXG4gICAgICAgICAgICBtZXNzYWdlSW5mbz17ZnJpZW5kWzNdfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICApfVxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5vdGlmaWNhdGlvbkxhYmxlXCI+cmVxdWVzdCByZXNwb25zZXM8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPntlbXB0eTJ9PC9kaXY+XHJcbiAgICAgICAge3RoaXMucHJvcHMucmVzcG9uc2VzQW5zd2VyZWQubWFwKCh1bml0KSA9PlxyXG4gICAgICAgICAgPFJlc3BvbnNlc1xyXG4gICAgICAgICAgICByZXNwb25zZXNJbmZvPXt1bml0LnJlcXVlc3RlZX0gXHJcbiAgICAgICAgICAgIHJlc3BvbnNlQW5zd2VyPXt1bml0LnJlc3BvbnNlfSBcclxuICAgICAgICAgICAgcmVzcG9uc2VUeXBlPXt1bml0LnJlcXVlc3RUeXB9IFxyXG4gICAgICAgICAgICBtb3ZpZT17dW5pdC5tb3ZpZX1cclxuICAgICAgICAgICAgc2VsZj17dW5pdC5yZXF1ZXN0b3J9XHJcbiAgICAgICAgICAgIHJlbW92ZT17dGhhdC5wcm9wcy5yZW1vdmV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5JbmJveCA9IEluYm94O1xyXG4iXX0=