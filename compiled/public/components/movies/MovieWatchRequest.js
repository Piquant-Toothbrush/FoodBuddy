'use strict';

var _createClass = function () { function a(b, c) { for (var i = 0; i < c.length; i++) { var d = c[i]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(b, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(a, b) { if (!a) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return b && (typeof b === "object" || typeof b === "function") ? b : a; }

function _inherits(a, b) { if (typeof b !== "function" && b !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof b); } a.prototype = Object.create(b && b.prototype, { constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 } }); if (b) Object.setPrototypeOf ? Object.setPrototypeOf(a, b) : a.__proto__ = b; }

var MovieWatchRequest = function (a) {
  _inherits(b, a);

  function b(c) {
    _classCallCheck(this, b);

    var d = _possibleConstructorReturn(this, (b.__proto__ || Object.getPrototypeOf(b)).call(this, c));

    d.state = {
      active: !1,
      friends: [],
      filteredFriends: [],
      friendStash: [],
      message: '',
      requestSent: !1,
      noRequesteeWarning: !1
    };
    return d;
  }

  _createClass(b, [{
    key: 'getFriendList',
    value: function getFriendList() {
      var _this2 = this;

      //send get request to retrive friends and set to this.state.friends
      $.get(Url + '/getFriendList').then(function (c) {
        // console.log('response from server', friends);
        var d = _.uniq(c);
        _this2.setState({
          friends: d,
          filteredFriends: d
        });
      });
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      //will turn this.state.active to true and rerender the view
      this.setState({
        active: !this.state.active,
        requestSent: !1

      });
      this.getFriendList();
    }
  }, {
    key: 'handleMsg',
    value: function handleMsg(c) {
      this.setState({
        message: c.target.value
      });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit() {
      var _this3 = this;

      //will send out a watch request for this.props.movie to friends in the stash
      //will display a message saying the request is made
      //set this.state.active to false
      //set the stash to empty
      //show send another request button
      if (this.state.friendStash.length) {
        var c = {
          requestTyp: 'watch',
          movie: this.props.movie.title,
          movieid: this.props.movie.id,
          message: this.state.message,
          requestee: this.state.friendStash
        };

        $.post(Url + '/sendWatchRequest', c).done(function (d) {
          _this3.setState({
            active: !1,
            friendStash: [],
            filter: '',
            message: '',
            requestSent: !0
          });
        });
      } else {
        this.setState({
          noRequesteeWarning: !0
        });
      }
    }
  }, {
    key: 'handleFilter',
    value: function handleFilter(c) {
      //Filter a particular friend in the friend list

      var d = [];
      this.state.friends.forEach(function (e) {
        if (e.indexOf(c.target.value) > -1) {
          d.push(e);
        }
      });

      this.setState({
        filteredFriends: d
      });
    }
  }, {
    key: 'handleAddFriend',
    value: function handleAddFriend(c) {
      // console.log('should be all friends to choose from', this.state.filteredFriends)
      //add friend to stash
      // console.log('calling handleAddFriend');
      var d = this.state.filteredFriends;
      d.splice(d.indexOf(c), 1);
      if (this.state.friendStash.indexOf(c) < 0) {
        var e = this.state.friendStash;
        e.unshift(c);
        this.setState({
          friendStash: e,
          filteredFriends: d
        });
      }
    }
  }, {
    key: 'handleRemoveFriend',
    value: function handleRemoveFriend(c) {
      //remove friend from stash
      var d = this.state.friendStash.indexOf(c);
      if (this.state.friendStash.length === 1) {
        this.setState({
          friendStash: []
        });
      } else {
        var e = this.state.friendStash;
        e.splice(d, 1);
        this.setState({
          friendStash: e
        });
      }

      var f = this.state.filteredFriends.concat([c]);
      this.setState({
        filteredFriends: f
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      if (this.state.active) {
        if (this.state.friendStash.length > 0) {
          var c = React.createElement(
            'div',
            { className: 'MovieWatchRequestFriendStash col s6' },
            React.createElement(
              'ul',
              { className: 'friendStash', name: 'friendStash', multiple: !0 },
              this.state.friendStash.map(function (d) {
                return React.createElement(WatchRequestStashEntry, { friend: d, handleRemoveFriend: _this4.handleRemoveFriend.bind(_this4) });
              })
            )
          );
        } else if (this.state.friendStash.length === 0) {
          var c = React.createElement(
            'div',
            { className: 'MovieWatchRequestFriendStash col s6' },
            React.createElement(
              'ul',
              { className: 'friendStash', name: 'friendStash', multiple: !0 },
              React.createElement(
                'div',
                { className: 'errorMsg' },
                'Please Select A Friend'
              )
            )
          );
        }

        return React.createElement(
          'div',
          { className: 'activeWatchRequest' },
          React.createElement('input', { type: 'text', placeholder: 'filter friends', onChange: this.handleFilter.bind(this) }),
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'div',
              { className: 'MovieWatchRequestFriendList col s6' },
              React.createElement(
                'ul',
                { className: 'friendList', name: 'friendsList', multiple: !0 },
                this.state.filteredFriends.length === 0 ? React.createElement(
                  'div',
                  { className: 'errorMsg' },
                  '\'No friends to choose from\''
                ) : '',
                this.state.filteredFriends.map(function (d) {
                  return React.createElement(WatchRequestFriendEntry, { friend: d, handleAddFriend: _this4.handleAddFriend.bind(_this4) });
                })
              )
            ),
            c
          ),
          React.createElement('textarea', { className: 'messageBox', cols: '40', rows: '5', onChange: this.handleMsg.bind(this), placeholder: 'Add a message', maxlength: '255' }),
          React.createElement(
            'a',
            { className: 'watchRequest waves-effect waves-light btn', onClick: this.handleSubmit.bind(this) },
            'Send Watch Request'
          ),
          React.createElement(
            'a',
            { className: 'closeWatchRequest waves-effect waves-light btn', onClick: this.handleClick.bind(this) },
            'Close Watch Request'
          )
        );
      } else {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'button',
            { className: 'center waves-effect waves-light btn', onClick: this.handleClick.bind(this) },
            this.state.requestSent ? 'Send Another Watch Request' : 'Send A Watch Request'
          ),
          React.createElement(
            'span',
            { className: 'sent updateMsg' },
            this.state.requestSent ? 'your request has been sent' : ''
          )
        );
      }
    }
  }]);

  return b;
}(React.Component);

var WatchRequestFriendEntry = function WatchRequestFriendEntry(a) {

  return React.createElement(
    'li',
    null,
    React.createElement(
      'span',
      null,
      a.friend
    ),
    React.createElement(
      'a',
      { className: 'btn-floating btn-small waves-effect waves-light red', onClick: function onClick() {
          return a.handleAddFriend(a.friend);
        } },
      React.createElement(
        'i',
        { 'class': 'material-icons' },
        '+'
      )
    )
  );
},
    WatchRequestStashEntry = function WatchRequestStashEntry(a) {
  return React.createElement(
    'li',
    null,
    React.createElement(
      'span',
      null,
      a.friend
    ),
    React.createElement(
      'a',
      { className: 'btn-floating btn-small waves-effect waves-light red', onClick: function onClick() {
          return a.handleRemoveFriend(a.friend);
        } },
      React.createElement(
        'i',
        { 'class': 'material-icons' },
        '-'
      )
    )
  );
};

window.MovieWatchRequest = MovieWatchRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZVdhdGNoUmVxdWVzdC5qcyJdLCJuYW1lcyI6WyJNb3ZpZVdhdGNoUmVxdWVzdCIsInByb3BzIiwic3RhdGUiLCJhY3RpdmUiLCJmcmllbmRzIiwiZmlsdGVyZWRGcmllbmRzIiwiZnJpZW5kU3Rhc2giLCJtZXNzYWdlIiwicmVxdWVzdFNlbnQiLCJub1JlcXVlc3RlZVdhcm5pbmciLCIkIiwiZ2V0IiwiVXJsIiwidGhlbiIsInVuaXFGcmllbmQiLCJfIiwidW5pcSIsInNldFN0YXRlIiwiZ2V0RnJpZW5kTGlzdCIsImV2ZW50IiwidGFyZ2V0IiwidmFsdWUiLCJsZW5ndGgiLCJyZXF1ZXN0T2JqIiwicmVxdWVzdFR5cCIsIm1vdmllIiwidGl0bGUiLCJtb3ZpZWlkIiwiaWQiLCJyZXF1ZXN0ZWUiLCJwb3N0IiwiZG9uZSIsImZpbHRlciIsImZvckVhY2giLCJmcmllbmQiLCJpbmRleE9mIiwicHVzaCIsIm5ld0ZpbHRlcmVkRnJpZW5kcyIsInNwbGljZSIsInN0YXNoQ29weSIsInVuc2hpZnQiLCJpZHgiLCJjb25jYXQiLCJzdGFzaCIsIm1hcCIsImhhbmRsZVJlbW92ZUZyaWVuZCIsImJpbmQiLCJoYW5kbGVGaWx0ZXIiLCJoYW5kbGVBZGRGcmllbmQiLCJoYW5kbGVNc2ciLCJoYW5kbGVTdWJtaXQiLCJoYW5kbGVDbGljayIsIlJlYWN0IiwiQ29tcG9uZW50IiwiV2F0Y2hSZXF1ZXN0RnJpZW5kRW50cnkiLCJXYXRjaFJlcXVlc3RTdGFzaEVudHJ5Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLGlCOzs7QUFFSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBRWpCLE1BQUtDLEtBQUwsR0FBYTtBQUNaQyxnQkFEWTtBQUVaQyxlQUFTLEVBRkc7QUFHWEMsdUJBQWlCLEVBSE47QUFJWkMsbUJBQVksRUFKQTtBQUtYQyxlQUFT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QUE7QUFBQTtBQUExSDtBQUEvQixHQUFSO0FBQ0QsQ0FQRDs7QUFVQXNCLE9BQU94RCxpQkFBUCxHQUEyQkEsaUJBQTNCIiwiZmlsZSI6Ik1vdmllV2F0Y2hSZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTW92aWVXYXRjaFJlcXVlc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgXHRcdGFjdGl2ZTogZmFsc2UsXHJcbiAgIFx0XHRmcmllbmRzOiBbXSxcclxuICAgICAgZmlsdGVyZWRGcmllbmRzOiBbXSxcclxuICAgXHRcdGZyaWVuZFN0YXNoOltdLFxyXG4gICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgcmVxdWVzdFNlbnQ6IGZhbHNlLFxyXG4gICAgICBub1JlcXVlc3RlZVdhcm5pbmc6IGZhbHNlXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0RnJpZW5kTGlzdCgpIHtcclxuICBcdC8vc2VuZCBnZXQgcmVxdWVzdCB0byByZXRyaXZlIGZyaWVuZHMgYW5kIHNldCB0byB0aGlzLnN0YXRlLmZyaWVuZHNcclxuICAgICQuZ2V0KFVybCArICcvZ2V0RnJpZW5kTGlzdCcpXHJcbiAgICAudGhlbihmcmllbmRzID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgZnJpZW5kcyk7XHJcbiAgICAgIHZhciB1bmlxRnJpZW5kID0gXy51bmlxKGZyaWVuZHMpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBmcmllbmRzOiB1bmlxRnJpZW5kLFxyXG4gICAgICAgIGZpbHRlcmVkRnJpZW5kczogdW5pcUZyaWVuZFxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBoYW5kbGVDbGljaygpIHtcclxuICBcdC8vd2lsbCB0dXJuIHRoaXMuc3RhdGUuYWN0aXZlIHRvIHRydWUgYW5kIHJlcmVuZGVyIHRoZSB2aWV3XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgYWN0aXZlOiAhdGhpcy5zdGF0ZS5hY3RpdmUsXHJcbiAgICAgIHJlcXVlc3RTZW50OiBmYWxzZVxyXG5cclxuICAgIH0pXHJcbiAgICB0aGlzLmdldEZyaWVuZExpc3QoKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZU1zZyhldmVudCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIG1lc3NhZ2U6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGhhbmRsZVN1Ym1pdCgpIHtcclxuICBcdC8vd2lsbCBzZW5kIG91dCBhIHdhdGNoIHJlcXVlc3QgZm9yIHRoaXMucHJvcHMubW92aWUgdG8gZnJpZW5kcyBpbiB0aGUgc3Rhc2hcclxuICBcdC8vd2lsbCBkaXNwbGF5IGEgbWVzc2FnZSBzYXlpbmcgdGhlIHJlcXVlc3QgaXMgbWFkZVxyXG4gIFx0Ly9zZXQgdGhpcy5zdGF0ZS5hY3RpdmUgdG8gZmFsc2VcclxuICAgIC8vc2V0IHRoZSBzdGFzaCB0byBlbXB0eVxyXG4gIFx0Ly9zaG93IHNlbmQgYW5vdGhlciByZXF1ZXN0IGJ1dHRvblxyXG4gICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoKSB7XHJcbiAgICAgIHZhciByZXF1ZXN0T2JqID0ge1xyXG4gICAgICAgIHJlcXVlc3RUeXA6ICd3YXRjaCcsXHJcbiAgICAgICAgbW92aWU6IHRoaXMucHJvcHMubW92aWUudGl0bGUsXHJcbiAgICAgICAgbW92aWVpZDogdGhpcy5wcm9wcy5tb3ZpZS5pZCxcclxuICAgICAgICBtZXNzYWdlOiB0aGlzLnN0YXRlLm1lc3NhZ2UsXHJcbiAgICAgICAgcmVxdWVzdGVlOiB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kV2F0Y2hSZXF1ZXN0JywgcmVxdWVzdE9iailcclxuICAgICAgLmRvbmUocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgYWN0aXZlOiBmYWxzZSxcclxuICAgICAgICAgIGZyaWVuZFN0YXNoOiBbXSxcclxuICAgICAgICAgIGZpbHRlcjogJycsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnJyxcclxuICAgICAgICAgIHJlcXVlc3RTZW50OiB0cnVlXHJcbiAgICAgICAgfSlcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBub1JlcXVlc3RlZVdhcm5pbmc6IHRydWVcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBoYW5kbGVGaWx0ZXIoZXZlbnQpIHtcclxuICBcdC8vRmlsdGVyIGEgcGFydGljdWxhciBmcmllbmQgaW4gdGhlIGZyaWVuZCBsaXN0XHJcblxyXG4gICAgdmFyIGZpbHRlcmVkRnJpZW5kcyA9IFtdO1xyXG4gICAgdGhpcy5zdGF0ZS5mcmllbmRzLmZvckVhY2goZnJpZW5kID0+IHtcclxuICAgICAgaWYgKGZyaWVuZC5pbmRleE9mKGV2ZW50LnRhcmdldC52YWx1ZSkgPiAtMSApIHtcclxuICAgICAgICBmaWx0ZXJlZEZyaWVuZHMucHVzaChmcmllbmQpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZmlsdGVyZWRGcmllbmRzOiBmaWx0ZXJlZEZyaWVuZHNcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQWRkRnJpZW5kKGZyaWVuZCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3Nob3VsZCBiZSBhbGwgZnJpZW5kcyB0byBjaG9vc2UgZnJvbScsIHRoaXMuc3RhdGUuZmlsdGVyZWRGcmllbmRzKVxyXG4gICAgLy9hZGQgZnJpZW5kIHRvIHN0YXNoXHJcbiAgICAvLyBjb25zb2xlLmxvZygnY2FsbGluZyBoYW5kbGVBZGRGcmllbmQnKTtcclxuICAgIHZhciBuZXdGaWx0ZXJlZEZyaWVuZHM9dGhpcy5zdGF0ZS5maWx0ZXJlZEZyaWVuZHM7XHJcbiAgICBuZXdGaWx0ZXJlZEZyaWVuZHMuc3BsaWNlKG5ld0ZpbHRlcmVkRnJpZW5kcy5pbmRleE9mKGZyaWVuZCksMSk7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5pbmRleE9mKGZyaWVuZCkgPCAwKSB7XHJcbiAgICAgIHZhciBzdGFzaENvcHkgPSB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoO1xyXG4gICAgICBzdGFzaENvcHkudW5zaGlmdChmcmllbmQpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBmcmllbmRTdGFzaDogc3Rhc2hDb3B5LFxyXG4gICAgICAgIGZpbHRlcmVkRnJpZW5kczpuZXdGaWx0ZXJlZEZyaWVuZHNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVSZW1vdmVGcmllbmQoZnJpZW5kKSB7XHJcbiAgICAvL3JlbW92ZSBmcmllbmQgZnJvbSBzdGFzaFxyXG4gICAgdmFyIGlkeCA9IHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2guaW5kZXhPZihmcmllbmQpXHJcbiAgICBpZiAodGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kU3Rhc2g6IFtdXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ2ltIHRyeWluZyB0byByZW1vdmUnLCBmcmllbmQpO1xyXG4gICAgICB2YXIgc3Rhc2hDb3B5ID0gdGhpcy5zdGF0ZS5mcmllbmRTdGFzaDtcclxuICAgICAgc3Rhc2hDb3B5LnNwbGljZShpZHgsIDEpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBmcmllbmRTdGFzaDogc3Rhc2hDb3B5XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBuZXdGaWx0ZXJlZEZyaWVuZHM9dGhpcy5zdGF0ZS5maWx0ZXJlZEZyaWVuZHMuY29uY2F0KFtmcmllbmRdKTtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBmaWx0ZXJlZEZyaWVuZHM6IG5ld0ZpbHRlcmVkRnJpZW5kc1xyXG4gICAgfSk7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZSkge1xyXG4gICAgICBpZiAodGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdmFyIHN0YXNoID0gXHJcbiAgICAgICAgICAoPGRpdiBjbGFzc05hbWU9XCJNb3ZpZVdhdGNoUmVxdWVzdEZyaWVuZFN0YXNoIGNvbCBzNlwiPlxyXG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZnJpZW5kU3Rhc2hcIiBuYW1lPVwiZnJpZW5kU3Rhc2hcIiBtdWx0aXBsZT5cclxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5tYXAoZnJpZW5kID0+IDxXYXRjaFJlcXVlc3RTdGFzaEVudHJ5IGZyaWVuZD17ZnJpZW5kfSBoYW5kbGVSZW1vdmVGcmllbmQ9e3RoaXMuaGFuZGxlUmVtb3ZlRnJpZW5kLmJpbmQodGhpcyl9Lz4pfVxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9kaXY+KVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdmFyIHN0YXNoID0gXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJNb3ZpZVdhdGNoUmVxdWVzdEZyaWVuZFN0YXNoIGNvbCBzNlwiPlxyXG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZyaWVuZFN0YXNoXCIgbmFtZT1cImZyaWVuZFN0YXNoXCIgbXVsdGlwbGU+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj5QbGVhc2UgU2VsZWN0IEEgRnJpZW5kPC9kaXY+XHJcbiAgICAgICAgICA8L3VsPlxyXG4gICAgICAgIDwvZGl2PjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0aXZlV2F0Y2hSZXF1ZXN0XCI+XHJcbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cImZpbHRlciBmcmllbmRzXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlRmlsdGVyLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTW92aWVXYXRjaFJlcXVlc3RGcmllbmRMaXN0IGNvbCBzNlwiPlxyXG4gICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJmcmllbmRMaXN0XCIgbmFtZT1cImZyaWVuZHNMaXN0XCIgbXVsdGlwbGU+XHJcbiAgICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUuZmlsdGVyZWRGcmllbmRzLmxlbmd0aCA9PT0gMCkgPyA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+J05vIGZyaWVuZHMgdG8gY2hvb3NlIGZyb20nPC9kaXY+IDogJyd9XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5maWx0ZXJlZEZyaWVuZHMubWFwKGZyaWVuZCA9PiA8V2F0Y2hSZXF1ZXN0RnJpZW5kRW50cnkgZnJpZW5kPXtmcmllbmR9IGhhbmRsZUFkZEZyaWVuZD17dGhpcy5oYW5kbGVBZGRGcmllbmQuYmluZCh0aGlzKX0vPil9XHJcbiAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICB7c3Rhc2h9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzc05hbWU9XCJtZXNzYWdlQm94XCIgY29scz1cIjQwXCIgcm93cz1cIjVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVNc2cuYmluZCh0aGlzKX0gcGxhY2Vob2xkZXI9XCJBZGQgYSBtZXNzYWdlXCIgbWF4bGVuZ3RoPVwiMjU1XCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdGNoUmVxdWVzdCB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKX0+U2VuZCBXYXRjaCBSZXF1ZXN0PC9hPlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwiY2xvc2VXYXRjaFJlcXVlc3Qgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKX0+Q2xvc2UgV2F0Y2ggUmVxdWVzdDwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJjZW50ZXIgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKX0+eyh0aGlzLnN0YXRlLnJlcXVlc3RTZW50KSA/ICdTZW5kIEFub3RoZXIgV2F0Y2ggUmVxdWVzdCcgOiAnU2VuZCBBIFdhdGNoIFJlcXVlc3QnfTwvYnV0dG9uPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdzZW50IHVwZGF0ZU1zZyc+eyh0aGlzLnN0YXRlLnJlcXVlc3RTZW50KSA/ICd5b3VyIHJlcXVlc3QgaGFzIGJlZW4gc2VudCcgOiAnJ308L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxudmFyIFdhdGNoUmVxdWVzdEZyaWVuZEVudHJ5ID0gKHByb3BzKSA9PiB7XHJcblxyXG4gIHJldHVybiAoPGxpPjxzcGFuPntwcm9wcy5mcmllbmR9PC9zcGFuPjxhIGNsYXNzTmFtZT1cImJ0bi1mbG9hdGluZyBidG4tc21hbGwgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IHJlZFwiIG9uQ2xpY2s9eygpID0+IHByb3BzLmhhbmRsZUFkZEZyaWVuZChwcm9wcy5mcmllbmQpfT48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+KzwvaT48L2E+PC9saT4pXHJcbn07XHJcblxyXG52YXIgV2F0Y2hSZXF1ZXN0U3Rhc2hFbnRyeSA9IChwcm9wcykgPT4ge1xyXG4gIHJldHVybiAoPGxpPjxzcGFuPntwcm9wcy5mcmllbmR9PC9zcGFuPjxhIGNsYXNzTmFtZT1cImJ0bi1mbG9hdGluZyBidG4tc21hbGwgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IHJlZFwiIG9uQ2xpY2s9eygpID0+IHByb3BzLmhhbmRsZVJlbW92ZUZyaWVuZChwcm9wcy5mcmllbmQpfT48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+LTwvaT48L2E+PC9saT4pXHJcbn07XHJcblxyXG5cclxud2luZG93Lk1vdmllV2F0Y2hSZXF1ZXN0ID0gTW92aWVXYXRjaFJlcXVlc3Q7XHJcblxyXG5cclxuXHJcbiJdfQ==