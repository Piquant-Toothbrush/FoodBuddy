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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94LmpzIl0sIm5hbWVzIjpbIkluYm94IiwicHJvcHMiLCJzdGF0ZSIsInJlcXVlc3RzIiwidGhhdCIsImVtcHR5IiwicHBsV2hvV2FudFRvQmVGcmllbmRzIiwibGVuZ3RoIiwiZW1wdHkyIiwicmVzcG9uc2VzQW5zd2VyZWQiLCJtYXAiLCJhY2NlcHQiLCJkZWNsaW5lIiwiZnJpZW5kIiwidW5pdCIsInJlcXVlc3RlZSIsInJlc3BvbnNlIiwicmVxdWVzdFR5cCIsIm1vdmllIiwicmVxdWVzdG9yIiwicmVtb3ZlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsSzs7O0FBQ0osYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUdqQixNQUFLQyxLQUFMLEdBQWE7QUFDWEMsZ0JBQVU7QUFEQyxLQUFiO0FBSGlCO0FBTWxCOzs7OzZCQUVROztBQUtQLFVBQUlDLElBQU8sSUFBWDtBQUFBLFVBQ0lDLElBQVEsS0FBS0osS0FBTCxDQUFXSyxxQkFBWCxDQUFpQ0MsTUFBakMsS0FBNEMsQ0FBNUMsR0FBZ0QscUJBQWhELEdBQXdFLEVBRHBGO0FBQUEsVUFFSUMsSUFBUyxLQUFLUCxLQUFMLENBQVdRLGlCQUFYLENBQTZCRixNQUE3QixLQUF3QyxDQUF4QyxHQUE0QyxzQkFBNUMsR0FBcUUsRUFGbEY7OztBQUlBLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSx5QkFBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZjtBQUFBO0FBQUEsU0FERjtBQUdFO0FBQUE7QUFBQSxZQUFLLFdBQVUsbUJBQWY7QUFBQTtBQUFBLFNBSEY7QUFJRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFdBQWY7QUFBNEJGO0FBQTVCLFNBSkY7QUFLRyxhQUFLSixLQUFMLENBQVdLLHFCQUFYLENBQWlDSSxHQUFqQyxDQUFxQztBQUFBLGlCQUNwQyxvQkFBQyxVQUFEO0FBQ0Usb0JBQVFOLEVBQUtILEtBQUwsQ0FBV1UsTUFEckI7QUFFRSxxQkFBU1AsRUFBS0gsS0FBTCxDQUFXVyxPQUZ0QjtBQUdFLHVCQUFXQyxFQUFPLENBQVAsQ0FIYjtBQUlFLHlCQUFhQSxFQUFPLENBQVAsQ0FKZjtBQUtFLDBCQUFjQSxFQUFPLENBQVAsQ0FMaEI7QUFNRSx5QkFBYUEsRUFBTyxDQUFQO0FBTmYsWUFEb0M7QUFBQSxTQUFyQyxDQUxIO0FBZ0JFO0FBQUE7QUFBQSxZQUFLLFdBQVUsbUJBQWY7QUFBQTtBQUFBLFNBaEJGO0FBaUJFO0FBQUE7QUFBQSxZQUFLLFdBQVUsV0FBZjtBQUE0Qkw7QUFBNUIsU0FqQkY7QUFrQkcsYUFBS1AsS0FBTCxDQUFXUSxpQkFBWCxDQUE2QkMsR0FBN0IsQ0FBaUMsVUFBQ0ksQ0FBRDtBQUFBLGlCQUNoQyxvQkFBQyxTQUFEO0FBQ0UsMkJBQWVBLEVBQUtDLFNBRHRCO0FBRUUsNEJBQWdCRCxFQUFLRSxRQUZ2QjtBQUdFLDBCQUFjRixFQUFLRyxVQUhyQjtBQUlFLG1CQUFPSCxFQUFLSSxLQUpkO0FBS0Usa0JBQU1KLEVBQUtLLFNBTGI7QUFNRSxvQkFBUWYsRUFBS0gsS0FBTCxDQUFXbUI7QUFOckIsWUFEZ0M7QUFBQSxTQUFqQztBQWxCSCxPQURGO0FBK0JEOzs7O0VBakRpQkMsTUFBTUMsUzs7QUFvRDFCQyxPQUFPdkIsS0FBUCxHQUFlQSxLQUFmIiwiZmlsZSI6IkluYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSW5ib3ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgcmVxdWVzdHM6IG51bGxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcblxyXG5cclxuXHJcblxyXG4gICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgdmFyIGVtcHR5ID0gdGhpcy5wcm9wcy5wcGxXaG9XYW50VG9CZUZyaWVuZHMubGVuZ3RoID09PSAwID8gXCJObyBwZW5kaW5nIHJlcXVlc3RzXCIgOiBcIlwiO1xyXG4gICAgdmFyIGVtcHR5MiA9IHRoaXMucHJvcHMucmVzcG9uc2VzQW5zd2VyZWQubGVuZ3RoID09PSAwID8gXCJObyByZXF1ZXN0IHJlc3BvbnNlc1wiIDogXCJcIjtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbm90aWZpY2F0aW9uIGNvbGxlY3Rpb24nPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInPkluYm94PC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uTGFibGVcIj5Zb3VyIHBlbmRpbmcgcmVxdWVzdHM8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPntlbXB0eX08L2Rpdj5cclxuICAgICAgICB7dGhpcy5wcm9wcy5wcGxXaG9XYW50VG9CZUZyaWVuZHMubWFwKGZyaWVuZCA9PlxyXG4gICAgICAgICAgPEluYm94RW50cnlcclxuICAgICAgICAgICAgYWNjZXB0PXt0aGF0LnByb3BzLmFjY2VwdH1cclxuICAgICAgICAgICAgZGVjbGluZT17dGhhdC5wcm9wcy5kZWNsaW5lfVxyXG4gICAgICAgICAgICBpbmJveE5hbWU9e2ZyaWVuZFswXX1cclxuICAgICAgICAgICAgcmVxdWVzdFR5cGU9e2ZyaWVuZFsxXX1cclxuICAgICAgICAgICAgcmVxdWVzdE1vdmllPXtmcmllbmRbMl19XHJcbiAgICAgICAgICAgIG1lc3NhZ2VJbmZvPXtmcmllbmRbM119XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICl9XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uTGFibGVcIj5yZXF1ZXN0IHJlc3BvbnNlczwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlTXNnXCI+e2VtcHR5Mn08L2Rpdj5cclxuICAgICAgICB7dGhpcy5wcm9wcy5yZXNwb25zZXNBbnN3ZXJlZC5tYXAoKHVuaXQpID0+XHJcbiAgICAgICAgICA8UmVzcG9uc2VzXHJcbiAgICAgICAgICAgIHJlc3BvbnNlc0luZm89e3VuaXQucmVxdWVzdGVlfSBcclxuICAgICAgICAgICAgcmVzcG9uc2VBbnN3ZXI9e3VuaXQucmVzcG9uc2V9IFxyXG4gICAgICAgICAgICByZXNwb25zZVR5cGU9e3VuaXQucmVxdWVzdFR5cH0gXHJcbiAgICAgICAgICAgIG1vdmllPXt1bml0Lm1vdmllfVxyXG4gICAgICAgICAgICBzZWxmPXt1bml0LnJlcXVlc3Rvcn1cclxuICAgICAgICAgICAgcmVtb3ZlPXt0aGF0LnByb3BzLnJlbW92ZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxud2luZG93LkluYm94ID0gSW5ib3g7XHJcbiJdfQ==