"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Inbox = function (_React$Component) {
  _inherits(Inbox, _React$Component);

  function Inbox(props) {
    _classCallCheck(this, Inbox);

    var _this = _possibleConstructorReturn(this, (Inbox.__proto__ || Object.getPrototypeOf(Inbox)).call(this, props));

    _this.state = {
      requests: null
    };
    return _this;
  }

  _createClass(Inbox, [{
    key: "render",
    value: function render() {

      var that = this;
      var empty = this.props.pplWhoWantToBeFriends.length === 0 ? "No pending requests" : "";
      var empty2 = this.props.responsesAnswered.length === 0 ? "No request responses" : "";

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
          empty
        ),
        this.props.pplWhoWantToBeFriends.map(function (friend) {
          return React.createElement(InboxEntry, {
            accept: that.props.accept,
            decline: that.props.decline,
            inboxName: friend[0],
            requestType: friend[1],
            requestMovie: friend[2],
            messageInfo: friend[3]
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
          empty2
        ),
        this.props.responsesAnswered.map(function (unit) {
          return React.createElement(Responses, {
            responsesInfo: unit.requestee,
            responseAnswer: unit.response,
            responseType: unit.requestTyp,
            movie: unit.movie,
            self: unit.requestor,
            remove: that.props.remove
          });
        })
      );
    }
  }]);

  return Inbox;
}(React.Component);

