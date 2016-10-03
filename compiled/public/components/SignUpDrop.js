'use strict';

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var d = c[i]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(b, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var SignUpDrop = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      files: []
    };
    return d;
  }

  _createClass(b, [{
    key: 'uploadFile',
    value: function uploadFile(c) {
      var d = ('file', this.refs.file.getDOMNode().file[0]);

      $.ajax({
        url: 'https://reelfriendz.herokuapp.com/Upload',
        data: d,
        processData: !1,
        contentType: !1,
        type: 'POST',
        success: function success(e) {}
      });
      c.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'form',
          { ref: 'uploadForm', className: 'uploader', encType: 'multipart/form-data' },
          React.createElement('input', { ref: 'file', type: 'file', name: 'file', className: 'upload-file' }),
          React.createElement('input', { type: 'button', ref: 'button', value: 'Upload', onClick: this.uploadFile })
        )
      );
    }
  }]);

  return b;
}(React.Component);

window.SignUpDrop = SignUpDrop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcERyb3AuanN4Il0sIm5hbWVzIjpbIlNpZ25VcERyb3AiLCJwcm9wcyIsInN0YXRlIiwiZmlsZXMiLCJldmVudCIsImZkIiwicmVmcyIsImZpbGUiLCJnZXRET01Ob2RlIiwiJCIsImFqYXgiLCJ1cmwiLCJkYXRhIiwicHJvY2Vzc0RhdGEiLCJjb250ZW50VHlwZSIsInR5cGUiLCJzdWNjZXNzIiwicHJldmVudERlZmF1bHQiLCJ1cGxvYWRGaWxlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsVTs7O0FBQ0osYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUdqQixNQUFLQyxLQUFMLEdBQWE7QUFDWEMsYUFBTztBQURJLEtBQWI7QUFIaUI7QUFNbEI7Ozs7K0JBRVVDLEMsRUFBTztBQUNoQixVQUFJQyxLQUFNLFFBQVEsS0FBS0MsSUFBTCxDQUFVQyxJQUFWLENBQWVDLFVBQWYsR0FBNEJELElBQTVCLENBQWlDLENBQWpDLENBQWQsQ0FBSjs7QUFFQUUsUUFBRUMsSUFBRixDQUFPO0FBQ0xDLGFBQUssMENBREE7QUFFTEMsY0FBTVAsQ0FGRDtBQUdMUSx1QkFISztBQUlMQyx1QkFKSztBQUtMQyxjQUFNLE1BTEQ7QUFNTEMsaUJBQVMsb0JBQU8sQ0FFZjtBQVJJLE9BQVA7QUFVQVosUUFBTWEsY0FBTjtBQUNEOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxZQUFNLEtBQUksWUFBVixFQUF1QixXQUFVLFVBQWpDLEVBQTRDLFNBQVEscUJBQXBEO0FBQ0UseUNBQU8sS0FBSSxNQUFYLEVBQWtCLE1BQUssTUFBdkIsRUFBOEIsTUFBSyxNQUFuQyxFQUEwQyxXQUFVLGFBQXBELEdBREY7QUFFRSx5Q0FBTyxNQUFLLFFBQVosRUFBcUIsS0FBSSxRQUF6QixFQUFrQyxPQUFNLFFBQXhDLEVBQWlELFNBQVMsS0FBS0MsVUFBL0Q7QUFGRjtBQURGLE9BREY7QUFRRDs7OztFQWxDc0JDLE1BQU1DLFM7O0FBc0MvQkMsT0FBT3JCLFVBQVAsR0FBb0JBLFVBQXBCIiwiZmlsZSI6IlNpZ25VcERyb3AuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTaWduVXBEcm9wIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBmaWxlczogW11cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICB1cGxvYWRGaWxlKGV2ZW50KSB7XHJcbiAgICB2YXIgZmQgPSAoJ2ZpbGUnLCB0aGlzLnJlZnMuZmlsZS5nZXRET01Ob2RlKCkuZmlsZVswXSk7XHJcblxyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiAnaHR0cHM6Ly9yZWVsZnJpZW5kei5oZXJva3VhcHAuY29tL1VwbG9hZCcsXHJcbiAgICAgIGRhdGE6IGZkLFxyXG4gICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICBzdWNjZXNzOiBkYXRhID0+e1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPGZvcm0gcmVmPSd1cGxvYWRGb3JtJyBjbGFzc05hbWU9J3VwbG9hZGVyJyBlbmNUeXBlPSdtdWx0aXBhcnQvZm9ybS1kYXRhJz5cclxuICAgICAgICAgIDxpbnB1dCByZWY9J2ZpbGUnIHR5cGU9J2ZpbGUnIG5hbWU9J2ZpbGUnIGNsYXNzTmFtZT0ndXBsb2FkLWZpbGUnIC8+XHJcbiAgICAgICAgICA8aW5wdXQgdHlwZT0nYnV0dG9uJyByZWY9J2J1dHRvbicgdmFsdWU9J1VwbG9hZCcgb25DbGljaz17dGhpcy51cGxvYWRGaWxlfSAvPlxyXG4gICAgICAgIDwvZm9ybT5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbndpbmRvdy5TaWduVXBEcm9wID0gU2lnblVwRHJvcDsiXX0=