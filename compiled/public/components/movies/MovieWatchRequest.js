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
            this.state.requestSent ? 'Request sent!' : ''
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
    { className: 'friendToAsk' },
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
    { className: 'friendToAsk' },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZVdhdGNoUmVxdWVzdC5qc3giXSwibmFtZXMiOlsiTW92aWVXYXRjaFJlcXVlc3QiLCJwcm9wcyIsInN0YXRlIiwiYWN0aXZlIiwiZnJpZW5kcyIsImZpbHRlcmVkRnJpZW5kcyIsImZyaWVuZFN0YXNoIiwibWVzc2FnZSIsInJlcXVlc3RTZW50Iiwibm9SZXF1ZXN0ZWVXYXJuaW5nIiwiJCIsImdldCIsIlVybCIsInRoZW4iLCJ1bmlxRnJpZW5kIiwiXyIsInVuaXEiLCJzZXRTdGF0ZSIsImdldEZyaWVuZExpc3QiLCJldmVudCIsInRhcmdldCIsInZhbHVlIiwibGVuZ3RoIiwicmVxdWVzdE9iaiIsInJlcXVlc3RUeXAiLCJtb3ZpZSIsInRpdGxlIiwibW92aWVpZCIsImlkIiwicmVxdWVzdGVlIiwicG9zdCIsImRvbmUiLCJmaWx0ZXIiLCJmb3JFYWNoIiwiZnJpZW5kIiwiaW5kZXhPZiIsInB1c2giLCJuZXdGaWx0ZXJlZEZyaWVuZHMiLCJzcGxpY2UiLCJzdGFzaENvcHkiLCJ1bnNoaWZ0IiwiaWR4IiwiY29uY2F0Iiwic3Rhc2giLCJtYXAiLCJoYW5kbGVSZW1vdmVGcmllbmQiLCJiaW5kIiwiaGFuZGxlRmlsdGVyIiwiaGFuZGxlQWRkRnJpZW5kIiwiaGFuZGxlTXNnIiwiaGFuZGxlU3VibWl0IiwiaGFuZGxlQ2xpY2siLCJSZWFjdCIsIkNvbXBvbmVudCIsIldhdGNoUmVxdWVzdEZyaWVuZEVudHJ5IiwiV2F0Y2hSZXF1ZXN0U3Rhc2hFbnRyeSIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxpQjs7O0FBRUosYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUVqQixNQUFLQyxLQUFMLEdBQWE7QUFDWkMsZ0JBRFk7QUFFWkMsZUFBUyxFQUZHO0FBR1hDLHVCQUFpQixFQUhOO0FBSVpDLG1CQUFZLEVBSkE7QUFLWEMsZUFB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QUFBMEg7QUFBQTtBQUFBLFVBQUcsU0FBTSxnQkFBVDtBQUFBO0FBQUE7QUFBMUg7QUFBdkQsR0FBUjtBQUNELENBUEQ7O0FBVUFzQixPQUFPeEQsaUJBQVAsR0FBMkJBLGlCQUEzQiIsImZpbGUiOiJNb3ZpZVdhdGNoUmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1vdmllV2F0Y2hSZXF1ZXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgIFx0XHRhY3RpdmU6IGZhbHNlLFxyXG4gICBcdFx0ZnJpZW5kczogW10sXHJcbiAgICAgIGZpbHRlcmVkRnJpZW5kczogW10sXHJcbiAgIFx0XHRmcmllbmRTdGFzaDpbXSxcclxuICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgIHJlcXVlc3RTZW50OiBmYWxzZSxcclxuICAgICAgbm9SZXF1ZXN0ZWVXYXJuaW5nOiBmYWxzZVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldEZyaWVuZExpc3QoKSB7XHJcbiAgXHQvL3NlbmQgZ2V0IHJlcXVlc3QgdG8gcmV0cml2ZSBmcmllbmRzIGFuZCBzZXQgdG8gdGhpcy5zdGF0ZS5mcmllbmRzXHJcbiAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZExpc3QnKVxyXG4gICAgLnRoZW4oZnJpZW5kcyA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIGZyaWVuZHMpO1xyXG4gICAgICB2YXIgdW5pcUZyaWVuZCA9IF8udW5pcShmcmllbmRzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kczogdW5pcUZyaWVuZCxcclxuICAgICAgICBmaWx0ZXJlZEZyaWVuZHM6IHVuaXFGcmllbmRcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2xpY2soKSB7XHJcbiAgXHQvL3dpbGwgdHVybiB0aGlzLnN0YXRlLmFjdGl2ZSB0byB0cnVlIGFuZCByZXJlbmRlciB0aGUgdmlld1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGFjdGl2ZTogIXRoaXMuc3RhdGUuYWN0aXZlLFxyXG4gICAgICByZXF1ZXN0U2VudDogZmFsc2VcclxuXHJcbiAgICB9KVxyXG4gICAgdGhpcy5nZXRGcmllbmRMaXN0KCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVNc2coZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtZXNzYWdlOiBldmVudC50YXJnZXQudmFsdWVcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBoYW5kbGVTdWJtaXQoKSB7XHJcbiAgXHQvL3dpbGwgc2VuZCBvdXQgYSB3YXRjaCByZXF1ZXN0IGZvciB0aGlzLnByb3BzLm1vdmllIHRvIGZyaWVuZHMgaW4gdGhlIHN0YXNoXHJcbiAgXHQvL3dpbGwgZGlzcGxheSBhIG1lc3NhZ2Ugc2F5aW5nIHRoZSByZXF1ZXN0IGlzIG1hZGVcclxuICBcdC8vc2V0IHRoaXMuc3RhdGUuYWN0aXZlIHRvIGZhbHNlXHJcbiAgICAvL3NldCB0aGUgc3Rhc2ggdG8gZW1wdHlcclxuICBcdC8vc2hvdyBzZW5kIGFub3RoZXIgcmVxdWVzdCBidXR0b25cclxuICAgIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCkge1xyXG4gICAgICB2YXIgcmVxdWVzdE9iaiA9IHtcclxuICAgICAgICByZXF1ZXN0VHlwOiAnd2F0Y2gnLFxyXG4gICAgICAgIG1vdmllOiB0aGlzLnByb3BzLm1vdmllLnRpdGxlLFxyXG4gICAgICAgIG1vdmllaWQ6IHRoaXMucHJvcHMubW92aWUuaWQsXHJcbiAgICAgICAgbWVzc2FnZTogdGhpcy5zdGF0ZS5tZXNzYWdlLFxyXG4gICAgICAgIHJlcXVlc3RlZTogdGhpcy5zdGF0ZS5mcmllbmRTdGFzaFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFdhdGNoUmVxdWVzdCcsIHJlcXVlc3RPYmopXHJcbiAgICAgIC5kb25lKHJlc3BvbnNlID0+IHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXHJcbiAgICAgICAgICBmcmllbmRTdGFzaDogW10sXHJcbiAgICAgICAgICBmaWx0ZXI6ICcnLFxyXG4gICAgICAgICAgbWVzc2FnZTogJycsXHJcbiAgICAgICAgICByZXF1ZXN0U2VudDogdHJ1ZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbm9SZXF1ZXN0ZWVXYXJuaW5nOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgaGFuZGxlRmlsdGVyKGV2ZW50KSB7XHJcbiAgXHQvL0ZpbHRlciBhIHBhcnRpY3VsYXIgZnJpZW5kIGluIHRoZSBmcmllbmQgbGlzdFxyXG5cclxuICAgIHZhciBmaWx0ZXJlZEZyaWVuZHMgPSBbXTtcclxuICAgIHRoaXMuc3RhdGUuZnJpZW5kcy5mb3JFYWNoKGZyaWVuZCA9PiB7XHJcbiAgICAgIGlmIChmcmllbmQuaW5kZXhPZihldmVudC50YXJnZXQudmFsdWUpID4gLTEgKSB7XHJcbiAgICAgICAgZmlsdGVyZWRGcmllbmRzLnB1c2goZnJpZW5kKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIFxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGZpbHRlcmVkRnJpZW5kczogZmlsdGVyZWRGcmllbmRzXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUFkZEZyaWVuZChmcmllbmQpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdzaG91bGQgYmUgYWxsIGZyaWVuZHMgdG8gY2hvb3NlIGZyb20nLCB0aGlzLnN0YXRlLmZpbHRlcmVkRnJpZW5kcylcclxuICAgIC8vYWRkIGZyaWVuZCB0byBzdGFzaFxyXG4gICAgLy8gY29uc29sZS5sb2coJ2NhbGxpbmcgaGFuZGxlQWRkRnJpZW5kJyk7XHJcbiAgICB2YXIgbmV3RmlsdGVyZWRGcmllbmRzPXRoaXMuc3RhdGUuZmlsdGVyZWRGcmllbmRzO1xyXG4gICAgbmV3RmlsdGVyZWRGcmllbmRzLnNwbGljZShuZXdGaWx0ZXJlZEZyaWVuZHMuaW5kZXhPZihmcmllbmQpLDEpO1xyXG4gICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2guaW5kZXhPZihmcmllbmQpIDwgMCkge1xyXG4gICAgICB2YXIgc3Rhc2hDb3B5ID0gdGhpcy5zdGF0ZS5mcmllbmRTdGFzaDtcclxuICAgICAgc3Rhc2hDb3B5LnVuc2hpZnQoZnJpZW5kKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kU3Rhc2g6IHN0YXNoQ29weSxcclxuICAgICAgICBmaWx0ZXJlZEZyaWVuZHM6bmV3RmlsdGVyZWRGcmllbmRzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlUmVtb3ZlRnJpZW5kKGZyaWVuZCkge1xyXG4gICAgLy9yZW1vdmUgZnJpZW5kIGZyb20gc3Rhc2hcclxuICAgIHZhciBpZHggPSB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmluZGV4T2YoZnJpZW5kKVxyXG4gICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGZyaWVuZFN0YXNoOiBbXVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdpbSB0cnlpbmcgdG8gcmVtb3ZlJywgZnJpZW5kKTtcclxuICAgICAgdmFyIHN0YXNoQ29weSA9IHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2g7XHJcbiAgICAgIHN0YXNoQ29weS5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZnJpZW5kU3Rhc2g6IHN0YXNoQ29weVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbmV3RmlsdGVyZWRGcmllbmRzPXRoaXMuc3RhdGUuZmlsdGVyZWRGcmllbmRzLmNvbmNhdChbZnJpZW5kXSk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZmlsdGVyZWRGcmllbmRzOiBuZXdGaWx0ZXJlZEZyaWVuZHNcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcclxuICAgICAgaWYgKHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHZhciBzdGFzaCA9IFxyXG4gICAgICAgICAgKDxkaXYgY2xhc3NOYW1lPVwiTW92aWVXYXRjaFJlcXVlc3RGcmllbmRTdGFzaCBjb2wgczZcIj5cclxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZyaWVuZFN0YXNoXCIgbmFtZT1cImZyaWVuZFN0YXNoXCIgbXVsdGlwbGU+XHJcbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZnJpZW5kU3Rhc2gubWFwKGZyaWVuZCA9PiA8V2F0Y2hSZXF1ZXN0U3Rhc2hFbnRyeSBmcmllbmQ9e2ZyaWVuZH0gaGFuZGxlUmVtb3ZlRnJpZW5kPXt0aGlzLmhhbmRsZVJlbW92ZUZyaWVuZC5iaW5kKHRoaXMpfS8+KX1cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvZGl2PilcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHZhciBzdGFzaCA9IFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiTW92aWVXYXRjaFJlcXVlc3RGcmllbmRTdGFzaCBjb2wgczZcIj5cclxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJmcmllbmRTdGFzaFwiIG5hbWU9XCJmcmllbmRTdGFzaFwiIG11bHRpcGxlPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+UGxlYXNlIFNlbGVjdCBBIEZyaWVuZDwvZGl2PlxyXG4gICAgICAgICAgPC91bD5cclxuICAgICAgICA8L2Rpdj47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybihcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdGl2ZVdhdGNoUmVxdWVzdFwiPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJmaWx0ZXIgZnJpZW5kc1wiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUZpbHRlci5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk1vdmllV2F0Y2hSZXF1ZXN0RnJpZW5kTGlzdCBjb2wgczZcIj5cclxuICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZnJpZW5kTGlzdFwiIG5hbWU9XCJmcmllbmRzTGlzdFwiIG11bHRpcGxlPlxyXG4gICAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLmZpbHRlcmVkRnJpZW5kcy5sZW5ndGggPT09IDApID8gPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPidObyBmcmllbmRzIHRvIGNob29zZSBmcm9tJzwvZGl2PiA6ICcnfVxyXG4gICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZmlsdGVyZWRGcmllbmRzLm1hcChmcmllbmQgPT4gPFdhdGNoUmVxdWVzdEZyaWVuZEVudHJ5IGZyaWVuZD17ZnJpZW5kfSBoYW5kbGVBZGRGcmllbmQ9e3RoaXMuaGFuZGxlQWRkRnJpZW5kLmJpbmQodGhpcyl9Lz4pfVxyXG4gICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAge3N0YXNofVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPVwibWVzc2FnZUJveFwiIGNvbHM9XCI0MFwiIHJvd3M9XCI1XCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlTXNnLmJpbmQodGhpcyl9IHBsYWNlaG9sZGVyPVwiQWRkIGEgbWVzc2FnZVwiIG1heGxlbmd0aD1cIjI1NVwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXRjaFJlcXVlc3Qgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyl9PlNlbmQgV2F0Y2ggUmVxdWVzdDwvYT5cclxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImNsb3NlV2F0Y2hSZXF1ZXN0IHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyl9PkNsb3NlIFdhdGNoIFJlcXVlc3Q8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiY2VudGVyIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyl9PnsodGhpcy5zdGF0ZS5yZXF1ZXN0U2VudCkgPyAnU2VuZCBBbm90aGVyIFdhdGNoIFJlcXVlc3QnIDogJ1NlbmQgQSBXYXRjaCBSZXF1ZXN0J308L2J1dHRvbj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nc2VudCB1cGRhdGVNc2cnPnsodGhpcy5zdGF0ZS5yZXF1ZXN0U2VudCkgPyAnUmVxdWVzdCBzZW50IScgOiAnJ308L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxudmFyIFdhdGNoUmVxdWVzdEZyaWVuZEVudHJ5ID0gKHByb3BzKSA9PiB7XHJcblxyXG4gIHJldHVybiAoPGxpIGNsYXNzTmFtZT1cImZyaWVuZFRvQXNrXCI+PHNwYW4+e3Byb3BzLmZyaWVuZH08L3NwYW4+PGEgY2xhc3NOYW1lPVwiYnRuLWZsb2F0aW5nIGJ0bi1zbWFsbCB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgcmVkXCIgb25DbGljaz17KCkgPT4gcHJvcHMuaGFuZGxlQWRkRnJpZW5kKHByb3BzLmZyaWVuZCl9PjxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj4rPC9pPjwvYT48L2xpPilcclxufTtcclxuXHJcbnZhciBXYXRjaFJlcXVlc3RTdGFzaEVudHJ5ID0gKHByb3BzKSA9PiB7XHJcbiAgcmV0dXJuICg8bGkgY2xhc3NOYW1lPVwiZnJpZW5kVG9Bc2tcIj48c3Bhbj57cHJvcHMuZnJpZW5kfTwvc3Bhbj48YSBjbGFzc05hbWU9XCJidG4tZmxvYXRpbmcgYnRuLXNtYWxsIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodCByZWRcIiBvbkNsaWNrPXsoKSA9PiBwcm9wcy5oYW5kbGVSZW1vdmVGcmllbmQocHJvcHMuZnJpZW5kKX0+PGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPi08L2k+PC9hPjwvbGk+KVxyXG59O1xyXG5cclxuXHJcbndpbmRvdy5Nb3ZpZVdhdGNoUmVxdWVzdCA9IE1vdmllV2F0Y2hSZXF1ZXN0O1xyXG5cclxuXHJcblxyXG4iXX0=