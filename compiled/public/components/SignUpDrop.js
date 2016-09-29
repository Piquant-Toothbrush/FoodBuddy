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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcERyb3AuanMiXSwibmFtZXMiOlsiU2lnblVwRHJvcCIsInByb3BzIiwic3RhdGUiLCJmaWxlcyIsImV2ZW50IiwiZmQiLCJyZWZzIiwiZmlsZSIsImdldERPTU5vZGUiLCIkIiwiYWpheCIsInVybCIsImRhdGEiLCJwcm9jZXNzRGF0YSIsImNvbnRlbnRUeXBlIiwidHlwZSIsInN1Y2Nlc3MiLCJwcmV2ZW50RGVmYXVsdCIsInVwbG9hZEZpbGUiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxVOzs7QUFDSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBR2pCLE1BQUtDLEtBQUwsR0FBYTtBQUNYQyxhQUFPO0FBREksS0FBYjtBQUhpQjtBQU1sQjs7OzsrQkFFVUMsQyxFQUFPO0FBQ2hCLFVBQUlDLEtBQU0sUUFBUSxLQUFLQyxJQUFMLENBQVVDLElBQVYsQ0FBZUMsVUFBZixHQUE0QkQsSUFBNUIsQ0FBaUMsQ0FBakMsQ0FBZCxDQUFKOztBQUVBRSxRQUFFQyxJQUFGLENBQU87QUFDTEMsYUFBSywwQ0FEQTtBQUVMQyxjQUFNUCxDQUZEO0FBR0xRLHVCQUhLO0FBSUxDLHVCQUpLO0FBS0xDLGNBQU0sTUFMRDtBQU1MQyxpQkFBUyxvQkFBTyxDQUVmO0FBUkksT0FBUDtBQVVBWixRQUFNYSxjQUFOO0FBQ0Q7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQU0sS0FBSSxZQUFWLEVBQXVCLFdBQVUsVUFBakMsRUFBNEMsU0FBUSxxQkFBcEQ7QUFDRSx5Q0FBTyxLQUFJLE1BQVgsRUFBa0IsTUFBSyxNQUF2QixFQUE4QixNQUFLLE1BQW5DLEVBQTBDLFdBQVUsYUFBcEQsR0FERjtBQUVFLHlDQUFPLE1BQUssUUFBWixFQUFxQixLQUFJLFFBQXpCLEVBQWtDLE9BQU0sUUFBeEMsRUFBaUQsU0FBUyxLQUFLQyxVQUEvRDtBQUZGO0FBREYsT0FERjtBQVFEOzs7O0VBbENzQkMsTUFBTUMsUzs7QUFzQy9CQyxPQUFPckIsVUFBUCxHQUFvQkEsVUFBcEIiLCJmaWxlIjoiU2lnblVwRHJvcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNpZ25VcERyb3AgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcbiAgICBcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIGZpbGVzOiBbXVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHVwbG9hZEZpbGUoZXZlbnQpIHtcclxuICAgIHZhciBmZCA9ICgnZmlsZScsIHRoaXMucmVmcy5maWxlLmdldERPTU5vZGUoKS5maWxlWzBdKTtcclxuXHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6ICdodHRwczovL3JlZWxmcmllbmR6Lmhlcm9rdWFwcC5jb20vVXBsb2FkJyxcclxuICAgICAgZGF0YTogZmQsXHJcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgIHN1Y2Nlc3M6IGRhdGEgPT57XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdj5cclxuICAgICAgICA8Zm9ybSByZWY9J3VwbG9hZEZvcm0nIGNsYXNzTmFtZT0ndXBsb2FkZXInIGVuY1R5cGU9J211bHRpcGFydC9mb3JtLWRhdGEnPlxyXG4gICAgICAgICAgPGlucHV0IHJlZj0nZmlsZScgdHlwZT0nZmlsZScgbmFtZT0nZmlsZScgY2xhc3NOYW1lPSd1cGxvYWQtZmlsZScgLz5cclxuICAgICAgICAgIDxpbnB1dCB0eXBlPSdidXR0b24nIHJlZj0nYnV0dG9uJyB2YWx1ZT0nVXBsb2FkJyBvbkNsaWNrPXt0aGlzLnVwbG9hZEZpbGV9IC8+XHJcbiAgICAgICAgPC9mb3JtPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxud2luZG93LlNpZ25VcERyb3AgPSBTaWduVXBEcm9wOyJdfQ==