window.Inbox = Inbox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94LmpzIl0sIm5hbWVzIjpbIkluYm94IiwicHJvcHMiLCJzdGF0ZSIsInJlcXVlc3RzIiwidGhhdCIsImVtcHR5IiwicHBsV2hvV2FudFRvQmVGcmllbmRzIiwibGVuZ3RoIiwiZW1wdHkyIiwicmVzcG9uc2VzQW5zd2VyZWQiLCJtYXAiLCJhY2NlcHQiLCJkZWNsaW5lIiwiZnJpZW5kIiwidW5pdCIsInJlcXVlc3RlZSIsInJlc3BvbnNlIiwicmVxdWVzdFR5cCIsIm1vdmllIiwicmVxdWVzdG9yIiwicmVtb3ZlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsSzs7O0FBQ0osaUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw4R0FDWEEsS0FEVzs7QUFHakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGdCQUFVO0FBREMsS0FBYjtBQUhpQjtBQU1sQjs7Ozs2QkFFUTs7QUFLUCxVQUFJQyxPQUFPLElBQVg7QUFDQSxVQUFJQyxRQUFRLEtBQUtKLEtBQUwsQ0FBV0sscUJBQVgsQ0FBaUNDLE1BQWpDLEtBQTRDLENBQTVDLEdBQWdELHFCQUFoRCxHQUF3RSxFQUFwRjtBQUNBLFVBQUlDLFNBQVMsS0FBS1AsS0FBTCxDQUFXUSxpQkFBWCxDQUE2QkYsTUFBN0IsS0FBd0MsQ0FBeEMsR0FBNEMsc0JBQTVDLEdBQXFFLEVBQWxGOztBQUVBLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSx5QkFBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZjtBQUFBO0FBQUEsU0FERjtBQUdFO0FBQUE7QUFBQSxZQUFLLFdBQVUsbUJBQWY7QUFBQTtBQUFBLFNBSEY7QUFJRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFdBQWY7QUFBNEJGO0FBQTVCLFNBSkY7QUFLRyxhQUFLSixLQUFMLENBQVdLLHFCQUFYLENBQWlDSSxHQUFqQyxDQUFxQztBQUFBLGlCQUNwQyxvQkFBQyxVQUFEO0FBQ0Usb0JBQVFOLEtBQUtILEtBQUwsQ0FBV1UsTUFEckI7QUFFRSxxQkFBU1AsS0FBS0gsS0FBTCxDQUFXVyxPQUZ0QjtBQUdFLHVCQUFXQyxPQUFPLENBQVAsQ0FIYjtBQUlFLHlCQUFhQSxPQUFPLENBQVAsQ0FKZjtBQUtFLDBCQUFjQSxPQUFPLENBQVAsQ0FMaEI7QUFNRSx5QkFBYUEsT0FBTyxDQUFQO0FBTmYsWUFEb0M7QUFBQSxTQUFyQyxDQUxIO0FBZ0JFO0FBQUE7QUFBQSxZQUFLLFdBQVUsbUJBQWY7QUFBQTtBQUFBLFNBaEJGO0FBaUJFO0FBQUE7QUFBQSxZQUFLLFdBQVUsV0FBZjtBQUE0Qkw7QUFBNUIsU0FqQkY7QUFrQkcsYUFBS1AsS0FBTCxDQUFXUSxpQkFBWCxDQUE2QkMsR0FBN0IsQ0FBaUMsVUFBQ0ksSUFBRDtBQUFBLGlCQUNoQyxvQkFBQyxTQUFEO0FBQ0UsMkJBQWVBLEtBQUtDLFNBRHRCO0FBRUUsNEJBQWdCRCxLQUFLRSxRQUZ2QjtBQUdFLDBCQUFjRixLQUFLRyxVQUhyQjtBQUlFLG1CQUFPSCxLQUFLSSxLQUpkO0FBS0Usa0JBQU1KLEtBQUtLLFNBTGI7QUFNRSxvQkFBUWYsS0FBS0gsS0FBTCxDQUFXbUI7QUFOckIsWUFEZ0M7QUFBQSxTQUFqQztBQWxCSCxPQURGO0FBK0JEOzs7O0VBakRpQkMsTUFBTUMsUzs7QUFvRDFCQyxPQUFPdkIsS0FBUCxHQUFlQSxLQUFmIiwiZmlsZSI6IkluYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSW5ib3ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgcmVxdWVzdHM6IG51bGxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcblxyXG5cclxuXHJcblxyXG4gICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgdmFyIGVtcHR5ID0gdGhpcy5wcm9wcy5wcGxXaG9XYW50VG9CZUZyaWVuZHMubGVuZ3RoID09PSAwID8gXCJObyBwZW5kaW5nIHJlcXVlc3RzXCIgOiBcIlwiO1xyXG4gICAgdmFyIGVtcHR5MiA9IHRoaXMucHJvcHMucmVzcG9uc2VzQW5zd2VyZWQubGVuZ3RoID09PSAwID8gXCJObyByZXF1ZXN0IHJlc3BvbnNlc1wiIDogXCJcIjtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbm90aWZpY2F0aW9uIGNvbGxlY3Rpb24nPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInPkluYm94PC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uTGFibGVcIj5Zb3VyIHBlbmRpbmcgcmVxdWVzdHM8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPntlbXB0eX08L2Rpdj5cclxuICAgICAgICB7dGhpcy5wcm9wcy5wcGxXaG9XYW50VG9CZUZyaWVuZHMubWFwKGZyaWVuZCA9PlxyXG4gICAgICAgICAgPEluYm94RW50cnlcclxuICAgICAgICAgICAgYWNjZXB0PXt0aGF0LnByb3BzLmFjY2VwdH1cclxuICAgICAgICAgICAgZGVjbGluZT17dGhhdC5wcm9wcy5kZWNsaW5lfVxyXG4gICAgICAgICAgICBpbmJveE5hbWU9e2ZyaWVuZFswXX1cclxuICAgICAgICAgICAgcmVxdWVzdFR5cGU9e2ZyaWVuZFsxXX1cclxuICAgICAgICAgICAgcmVxdWVzdE1vdmllPXtmcmllbmRbMl19XHJcbiAgICAgICAgICAgIG1lc3NhZ2VJbmZvPXtmcmllbmRbM119XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICl9XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm90aWZpY2F0aW9uTGFibGVcIj5yZXF1ZXN0IHJlc3BvbnNlczwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlTXNnXCI+e2VtcHR5Mn08L2Rpdj5cclxuICAgICAgICB7dGhpcy5wcm9wcy5yZXNwb25zZXNBbnN3ZXJlZC5tYXAoKHVuaXQpID0+XHJcbiAgICAgICAgICA8UmVzcG9uc2VzXHJcbiAgICAgICAgICAgIHJlc3BvbnNlc0luZm89e3VuaXQucmVxdWVzdGVlfSBcclxuICAgICAgICAgICAgcmVzcG9uc2VBbnN3ZXI9e3VuaXQucmVzcG9uc2V9IFxyXG4gICAgICAgICAgICByZXNwb25zZVR5cGU9e3VuaXQucmVxdWVzdFR5cH0gXHJcbiAgICAgICAgICAgIG1vdmllPXt1bml0Lm1vdmllfVxyXG4gICAgICAgICAgICBzZWxmPXt1bml0LnJlcXVlc3Rvcn1cclxuICAgICAgICAgICAgcmVtb3ZlPXt0aGF0LnByb3BzLnJlbW92ZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxud2luZG93LkluYm94ID0gSW5ib3g7XHJcbiJdfQ==