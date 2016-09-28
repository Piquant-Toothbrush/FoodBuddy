'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovieWatchRequest = function (_React$Component) {
  _inherits(MovieWatchRequest, _React$Component);

  function MovieWatchRequest(props) {
    _classCallCheck(this, MovieWatchRequest);

    var _this = _possibleConstructorReturn(this, (MovieWatchRequest.__proto__ || Object.getPrototypeOf(MovieWatchRequest)).call(this, props));

    _this.state = {
      active: false,
      friends: [],
      filteredFriends: [],
      friendStash: [],
      message: '',
      requestSent: false,
      noRequesteeWarning: false
    };
    return _this;
  }

  _createClass(MovieWatchRequest, [{
    key: 'getFriendList',
    value: function getFriendList() {
      var _this2 = this;

      //send get request to retrive friends and set to this.state.friends
      $.get(Url + '/getFriendList').then(function (friends) {
        // console.log('response from server', friends);
        var uniqFriend = _.uniq(friends);
        _this2.setState({
          friends: uniqFriend,
          filteredFriends: uniqFriend
        });
      });
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      //will turn this.state.active to true and rerender the view
      this.setState({
        active: !this.state.active,
        requestSent: false

      });
      this.getFriendList();
    }
  }, {
    key: 'handleMsg',
    value: function handleMsg(event) {
      this.setState({
        message: event.target.value
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
        var requestObj = {
          requestTyp: 'watch',
          movie: this.props.movie.title,
          movieid: this.props.movie.id,
          message: this.state.message,
          requestee: this.state.friendStash
        };

        $.post(Url + '/sendWatchRequest', requestObj).done(function (response) {
          _this3.setState({
            active: false,
            friendStash: [],
            filter: '',
            message: '',
            requestSent: true
          });
        });
      } else {
        this.setState({
          noRequesteeWarning: true
        });
      }
    }
  }, {
    key: 'handleFilter',
    value: function handleFilter(event) {
      //Filter a particular friend in the friend list

      var filteredFriends = [];
      this.state.friends.forEach(function (friend) {
        if (friend.indexOf(event.target.value) > -1) {
          filteredFriends.push(friend);
        }
      });

      this.setState({
        filteredFriends: filteredFriends
      });
    }
  }, {
    key: 'handleAddFriend',
    value: function handleAddFriend(friend) {
      // console.log('should be all friends to choose from', this.state.filteredFriends)
      //add friend to stash
      // console.log('calling handleAddFriend');
      var newFilteredFriends = this.state.filteredFriends;
      newFilteredFriends.splice(newFilteredFriends.indexOf(friend), 1);
      if (this.state.friendStash.indexOf(friend) < 0) {
        var stashCopy = this.state.friendStash;
        stashCopy.unshift(friend);
        this.setState({
          friendStash: stashCopy,
          filteredFriends: newFilteredFriends
        });
      }
    }
  }, {
    key: 'handleRemoveFriend',
    value: function handleRemoveFriend(friend) {
      //remove friend from stash
      var idx = this.state.friendStash.indexOf(friend);
      if (this.state.friendStash.length === 1) {
        this.setState({
          friendStash: []
        });
      } else {
        console.log('im trying to remove', friend);
        var stashCopy = this.state.friendStash;
        stashCopy.splice(idx, 1);
        this.setState({
          friendStash: stashCopy
        });
      }

      var newFilteredFriends = this.state.filteredFriends.concat([friend]);
      this.setState({
        filteredFriends: newFilteredFriends
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      if (this.state.active) {
        if (this.state.friendStash.length > 0) {
          var stash = React.createElement(
            'div',
            { className: 'MovieWatchRequestFriendStash col s6' },
            React.createElement(
              'ul',
              { className: 'friendStash', name: 'friendStash', multiple: true },
              this.state.friendStash.map(function (friend) {
                return React.createElement(WatchRequestStashEntry, { friend: friend, handleRemoveFriend: _this4.handleRemoveFriend.bind(_this4) });
              })
            )
          );
        } else if (this.state.friendStash.length === 0) {
          var stash = React.createElement(
            'div',
            { className: 'MovieWatchRequestFriendStash col s6' },
            React.createElement(
              'ul',
              { className: 'friendStash', name: 'friendStash', multiple: true },
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
                { className: 'friendList', name: 'friendsList', multiple: true },
                this.state.filteredFriends.length === 0 ? React.createElement(
                  'div',
                  { className: 'errorMsg' },
                  '\'No friends to choose from\''
                ) : '',
                this.state.filteredFriends.map(function (friend) {
                  return React.createElement(WatchRequestFriendEntry, { friend: friend, handleAddFriend: _this4.handleAddFriend.bind(_this4) });
                })
              )
            ),
            stash
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

  return MovieWatchRequest;
}(React.Component);

var WatchRequestFriendEntry = function WatchRequestFriendEntry(props) {

  return React.createElement(
    'li',
    null,
    React.createElement(
      'span',
      null,
      props.friend
    ),
    React.createElement(
      'a',
      { className: 'btn-floating btn-small waves-effect waves-light red', onClick: function onClick() {
          return props.handleAddFriend(props.friend);
        } },
      React.createElement(
        'i',
        { 'class': 'material-icons' },
        '+'
      )
    )
  );
};

var WatchRequestStashEntry = function WatchRequestStashEntry(props) {
  return React.createElement(
    'li',
    null,
    React.createElement(
      'span',
      null,
      props.friend
    ),
    React.createElement(
      'a',
      { className: 'btn-floating btn-small waves-effect waves-light red', onClick: function onClick() {
          return props.handleRemoveFriend(props.friend);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZVdhdGNoUmVxdWVzdC5qcyJdLCJuYW1lcyI6WyJNb3ZpZVdhdGNoUmVxdWVzdCIsInByb3BzIiwic3RhdGUiLCJhY3RpdmUiLCJmcmllbmRzIiwiZmlsdGVyZWRGcmllbmRzIiwiZnJpZW5kU3Rhc2giLCJtZXNzYWdlIiwicmVxdWVzdFNlbnQiLCJub1JlcXVlc3RlZVdhcm5pbmciLCIkIiwiZ2V0IiwiVXJsIiwidGhlbiIsInVuaXFGcmllbmQiLCJfIiwidW5pcSIsInNldFN0YXRlIiwiZ2V0RnJpZW5kTGlzdCIsImV2ZW50IiwidGFyZ2V0IiwidmFsdWUiLCJsZW5ndGgiLCJyZXF1ZXN0T2JqIiwicmVxdWVzdFR5cCIsIm1vdmllIiwidGl0bGUiLCJtb3ZpZWlkIiwiaWQiLCJyZXF1ZXN0ZWUiLCJwb3N0IiwiZG9uZSIsImZpbHRlciIsImZvckVhY2giLCJmcmllbmQiLCJpbmRleE9mIiwicHVzaCIsIm5ld0ZpbHRlcmVkRnJpZW5kcyIsInNwbGljZSIsInN0YXNoQ29weSIsInVuc2hpZnQiLCJpZHgiLCJjb25zb2xlIiwibG9nIiwiY29uY2F0Iiwic3Rhc2giLCJtYXAiLCJoYW5kbGVSZW1vdmVGcmllbmQiLCJiaW5kIiwiaGFuZGxlRmlsdGVyIiwiaGFuZGxlQWRkRnJpZW5kIiwiaGFuZGxlTXNnIiwiaGFuZGxlU3VibWl0IiwiaGFuZGxlQ2xpY2siLCJSZWFjdCIsIkNvbXBvbmVudCIsIldhdGNoUmVxdWVzdEZyaWVuZEVudHJ5IiwiV2F0Y2hSZXF1ZXN0U3Rhc2hFbnRyeSIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxpQjs7O0FBRUosNkJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxzSUFDWEEsS0FEVzs7QUFFakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1pDLGNBQVEsS0FESTtBQUVaQyxlQUFTLEVBRkc7QUFHWEMsdUJBQWlCLEVBSE47QUFJWkMs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REFBYixFQUFtRSxTQUFTO0FBQUEsaUJBQU1qQyxNQUFNOEMsa0JBQU4sQ0FBeUI5QyxNQUFNaUMsTUFBL0IsQ0FBTjtBQUFBLFNBQTVFO0FBQTBIO0FBQUE7QUFBQSxVQUFHLFNBQU0sZ0JBQVQ7QUFBQTtBQUFBO0FBQTFIO0FBQS9CLEdBQVI7QUFDRCxDQUZEOztBQUtBd0IsT0FBTzFELGlCQUFQLEdBQTJCQSxpQkFBM0IiLCJmaWxlIjoiTW92aWVXYXRjaFJlcXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNb3ZpZVdhdGNoUmVxdWVzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICBcdFx0YWN0aXZlOiBmYWxzZSxcclxuICAgXHRcdGZyaWVuZHM6IFtdLFxyXG4gICAgICBmaWx0ZXJlZEZyaWVuZHM6IFtdLFxyXG4gICBcdFx0ZnJpZW5kU3Rhc2g6W10sXHJcbiAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICByZXF1ZXN0U2VudDogZmFsc2UsXHJcbiAgICAgIG5vUmVxdWVzdGVlV2FybmluZzogZmFsc2VcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZXRGcmllbmRMaXN0KCkge1xyXG4gIFx0Ly9zZW5kIGdldCByZXF1ZXN0IHRvIHJldHJpdmUgZnJpZW5kcyBhbmQgc2V0IHRvIHRoaXMuc3RhdGUuZnJpZW5kc1xyXG4gICAgJC5nZXQoVXJsICsgJy9nZXRGcmllbmRMaXN0JylcclxuICAgIC50aGVuKGZyaWVuZHMgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCBmcmllbmRzKTtcclxuICAgICAgdmFyIHVuaXFGcmllbmQgPSBfLnVuaXEoZnJpZW5kcyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGZyaWVuZHM6IHVuaXFGcmllbmQsXHJcbiAgICAgICAgZmlsdGVyZWRGcmllbmRzOiB1bmlxRnJpZW5kXHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGhhbmRsZUNsaWNrKCkge1xyXG4gIFx0Ly93aWxsIHR1cm4gdGhpcy5zdGF0ZS5hY3RpdmUgdG8gdHJ1ZSBhbmQgcmVyZW5kZXIgdGhlIHZpZXdcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBhY3RpdmU6ICF0aGlzLnN0YXRlLmFjdGl2ZSxcclxuICAgICAgcmVxdWVzdFNlbnQ6IGZhbHNlXHJcblxyXG4gICAgfSlcclxuICAgIHRoaXMuZ2V0RnJpZW5kTGlzdCgpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlTXNnKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgbWVzc2FnZTogZXZlbnQudGFyZ2V0LnZhbHVlXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlU3VibWl0KCkge1xyXG4gIFx0Ly93aWxsIHNlbmQgb3V0IGEgd2F0Y2ggcmVxdWVzdCBmb3IgdGhpcy5wcm9wcy5tb3ZpZSB0byBmcmllbmRzIGluIHRoZSBzdGFzaFxyXG4gIFx0Ly93aWxsIGRpc3BsYXkgYSBtZXNzYWdlIHNheWluZyB0aGUgcmVxdWVzdCBpcyBtYWRlXHJcbiAgXHQvL3NldCB0aGlzLnN0YXRlLmFjdGl2ZSB0byBmYWxzZVxyXG4gICAgLy9zZXQgdGhlIHN0YXNoIHRvIGVtcHR5XHJcbiAgXHQvL3Nob3cgc2VuZCBhbm90aGVyIHJlcXVlc3QgYnV0dG9uXHJcbiAgICBpZiAodGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5sZW5ndGgpIHtcclxuICAgICAgdmFyIHJlcXVlc3RPYmogPSB7XHJcbiAgICAgICAgcmVxdWVzdFR5cDogJ3dhdGNoJyxcclxuICAgICAgICBtb3ZpZTogdGhpcy5wcm9wcy5tb3ZpZS50aXRsZSxcclxuICAgICAgICBtb3ZpZWlkOiB0aGlzLnByb3BzLm1vdmllLmlkLFxyXG4gICAgICAgIG1lc3NhZ2U6IHRoaXMuc3RhdGUubWVzc2FnZSxcclxuICAgICAgICByZXF1ZXN0ZWU6IHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2hcclxuICAgICAgfTtcclxuXHJcbiAgICAgICQucG9zdChVcmwgKyAnL3NlbmRXYXRjaFJlcXVlc3QnLCByZXF1ZXN0T2JqKVxyXG4gICAgICAuZG9uZShyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBhY3RpdmU6IGZhbHNlLFxyXG4gICAgICAgICAgZnJpZW5kU3Rhc2g6IFtdLFxyXG4gICAgICAgICAgZmlsdGVyOiAnJyxcclxuICAgICAgICAgIG1lc3NhZ2U6ICcnLFxyXG4gICAgICAgICAgcmVxdWVzdFNlbnQ6IHRydWVcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG5vUmVxdWVzdGVlV2FybmluZzogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGhhbmRsZUZpbHRlcihldmVudCkge1xyXG4gIFx0Ly9GaWx0ZXIgYSBwYXJ0aWN1bGFyIGZyaWVuZCBpbiB0aGUgZnJpZW5kIGxpc3RcclxuXHJcbiAgICB2YXIgZmlsdGVyZWRGcmllbmRzID0gW107XHJcbiAgICB0aGlzLnN0YXRlLmZyaWVuZHMuZm9yRWFjaChmcmllbmQgPT4ge1xyXG4gICAgICBpZiAoZnJpZW5kLmluZGV4T2YoZXZlbnQudGFyZ2V0LnZhbHVlKSA+IC0xICkge1xyXG4gICAgICAgIGZpbHRlcmVkRnJpZW5kcy5wdXNoKGZyaWVuZCk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICBcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBmaWx0ZXJlZEZyaWVuZHM6IGZpbHRlcmVkRnJpZW5kc1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVBZGRGcmllbmQoZnJpZW5kKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnc2hvdWxkIGJlIGFsbCBmcmllbmRzIHRvIGNob29zZSBmcm9tJywgdGhpcy5zdGF0ZS5maWx0ZXJlZEZyaWVuZHMpXHJcbiAgICAvL2FkZCBmcmllbmQgdG8gc3Rhc2hcclxuICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsaW5nIGhhbmRsZUFkZEZyaWVuZCcpO1xyXG4gICAgdmFyIG5ld0ZpbHRlcmVkRnJpZW5kcz10aGlzLnN0YXRlLmZpbHRlcmVkRnJpZW5kcztcclxuICAgIG5ld0ZpbHRlcmVkRnJpZW5kcy5zcGxpY2UobmV3RmlsdGVyZWRGcmllbmRzLmluZGV4T2YoZnJpZW5kKSwxKTtcclxuICAgIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmluZGV4T2YoZnJpZW5kKSA8IDApIHtcclxuICAgICAgdmFyIHN0YXNoQ29weSA9IHRoaXMuc3RhdGUuZnJpZW5kU3Rhc2g7XHJcbiAgICAgIHN0YXNoQ29weS51bnNoaWZ0KGZyaWVuZCk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGZyaWVuZFN0YXNoOiBzdGFzaENvcHksXHJcbiAgICAgICAgZmlsdGVyZWRGcmllbmRzOm5ld0ZpbHRlcmVkRnJpZW5kc1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhhbmRsZVJlbW92ZUZyaWVuZChmcmllbmQpIHtcclxuICAgIC8vcmVtb3ZlIGZyaWVuZCBmcm9tIHN0YXNoXHJcbiAgICB2YXIgaWR4ID0gdGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5pbmRleE9mKGZyaWVuZClcclxuICAgIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBmcmllbmRTdGFzaDogW11cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygnaW0gdHJ5aW5nIHRvIHJlbW92ZScsIGZyaWVuZCk7XHJcbiAgICAgIHZhciBzdGFzaENvcHkgPSB0aGlzLnN0YXRlLmZyaWVuZFN0YXNoO1xyXG4gICAgICBzdGFzaENvcHkuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGZyaWVuZFN0YXNoOiBzdGFzaENvcHlcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG5ld0ZpbHRlcmVkRnJpZW5kcz10aGlzLnN0YXRlLmZpbHRlcmVkRnJpZW5kcy5jb25jYXQoW2ZyaWVuZF0pO1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGZpbHRlcmVkRnJpZW5kczogbmV3RmlsdGVyZWRGcmllbmRzXHJcbiAgICB9KTtcclxuXHJcblxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlKSB7XHJcbiAgICAgIGlmICh0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLmxlbmd0aCA+IDApIHtcclxuICAgICAgICB2YXIgc3Rhc2ggPSBcclxuICAgICAgICAgICg8ZGl2IGNsYXNzTmFtZT1cIk1vdmllV2F0Y2hSZXF1ZXN0RnJpZW5kU3Rhc2ggY29sIHM2XCI+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJmcmllbmRTdGFzaFwiIG5hbWU9XCJmcmllbmRTdGFzaFwiIG11bHRpcGxlPlxyXG4gICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmZyaWVuZFN0YXNoLm1hcChmcmllbmQgPT4gPFdhdGNoUmVxdWVzdFN0YXNoRW50cnkgZnJpZW5kPXtmcmllbmR9IGhhbmRsZVJlbW92ZUZyaWVuZD17dGhpcy5oYW5kbGVSZW1vdmVGcmllbmQuYmluZCh0aGlzKX0vPil9XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2Rpdj4pXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5mcmllbmRTdGFzaC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICB2YXIgc3Rhc2ggPSBcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIk1vdmllV2F0Y2hSZXF1ZXN0RnJpZW5kU3Rhc2ggY29sIHM2XCI+XHJcbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZnJpZW5kU3Rhc2hcIiBuYW1lPVwiZnJpZW5kU3Rhc2hcIiBtdWx0aXBsZT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPlBsZWFzZSBTZWxlY3QgQSBGcmllbmQ8L2Rpdj5cclxuICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4oXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3RpdmVXYXRjaFJlcXVlc3RcIj5cclxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiZmlsdGVyIGZyaWVuZHNcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVGaWx0ZXIuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJNb3ZpZVdhdGNoUmVxdWVzdEZyaWVuZExpc3QgY29sIHM2XCI+XHJcbiAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZyaWVuZExpc3RcIiBuYW1lPVwiZnJpZW5kc0xpc3RcIiBtdWx0aXBsZT5cclxuICAgICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS5maWx0ZXJlZEZyaWVuZHMubGVuZ3RoID09PSAwKSA/IDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj4nTm8gZnJpZW5kcyB0byBjaG9vc2UgZnJvbSc8L2Rpdj4gOiAnJ31cclxuICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmZpbHRlcmVkRnJpZW5kcy5tYXAoZnJpZW5kID0+IDxXYXRjaFJlcXVlc3RGcmllbmRFbnRyeSBmcmllbmQ9e2ZyaWVuZH0gaGFuZGxlQWRkRnJpZW5kPXt0aGlzLmhhbmRsZUFkZEZyaWVuZC5iaW5kKHRoaXMpfS8+KX1cclxuICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIHtzdGFzaH1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cIm1lc3NhZ2VCb3hcIiBjb2xzPVwiNDBcIiByb3dzPVwiNVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU1zZy5iaW5kKHRoaXMpfSBwbGFjZWhvbGRlcj1cIkFkZCBhIG1lc3NhZ2VcIiBtYXhsZW5ndGg9XCIyNTVcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ3YXRjaFJlcXVlc3RcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpfT5TZW5kIFdhdGNoIFJlcXVlc3Q8L2J1dHRvbj5cclxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiY2xvc2VXYXRjaFJlcXVlc3RcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyl9PkNsb3NlIFdhdGNoIFJlcXVlc3Q8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJjZW50ZXIgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKX0+eyh0aGlzLnN0YXRlLnJlcXVlc3RTZW50KSA/ICdTZW5kIEFub3RoZXIgV2F0Y2ggUmVxdWVzdCcgOiAnU2VuZCBBIFdhdGNoIFJlcXVlc3QnfTwvYnV0dG9uPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdzZW50IHVwZGF0ZU1zZyc+eyh0aGlzLnN0YXRlLnJlcXVlc3RTZW50KSA/ICd5b3VyIHJlcXVlc3QgaGFzIGJlZW4gc2VudCcgOiAnJ308L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxudmFyIFdhdGNoUmVxdWVzdEZyaWVuZEVudHJ5ID0gKHByb3BzKSA9PiB7XHJcblxyXG4gIHJldHVybiAoPGxpPjxzcGFuPntwcm9wcy5mcmllbmR9PC9zcGFuPjxhIGNsYXNzTmFtZT1cImJ0bi1mbG9hdGluZyBidG4tc21hbGwgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IHJlZFwiIG9uQ2xpY2s9eygpID0+IHByb3BzLmhhbmRsZUFkZEZyaWVuZChwcm9wcy5mcmllbmQpfT48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+KzwvaT48L2E+PC9saT4pXHJcbn07XHJcblxyXG52YXIgV2F0Y2hSZXF1ZXN0U3Rhc2hFbnRyeSA9IChwcm9wcykgPT4ge1xyXG4gIHJldHVybiAoPGxpPjxzcGFuPntwcm9wcy5mcmllbmR9PC9zcGFuPjxhIGNsYXNzTmFtZT1cImJ0bi1mbG9hdGluZyBidG4tc21hbGwgd2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IHJlZFwiIG9uQ2xpY2s9eygpID0+IHByb3BzLmhhbmRsZVJlbW92ZUZyaWVuZChwcm9wcy5mcmllbmQpfT48aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+LTwvaT48L2E+PC9saT4pXHJcbn07XHJcblxyXG5cclxud2luZG93Lk1vdmllV2F0Y2hSZXF1ZXN0ID0gTW92aWVXYXRjaFJlcXVlc3Q7XHJcblxyXG5cclxuXHJcbiJdfQ==