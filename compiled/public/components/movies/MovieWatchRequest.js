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
            'button',
            { className: 'watchRequest', onClick: this.handleSubmit.bind(this) },
            'Send Watch Request'
          ),
          React.createElement(
            'button',
            { className: 'closeWatchRequest', onClick: this.handleClick.bind(this) },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZVdhdGNoUmVxdWVzdC5qcyJdLCJuYW1lcyI6WyJNb3ZpZVdhdGNoUmVxdWVzdCIsInByb3BzIiwic3RhdGUiLCJhY3RpdmUiLCJmcmllbmRzIiwiZmlsdGVyZWRGcmllbmRzIiwiZnJpZW5kU3Rhc2giLCJtZXNzYWdlIiwicmVxdWVzdFNlbnQiLCJub1JlcXVlc3RlZVdhcm5pbmciLCIkIiwiZ2V0IiwiVXJsIiwidGhlbiIsInVuaXFGcmllbmQiLCJfIiwidW5pcSIsInNldFN0YXRlIiwiZ2V0RnJpZW5kTGlzdCIsImV2ZW50IiwidGFyZ2V0IiwidmFsdWUiLCJsZW5ndGgiLCJyZXF1ZXN0T2JqIiwicmVxdWVzdFR5cCIsIm1vdmllIiwidGl0bGUiLCJtb3ZpZWlkIiwiaWQiLCJyZXF1ZXN0ZWUiLCJwb3N0IiwiZG9uZSIsImZpbHRlciIsImZvckVhY2giLCJmcmllbmQiLCJpbmRleE9mIiwicHVzaCIsIm5ld0ZpbHRlcmVkRnJpZW5kcyIsInNwbGljZSIsInN0YXNoQ29weSIsInVuc2hpZnQiLCJpZHgiLCJjb25jYXQiLCJzdGFzaCIsIm1hcCIsImhhbmRsZVJlbW92ZUZyaWVuZCIsImJpbmQiLCJoYW5kbGVGaWx0ZXIiLCJoYW5kbGVBZGRGcmllbmQiLCJoYW5kbGVNc2ciLCJoYW5kbGVTdWJtaXQiLCJoYW5kbGVDbGljayIsIlJlYWN0IiwiQ29tcG9uZW50IiwiV2F0Y2hSZXF1ZXN0RnJpZW5kRW50cnkiLCJXYXRjaFJlcXVlc3RTdGFzaEVudHJ5Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLGlCOzs7QUFFSixhQUFZQyxDQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0dBQ1hBLENBRFc7O0FBRWpCLE1BQUtDLEtBQUwsR0FBYTtBQUNaQyxnQkFEWTtBQUVaQyxlQUFTLEVBRkc7QUFHWEMsdUJBQWlCLEVBSE47QUFJWkMsbUJBQVksRUFKQTtBQUtYQyxlQUFT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QUFBO0FBQUE7QUFBMUg7QUFBL0IsR0FBUjtBQUNELENBUEQ7O0FBVUFzQixPQUFPeEQsaUJBQVAsR0FBMkJBLGlCQUEzQiIsImZpbGUiOiJNb3ZpZVdhdGNoUmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1vdmllV2F0Y2hSZXF1ZXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgIFx0XHRhY3RpdmU6IGZhbHNlLFxyXG4gICBcdFx0ZnJpZW5kczogW10sXHJcbiAgICAgIGZpbHRlcmVkRnJpZW5kczogW10sXHJcbiAgIFx0XHRmcmllbmRTdGFzaDpbXSxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgIHJlcXVlc3RTZW50OiBmYWxzZSxcclxuICAgICAgbm9SZXF1ZXN0ZWVXYXJuaW5nOiBmYWxzZVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldEZyaWVuZExpc3QoKSB7XHJcbiAgXHQvL3NlbmQgZ2V0IHJlcXVlc3QgdG8gcmV0cml2ZSBmcmllbmRzIGFuZCBzZXQgdG8gdGhpcy5zdGF0ZS5mcmllbmRzXHJcbiAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZExpc3QnKVxyXG4gICAgLnRoZW4oZnJpZW5kcyA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIGZyaWVuZHMpO1xyXG4gICAgICB2YXIgdW5pcUZyaWVuZCA9IF8udW5pcShmcmllbmRzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kczogdW5pcUZyaWVuZCxcclxuICAgICAgICBmaWx0ZXJlZEZyaWVuZHM6IHVuaXFGcmllbmRcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2xpY2soKSB7XHJcbiAgXHQvL3dpbGwgdHVybiB0aGlzLnN0YXRlLmFjdGl2ZSB0byB0cnVlIGFuZCByZXJlbmRlciB0aGUgdmlld1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGFjdGl2ZTogIXRoaXMuc3RhdGUuYWN0aXZlLFxyXG4gICAgICByZXF1ZXN0U2VudDogZmFsc2VcclxuXHJcbiAgICB9KVxyXG4gICAgdGhpcy5nZXRGcmllbmRMaXN0KCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVNc2coZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtZXNzYWdlOiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBoYW5kbGVTdWJtaXQoKSB7XHJcbiAgXHQvL3dpbGwgc2VuZCBvdXQgYSB3YXRjaCByZXF1ZXN0IGZvciB0aGlzLnByb3BzLm1vdmllIHRvIGZyaWVuZHMgaW4gdGhlIHN0YXNoXHJcbiAgXHQvL3dpbGwgZGlzcGxheSBhIG1lc3NhZ2Ugc2F5aW5nIHRoZSByZXF1ZXN0IGlzIG1hZGVcclxuICBcdC8vc2V0IHRoaXMuc3RhdGUuYWN0aXZlIHRvIGZhbHNlXHJcbiAgICAvL3NldCB0aGUgc3Rhc2ggdG8gZW1wdHlcclxuICBcdC8vc2hvdyBzZW5kIGFub3RoZXIgcmVxdWVzdCBidXR0b25cclxuICAgIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCkge1xyXG4gICAgICB2YXIgcmVxdWVzdE9iaiA9IHtcclxuICAgICAgICByZXF1ZXN0VHlwOiAnd2F0Y2gnLFxyXG4gICAgICAgIG1vdmllOiB0aGlzLnByb3BzLm1vdmllLnRpdGxlLFxyXG4gICAgICAgIG1vdmllaWQ6IHRoaXMucHJvcHMubW92aWUuaWQsXHJcbiAgICAgICAgbWVzc2FnZTogdGhpcy5zdGF0ZS5tZXNzYWdlLFxyXG4gICAgICAgIHJlcXVlc3RlZTogdGhpcy5zdGF0ZS5mcmllbmRTdGFzaFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFdhdGNoUmVxdWVzdCcsIHJlcXVlc3RPYmopXHJcbiAgICAgIC5kb25lKHJlc3BvbnNlID0+IHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXHJcbiAgICAgICAgICBmcmllbmRTdGFzaDogW10sXHJcbiAgICAgICAgICBmaWx0ZXI6ICcnLFxyXG4gICAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgICByZXF1ZXN0U2VudDogdHJ1ZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbm9SZXF1ZXN0ZWVXYXJuaW5nOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgaGFuZGxlRmlsdGVyKGV2ZW50KSB7XHJcbiAgXHQvL0ZpbHRlciBhIHBhcnRpY3VsYXIgZnJpZW5kIGluIHRoZSBmcmllbmQgbGlzdFxyXG5cclxuICAgIHZhciBmaWx0ZXJlZEZyaWVuZHMgPSBbXTtcclxuICAgIHRoaXMuc3RhdGUuZnJpZW5kcy5mb3JFYWNoKGZyaWVuZCA9PiB7XHJcbiAgICAgIGlmIChmcmllbmQuaW5kZXhPZihldmVudC50YXJnZXQudmFsdWUpID4gLTEgKSB7XHJcbiAgICAgICAgZmlsdGVyZWRGcmllbmRzLnB1c2goZnJpZW5kKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIFxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGZpbHRlcmVkRnJpZW5kczogZmlsdGVyZWRGcmllbmRzXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUFkZEZyaWVuZChmcmllbmQpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdzaG91bGQgYmUgYWxsIGZyaWVuZHMgdG8gY2hvb3NlIGZyb20nLCB0aGlzLnN0YXRlLmZpbHRlcmVkRnJpZW5kcylcclxuICAgIC8vYWRkIGZyaWVuZCB0byBzdGFzaFxyXG4gICAgLy8gY29uc29sZS5sb2coJ2NhbGxpbmcgaGFuZGxlQWRkRnJpZW5kJyk7XHJcbiAgICB2YXIgbmV3RmlsdGVyZWRGcmllbmRzPXRoaXMuc3RhdGUuZmlsdGVyZWRGcmllbmRzO1xyXG4gICAgbmV3RmlsdGVyZWRGcmllbmRzLnNwbGljZShuZXdGaWx0ZXJlZEZyaWVuZHMuaW5kZXhPZihmcmllbmQpLDEpO1xyXG4gICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2guaW5kZXhPZihmcmllbmQpIDwgMCkge1xyXG4gICAgICB2YXIgc3Rhc2hDb3B5ID0gdGhpcy5zdGF0ZS5mcmllbmRTdGFzaDtcclxuICAgICAgc3Rhc2hDb3B5LnVuc2hpZnQoZnJpZW5kKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kU3Rhc2g6IHN0YXNoQ29weSxcclxuICAgICAgICBmaWx0ZXJlZEZyaWVuZHM6bmV3RmlsdGVyZWRGcmllbmRzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlUmVtb3ZlRnJpZW5kKGZyaWVuZCkge1xyXG4gICAgLy9yZW1vdmUgZnJpZW5kIGZyb20gc3Rhc2hcclxuICAgIHZhciBpZHggPSB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmluZGV4T2YoZnJpZW5kKVxyXG4gICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGZyaWVuZFN0YXNoOiBbXVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdpbSB0cnlpbmcgdG8gcmVtb3ZlJywgZnJpZW5kKTtcclxuICAgICAgdmFyIHN0YXNoQ29weSA9IHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2g7XHJcbiAgICAgIHN0YXNoQ29weS5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kU3Rhc2g6IHN0YXNoQ29weVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbmV3RmlsdGVyZWRGcmllbmRzPXRoaXMuc3RhdGUuZmlsdGVyZWRGcmllbmRzLmNvbmNhdChbZnJpZW5kXSk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZmlsdGVyZWRGcmllbmRzOiBuZXdGaWx0ZXJlZEZyaWVuZHNcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcclxuICAgICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHZhciBzdGFzaCA9IFxyXG4gICAgICAgICAgKDxkaXYgY2xhc3NOYW1lPVwiTW92aWVXYXRjaFJlcXVlc3RGcmllbmRTdGFzaCBjb2wgczZcIj5cclxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZyaWVuZFN0YXNoXCIgbmFtZT1cImZyaWVuZFN0YXNoXCIgbXVsdGlwbGU+XHJcbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubWFwKGZyaWVuZCA9PiA8V2F0Y2hSZXF1ZXN0U3Rhc2hFbnRyeSBmcmllbmQ9e2ZyaWVuZH0gaGFuZGxlUmVtb3ZlRnJpZW5kPXt0aGlzLmhhbmRsZVJlbW92ZUZyaWVuZC5iaW5kKHRoaXMpfS8+KX1cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvZGl2PilcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHZhciBzdGFzaCA9IFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTW92aWVXYXRjaFJlcXVlc3RGcmllbmRTdGFzaCBjb2wgczZcIj5cclxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJmcmllbmRTdGFzaFwiIG5hbWU9XCJmcmllbmRTdGFzaFwiIG11bHRpcGxlPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+UGxlYXNlIFNlbGVjdCBBIEZyaWVuZDwvZGl2PlxyXG4gICAgICAgICAgPC91bD5cclxuICAgICAgICA8L2Rpdj47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybihcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdGl2ZVdhdGNoUmVxdWVzdFwiPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJmaWx0ZXIgZnJpZW5kc1wiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUZpbHRlci5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk1vdmllV2F0Y2hSZXF1ZXN0RnJpZW5kTGlzdCBjb2wgczZcIj5cclxuICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZnJpZW5kTGlzdFwiIG5hbWU9XCJmcmllbmRzTGlzdFwiIG11bHRpcGxlPlxyXG4gICAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLmZpbHRlcmVkRnJpZW5kcy5sZW5ndGggPT09IDApID8gPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPidObyBmcmllbmRzIHRvIGNob29zZSBmcm9tJzwvZGl2PiA6ICcnfVxyXG4gICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZmlsdGVyZWRGcmllbmRzLm1hcChmcmllbmQgPT4gPFdhdGNoUmVxdWVzdEZyaWVuZEVudHJ5IGZyaWVuZD17ZnJpZW5kfSBoYW5kbGVBZGRGcmllbmQ9e3RoaXMuaGFuZGxlQWRkRnJpZW5kLmJpbmQodGhpcyl9Lz4pfVxyXG4gICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAge3N0YXNofVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwibWVzc2FnZUJveFwiIGNvbHM9XCI0MFwiIHJvd3M9XCI1XCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlTXNnLmJpbmQodGhpcyl9IHBsYWNlaG9sZGVyPVwiQWRkIGEgbWVzc2FnZVwiIG1heGxlbmd0aD1cIjI1NVwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIndhdGNoUmVxdWVzdFwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyl9PlNlbmQgV2F0Y2ggUmVxdWVzdDwvYnV0dG9uPlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJjbG9zZVdhdGNoUmVxdWVzdFwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKX0+Q2xvc2UgV2F0Y2ggUmVxdWVzdDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImNlbnRlciB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17dGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpfT57KHRoaXMuc3RhdGUucmVxdWVzdFNlbnQpID8gJ1NlbmQgQW5vdGhlciBXYXRjaCBSZXF1ZXN0JyA6ICdTZW5kIEEgV2F0Y2ggUmVxdWVzdCd9PC9idXR0b24+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3NlbnQgdXBkYXRlTXNnJz57KHRoaXMuc3RhdGUucmVxdWVzdFNlbnQpID8gJ3lvdXIgcmVxdWVzdCBoYXMgYmVlbiBzZW50JyA6ICcnfTwvc3Bhbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG52YXIgV2F0Y2hSZXF1ZXN0RnJpZW5kRW50cnkgPSAocHJvcHMpID0+IHtcclxuXHJcbiAgcmV0dXJuICg8bGk+PHNwYW4+e3Byb3BzLmZyaWVuZH08L3NwYW4+PGEgY2xhc3NOYW1lPVwiYnRuLWZsb2F0aW5nIGJ0bi1zbWFsbCB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgcmVkXCIgb25DbGljaz17KCkgPT4gcHJvcHMuaGFuZGxlQWRkRnJpZW5kKHByb3BzLmZyaWVuZCl9PjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj4rPC9pPjwvYT48L2xpPilcclxufTtcclxuXHJcbnZhciBXYXRjaFJlcXVlc3RTdGFzaEVudHJ5ID0gKHByb3BzKSA9PiB7XHJcbiAgcmV0dXJuICg8bGk+PHNwYW4+e3Byb3BzLmZyaWVuZH08L3NwYW4+PGEgY2xhc3NOYW1lPVwiYnRuLWZsb2F0aW5nIGJ0bi1zbWFsbCB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgcmVkXCIgb25DbGljaz17KCkgPT4gcHJvcHMuaGFuZGxlUmVtb3ZlRnJpZW5kKHByb3BzLmZyaWVuZCl9PjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj4tPC9pPjwvYT48L2xpPilcclxufTtcclxuXHJcblxyXG53aW5kb3cuTW92aWVXYXRjaFJlcXVlc3QgPSBNb3ZpZVdhdGNoUmVxdWVzdDtcclxuXHJcblxyXG5cclxuIl19