'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (c) { return typeof c; } : function (c) { return c && typeof Symbol === "function" && c.constructor === Symbol ? "symbol" : typeof c; };

var _createClass = function () { function c(d, e) { for (var i = 0; i < e.length; i++) { var f = e[i]; f.enumerable = f.enumerable || !1; f.configurable = !0; if ("value" in f) f.writable = !0; Object.defineProperty(d, f.key, f); } } return function (d, e, f) { if (e) c(d.prototype, e); if (f) c(d, f); return d; }; }();

function _classCallCheck(c, d) { if (!(c instanceof d)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(c, d) { if (!c) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return d && (typeof d === "object" || typeof d === "function") ? d : c; }

function _inherits(c, d) { if (typeof d !== "function" && d !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof d); } c.prototype = Object.create(d && d.prototype, { constructor: { value: c, enumerable: !1, writable: !0, configurable: !0 } }); if (d) Object.setPrototypeOf ? Object.setPrototypeOf(c, d) : c.__proto__ = d; }

var App = function (c) {
  _inherits(d, c);

  function d(e) {
    _classCallCheck(this, d);

    var f = _possibleConstructorReturn(this, (d.__proto__ || Object.getPrototypeOf(d)).call(this, e));

    f.state = startingState;
    f.sendWatchRequest = f.sendWatchRequest.bind(f);
    f.getFriends = f.getCurrentFriends.bind(f);
    f.myFriends = f.state.myFriends;
    f.logout = f.logout.bind(f);
    f.sendRequest = f.sendRequest.bind(f);
    f.changeViews = f.changeViews.bind(f);
    f.setCurrentUser = f.setCurrentUser.bind(f);
    f.getMovie = f.getMovie.bind(f);
    f.acceptFriend = f.acceptFriend.bind(f);
    f.declineFriend = f.declineFriend.bind(f);
    f.changeViewsMovie = f.changeViewsMovie.bind(f);
    f.changeViewsFriends = f.changeViewsFriends.bind(f);
    f.findMovieBuddies = f.findMovieBuddies.bind(f);
    f.buddyRequest = f.buddyRequest.bind(f);
    f.listPendingFriendRequests = f.listPendingFriendRequests.bind(f);
    f.focusOnFriend = f.focusOnFriend.bind(f);
    f.removeRequest = f.removeRequest.bind(f);
    return f;
  }

  _createClass(d, [{
    key: 'getCurrentFriends',
    value: function getCurrentFriends() {
      var _this2 = this;

      // console.log('testinggg');
      $.post(Url + '/getFriends', { test: 'info' }, function (a, b) {
        // console.log('what you get back from server for get friends',a,b);
        for (var i = 0; i < a.length; i++) {
          if (a[i][1] === null) {
            a[i][1] = "No comparison to be made";
          }
        }

        var e = a.sort(function (a, b) {
          return b[1] - a[1];
        });

        _this2.setState({
          myFriends: e
        });
      });
    }
  }, {
    key: 'acceptFriend',
    value: function acceptFriend(e, f) {
      var _this3 = this,
          g = this;

      $.post(Url + '/accept', { personToAccept: e, movie: f }, function (h, j) {
        var k = _this3.state.pendingFriendRequests,
            l = k.map(function (a) {
          return a.requestor;
        });

        k.splice(l.indexOf(e), 1);


        //that.listPendingFriendRequests();
        _this3.setState({ pendingFriendRequests: k });
      });

      // console.log('refreshed inbox, should delete friend request on the spot instead of moving')
    }
  }, {
    key: 'declineFriend',
    value: function declineFriend(e, f) {
      var _this4 = this,
          g = this;

      $.post(Url + '/decline', { personToDecline: e, movie: f }, function (h, j) {
        // console.log('this is the state after declining friend, ', this.state);
        var k = _this4.state.requestResponses,
            l = k.map(function (a) {
          return a.requestor;
        });

        k.splice(l.indexOf(e), 1);


        //that.listPendingFriendRequests();//
        _this4.setState({ requestResponses: k });
      });
    }
  }, {
    key: 'findMovieBuddies',
    value: function findMovieBuddies() {
      var _this5 = this,
          e = this;

      $.post(Url + '/findMovieBuddies', { dummy: 'info' }, function (f, g) {
        var h = f.sort(function (a, b) {
          return b[1] - a[1];
        }),
            j = e.myFriends,
            k = [];

        for (var i = 0; i < h.length; i++) {
          var l = !0;
          for (var x = 0; x < j.length; x++) {
            if (h[i][0] === j[x][0]) {
              l = !1;
            }
          }
          if (l) {
            k.push(h[i]);
          }
        }

        _this5.setState({
          view: "FNMB",
          potentialMovieBuddies: k
        });

        _this5.getCurrentFriends();
      });
    }
  }, {
    key: 'changeView',
    value: function changeView() {
      this.setState({
        view: "SignUp"
      });
    }
  }, {
    key: 'setCurrentUser',
    value: function setCurrentUser(e) {
      // console.log('calling setCurrentUser');
      this.setState({
        currentUser: e
      });
    }
  }, {
    key: 'enterNewUser',
    value: function enterNewUser(e, f) {
      var _this6 = this;

      // console.log(name,password);
      $.post(Url + '/signup', { name: e, password: f }).then(function () {
        // console.log('success'); 
        _this6.setState({ username: e, view: "Home" });
      }).catch(function () {});
    }
  }, {
    key: 'getFriendMovieRatings',
    value: function getFriendMovieRatings() {
      var _this7 = this,
          e = document.getElementById("movieToView").value;

      $.post(Url + '/getFriendRatings', { name: e }).then(function (f) {
        _this7.setState({
          view: "Home",
          friendsRatings: f
        });
        // console.log('our response',this.state.friendsRatings)
      }).catch(function (f) {});
    }
  }, {
    key: 'logout',
    value: function logout() {
      var _this8 = this;

      $.post(Url + '/logout').then(function (e) {
        // console.log(response);
        _this8.setState(startingState);
      });
    }
  }, {
    key: 'sendWatchRequest',
    value: function sendWatchRequest(e) {
      var f = document.getElementById('movieToWatch').value,
          g = { requestee: e, movie: f };

      if (f.length) {
        $.post(Url + '/sendWatchRequest', g, function (h, j) {
          // console.log(resp, err);
        });
        document.getElementById('movieToWatch').value = '';
      } else {
        // console.log('you need to enter a movie to send a watch request!!!!')
      }
    }

    /////////////////////
    /////movie render
    /////////////////////
    //call searchmovie function
    //which gets passed down to the Movie Search 

  }, {
    key: 'getMovie',
    value: function getMovie(e) {
      var _this9 = this,
          f = {
        query: e
      };

      this.props.searchMovie(f, function (g) {
        // console.log(movie);
        _this9.setState({
          view: "MovieSearchView",
          movie: g
        });
      });
    }
    //show the movie searched in friend movie list
    //onto the stateview of moviesearchview

  }, {
    key: 'showMovie',
    value: function showMovie(e) {
      this.setState({
        movie: e
      });
    }
    /////////////////////
    /////Nav change
    /////////////////////

  }, {
    key: 'changeViews',
    value: function changeViews(e) {
      // console.log(this.state);

      if (e === 'Friends') {
        // console.log('you switched to friends!!')
        this.getCurrentFriends();
        //this.sendRequest();
      }

      if (e === 'Home') {
        // this.getCurrentFriends()
        this.sendRequest();
      }

      if (e === "Inbox") {
        this.listPendingFriendRequests();
      }

      this.setState({
        view: e
      });
    }
  }, {
    key: 'changeViewsMovie',
    value: function changeViewsMovie(e, f) {
      this.setState({
        view: e,
        movie: f
      });
    }
  }, {
    key: 'changeViewsFriends',
    value: function changeViewsFriends(e, f) {
      this.setState({
        view: e,
        friendToFocusOn: f
      });
    }
  }, {
    key: 'buddyRequest',
    value: function buddyRequest(e, f) {
      this.sendRequest(e, f);
    }
  }, {
    key: 'sendRequest',
    value: function sendRequest(a, e) {
      var _this10 = this;

      if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === "object") {
        var f = document.getElementById('findFriendByName').value;
      } else {
        var f = a || 'test';
      }

      var g = this.state.myFriends,
          h = g.map(function (j) {
        return j[0];
      });

      this.state.requestsOfCurrentUser.forEach(function (j) {
        h.push(j);
      });

      // console.log('this should also be my friends',person, currFriends,friends1,friends2)

      if (h.indexOf(f) !== -1 && h.length !== 0) {
        $(document).scrollTop(0);

        $("#AlreadyReq,#AlreadyReq2").fadeIn(1000);
        $("#AlreadyReq,#AlreadyReq2").fadeOut(1000);

        // console.log('this person is already in there!!')
      } else if (!f.length) {
        $(document).scrollTop(0);
        $("#enterRealFriend,#enterRealFriend2").fadeIn(1000);
        $("#enterRealFriend,#enterRealFriend2").fadeOut(1000);
      } else {

        // console.log('person is defined?',person);
        $.post(Url + '/sendRequest', { name: f }, function (j, k) {
          $(document).scrollTop(0);
          if (j.indexOf(f) > -1) {
            $("#AlreadyReq,#AlreadyReq2").fadeIn(1000);
            $("#AlreadyReq,#AlreadyReq2").fadeOut(1000);
          } else {
            $("#reqSent,#reqSent2").fadeIn(1000);
            $("#reqSent,#reqSent2").fadeOut(1000);
          }

          _this10.setState({
            requestsOfCurrentUser: j.concat([f])
          });
        });

        if (document.getElementById('findFriendByName') !== null) {
          document.getElementById('findFriendByName').value = '';
        }
      }
    }
  }, {
    key: 'listPendingFriendRequests',
    value: function listPendingFriendRequests() {
      var _this11 = this;

      $.post(Url + '/listRequests', function (e, f) {
        var g = [],
            h = [];


        for (var i = 0; i < e[0].length; i++) {
          var j = e[0][i].requestor,
              k = e[0][i].response;

          if (j !== e[1] && k === null) {
            g.push(e[0][i]);
          }
          if (j === e[1] && k !== null && e[0][i].requestee !== 'test') {
            h.push(e[0][i]);
          }
        }
        //


        _this11.setState({
          pendingFriendRequests: g,
          requestResponses: h
        });
      });
    }
  }, {
    key: 'focusOnFriend',
    value: function focusOnFriend(e) {
      var _this12 = this;

      //
      this.setState({
        view: 'singleFriend',
        friendToFocusOn: e
      });

      $.get(Url + '/getFriendUserRatings', { friendName: e }, function (f) {
        _this12.setState({
          individualFriendsMovies: f
        });
      });
    }
  }, {
    key: 'removeRequest',
    value: function removeRequest(e, f, g) {
      var h = this;
      $.ajax({
        url: Url + '/removeRequest',
        type: 'DELETE',
        data: {
          requestor: f,
          requestee: e,
          movie: g
        },
        success: function success(j) {
          h.listPendingFriendRequests();
        },
        error: function error(j) {}
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var e = React.createElement(Nav, { name: this.state.currentUser,
        find: this.findMovieBuddies,
        onClick: this.changeViews,
        logout: this.logout
      });

      if (this.state.view === 'Login') {
        return React.createElement(LogIn, { changeViews: this.changeViews, setCurrentUser: this.setCurrentUser });
      } else if (this.state.view === "SignUp") {
        return React.createElement(SignUp, { changeViews: this.changeViews, setCurrentUser: this.setCurrentUser });
      }
      //this view is added for moviesearch rendering
      else if (this.state.view === "MovieSearchView") {
          return React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              null,
              e
            ),
            React.createElement(
              'div',
              null,
              React.createElement(MovieRating, {
                handleSearchMovie: this.getMovie,
                movie: this.state.movie
              })
            )
          );
        } else if (this.state.view === "Inbox") {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies,
              onClick: this.changeViews,
              logout: this.logout,
              Home: !0
            }),
            React.createElement(Inbox, {
              requests: this.state.pendingFriendRequests,
              responsesAnswered: this.state.requestResponses,
              logout: this.logout,
              accept: this.acceptFriend,
              decline: this.declineFriend,
              listRequests: this.listPendingFriendRequests,
              pplWhoWantToBeFriends: this.state.pendingFriendRequests.map(function (a) {
                return [a.requestor, a.requestTyp, a.movie === null ? "" : a.movie, "Message:" + a.message === 'null' ? "none" : a.message];
              }),
              remove: this.removeRequest
            })
          );
        } else if (this.state.view === "Friends") {
          return React.createElement(
            'div',
            null,
            e,
            React.createElement(Friends, {
              sendWatchRequest: this.sendWatchRequest,
              fof: this.focusOnFriend,
              getFriends: this.getCurrentFriends,
              myFriends: this.state.myFriends,
              listPotentials: this.listPotentials,
              logout: this.logout,
              sendRequest: this.sendRequest
            })
          );
        } else if (this.state.view === "Home") {
          return React.createElement(
            'div',
            null,
            e,
            React.createElement(Home, {
              change: this.changeViewsMovie
            })
          );
        } else if (this.state.view === "SingleMovie") {
          var f = this;
          return React.createElement(
            'div',
            { onClick: function onClick() {
                return void 0;
              } },
            e,
            React.createElement(SingleMovieRating, {
              compatibility: this.state.myFriends,
              currentMovie: this.state.movie,
              change: this.changeViewsFriends,
              fof: this.focusOnFriend
            })
          );
        } else if (this.state.view === 'singleFriend') {
          return React.createElement(
            'div',
            null,
            e,
            React.createElement(SingleFriend, {
              moviesOfFriend: this.state.individualFriendsMovies,
              friendName: this.state.friendToFocusOn,
              onClick: this.changeViews,
              change: this.changeViewsMovie
            })
          );
        } else if (this.state.view === "FNMB") {
          return React.createElement(
            'div',
            null,
            e,
            React.createElement(FindMovieBuddy, {
              buddyfunc: this.buddyRequest,
              buddies: this.state.potentialMovieBuddies
            })
          );
        } else if (this.state.view === "MyRatings") {
          return React.createElement(
            'div',
            null,
            e,
            React.createElement(MyRatings, {
              change: this.changeViewsMovie
            })
          );
        }
    }
  }]);

  return d;
}(React.Component);

window.App = App;

var Url = 'https://reelfriendz.herokuapp.com';
// var Url = 'http://127.0.0.1:3000';
window.Url = Url;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRpbmdTdGF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJiaW5kIiwiZ2V0RnJpZW5kcyIsImdldEN1cnJlbnRGcmllbmRzIiwibXlGcmllbmRzIiwibG9nb3V0Iiwic2VuZFJlcXVlc3QiLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiZ2V0TW92aWUiLCJhY2NlcHRGcmllbmQiLCJkZWNsaW5lRnJpZW5kIiwiY2hhbmdlVmlld3NNb3ZpZSIsImNoYW5nZVZpZXdzRnJpZW5kcyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJidWRkeVJlcXVlc3QiLCJsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzIiwiZm9jdXNPbkZyaWVuZCIsInJlbW92ZVJlcXVlc3QiLCIkIiwicG9zdCIsIlVybCIsInRlc3QiLCJhIiwiYiIsImkiLCJsZW5ndGgiLCJmaW5hbCIsInNvcnQiLCJzZXRTdGF0ZSIsInBlcnNvblRvQWNjZXB0IiwibW92aWUiLCJ0aGF0IiwicmVzcCIsImVyciIsInBlbmRpbmciLCJwZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJyZXFzIiwibWFwIiwicmVxdWVzdG9yIiwic3BsaWNlIiwiaW5kZXhPZiIsInBlcnNvblRvRGVjbGluZSIsInJlcXVlc3RSZXNwb25zZXMiLCJkdW1teSIsInNvcnRlZCIsInVuaXF1ZUZyaWVuZHMiLCJ1bmlxdWUiLCJ4IiwicHVzaCIsInZpZXciLCJwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXMiLCJ1c2VybmFtZSIsImN1cnJlbnRVc2VyIiwibmFtZSIsInBhc3N3b3JkIiwidGhlbiIsImNhdGNoIiwibW92aWVOYW1lIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInZhbHVlIiwiZnJpZW5kc1JhdGluZ3MiLCJyZXNwb25zZSIsImZyaWVuZCIsInRvU2VuZCIsInJlcXVlc3RlZSIsInF1ZXJ5Iiwib3B0aW9ucyIsInNlYXJjaE1vdmllIiwidGFyZ2V0U3RhdGUiLCJmcmllbmRUb0ZvY3VzT24iLCJwZXJzb24iLCJpZHgiLCJjdXJyRnJpZW5kcyIsImZyaWVuZHMxIiwiZnJpZW5kSW5mbyIsInJlcXVlc3RzT2ZDdXJyZW50VXNlciIsImZvckVhY2giLCJyZXEiLCJzY3JvbGxUb3AiLCJmYWRlSW4iLCJmYWRlT3V0IiwiY29uY2F0IiwiZXJyb3IiLCJwRlIiLCJyUiIsInJlc3BvbnNlVFUiLCJnZXQiLCJmcmllbmROYW1lIiwiaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXMiLCJzZWxmIiwiYWpheCIsInVybCIsInR5cGUiLCJkYXRhIiwic3VjY2VzcyIsIm5hdiIsInJlcXVlc3RUeXAiLCJtZXNzYWdlIiwibGlzdFBvdGVudGlhbHMiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQ01BLEc7OztBQUNKLGFBQVlDLENBQVosRUFBbUI7QUFBQTs7QUFBQSxrR0FDWEEsQ0FEVzs7QUFFakIsTUFBS0MsS0FBTCxHQUFhQyxhQUFiO0FBQ0EsTUFBS0MsZ0JBQUwsR0FBc0IsRUFBS0EsZ0JBQUwsQ0FBc0JDLElBQXRCLEdBQXRCO0FBQ0EsTUFBS0MsVUFBTCxHQUFnQixFQUFLQyxpQkFBTCxDQUF1QkYsSUFBdkIsR0FBaEI7QUFDQSxNQUFLRyxTQUFMLEdBQWUsRUFBS04sS0FBTCxDQUFXTSxTQUExQjtBQUNBLE1BQUtDLE1BQUwsR0FBWSxFQUFLQSxNQUFMLENBQVlKLElBQVosR0FBWjtBQUNBLE1BQUtLLFdBQUwsR0FBaUIsRUFBS0EsV0FBTCxDQUFpQkwsSUFBakIsR0FBakI7QUFDQSxNQUFLTSxXQUFMLEdBQWlCLEVBQUtBLFdBQUwsQ0FBaUJOLElBQWpCLEdBQWpCO0FBQ0EsTUFBS08sY0FBTCxHQUFvQixFQUFLQSxjQUFMLENBQW9CUCxJQUFwQixHQUFwQjtBQUNBLE1BQUtRLFFBQUwsR0FBYyxFQUFLQSxRQUFMLENBQWNSLElBQWQsR0FBZDtBQUNBLE1B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QixNQUFNLG1DQUFWO0FBQ0E7QUFDQWtGLE9BQU9sRixHQUFQLEdBQWFBLEdBQWIiLCJmaWxlIjoiQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSBzdGFydGluZ1N0YXRlO1xyXG4gICAgdGhpcy5zZW5kV2F0Y2hSZXF1ZXN0PXRoaXMuc2VuZFdhdGNoUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRGcmllbmRzPXRoaXMuZ2V0Q3VycmVudEZyaWVuZHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubXlGcmllbmRzPXRoaXMuc3RhdGUubXlGcmllbmRzO1xyXG4gICAgdGhpcy5sb2dvdXQ9dGhpcy5sb2dvdXQuYmluZCh0aGlzKSAgXHJcbiAgICB0aGlzLnNlbmRSZXF1ZXN0PXRoaXMuc2VuZFJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hhbmdlVmlld3M9dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZXRDdXJyZW50VXNlcj10aGlzLnNldEN1cnJlbnRVc2VyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldE1vdmllPXRoaXMuZ2V0TW92aWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYWNjZXB0RnJpZW5kPSB0aGlzLmFjY2VwdEZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZWNsaW5lRnJpZW5kPXRoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3c01vdmllPXRoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHM9dGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZmluZE1vdmllQnVkZGllcz10aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYnVkZHlSZXF1ZXN0PXRoaXMuYnVkZHlSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHM9dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmZvY3VzT25GcmllbmQ9dGhpcy5mb2N1c09uRnJpZW5kLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlbW92ZVJlcXVlc3Q9dGhpcy5yZW1vdmVSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0Q3VycmVudEZyaWVuZHMoKSB7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3Rlc3RpbmdnZycpO1xyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kcycse3Rlc3Q6J2luZm8nfSwgKGEsIGIpID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3doYXQgeW91IGdldCBiYWNrIGZyb20gc2VydmVyIGZvciBnZXQgZnJpZW5kcycsYSxiKTtcclxuICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPGEubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoYVtpXVsxXT09PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICBhW2ldWzFdID0gXCJObyBjb21wYXJpc29uIHRvIGJlIG1hZGVcIjtcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICBjb25zdCBmaW5hbD0gYS5zb3J0KChhLGIpPT57cmV0dXJuIGJbMV0tYVsxXX0pO1xyXG4gICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgd2hhdCBHQ0YgaXMgc2V0dGluZyBhcyBhbGwgZnJpZW5kcycsIGZpbmFsKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbXlGcmllbmRzOmZpbmFsXHJcbiAgICAgIH0pXHJcbiAgICAgICBjb25zb2xlLmxvZygndGhlcyBhcmUgbXkgZnJpZW5kcyEhISEhISEhISEhISEhISEhJyx0aGlzLnN0YXRlLm15RnJpZW5kcyk7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcblxyXG4gIGFjY2VwdEZyaWVuZChwZXJzb25Ub0FjY2VwdCwgbW92aWUpIHtcclxuICBcclxuICAgIGNvbnNvbGUubG9nKCdjYWxsaW5nIGFGJyk7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvYWNjZXB0Jyx7cGVyc29uVG9BY2NlcHQ6cGVyc29uVG9BY2NlcHQsIG1vdmllOiBtb3ZpZX0sKHJlc3AsZXJyKT0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ2l0IGNhbWUgYmFjayEnLCB0aGF0KTtcclxuICAgICAgbGV0IHBlbmRpbmc9dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHM7XHJcblxyXG5cclxuICAgICAgbGV0IHJlcXMgPSBwZW5kaW5nLm1hcCgoYSk9PihhLnJlcXVlc3RvcikpO1xyXG5cclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCdiZWZvcmUnLCBwZW5kaW5nLCByZXFzLCBwZXJzb25Ub0FjY2VwdCk7XHJcbiAgICAgIHBlbmRpbmcuc3BsaWNlKHJlcXMuaW5kZXhPZihwZXJzb25Ub0FjY2VwdCksMSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3BlbmRpbmdGcmllbmRSZXF1ZXN0czpwZW5kaW5nfSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdhZnRlcicsIHRoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzKTtcclxuXHJcbiAgICAgIC8vdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVmcmVzaGVkIGluYm94LCBzaG91bGQgZGVsZXRlIGZyaWVuZCByZXF1ZXN0IG9uIHRoZSBzcG90IGluc3RlYWQgb2YgbW92aW5nJylcclxuICB9XHJcblxyXG4gIGRlY2xpbmVGcmllbmQocGVyc29uVG9EZWNsaW5lLCBtb3ZpZSkge1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2RlY2xpbmUnLHtwZXJzb25Ub0RlY2xpbmU6cGVyc29uVG9EZWNsaW5lLCBtb3ZpZTogbW92aWV9LChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3RhdGUgYWZ0ZXIgZGVjbGluaW5nIGZyaWVuZCwgJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgbGV0IHBlbmRpbmc9dGhpcy5zdGF0ZS5yZXF1ZXN0UmVzcG9uc2VzO1xyXG4gICAgICAgIGxldCByZXFzID0gcGVuZGluZy5tYXAoKGEpPT4oYS5yZXF1ZXN0b3IpKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnYmVmb3JlJywgcGVuZGluZywgcmVxcywgcGVyc29uVG9EZWNsaW5lKTtcclxuICAgICAgICBwZW5kaW5nLnNwbGljZShyZXFzLmluZGV4T2YocGVyc29uVG9EZWNsaW5lKSwxKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtyZXF1ZXN0UmVzcG9uc2VzOnBlbmRpbmd9KTtcclxuICAgICAgICBjb25zb2xlLmxvZygnYWZ0ZXInLCB0aGlzLnN0YXRlLnJlcXVlc3RSZXNwb25zZXMpO1xyXG5cclxuICAgICAgLy90aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTsvL1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmaW5kTW92aWVCdWRkaWVzKCkge1xyXG4gICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZmluZE1vdmllQnVkZGllcycse2R1bW15OidpbmZvJ30sKHJlc3AsIGVycik9PiB7XHJcbiAgICAgIGNvbnN0IHNvcnRlZD1yZXNwLnNvcnQoKGEsYik9PihiWzFdLWFbMV0pKTtcclxuICAgICAgY29uc3QgbXlGcmllbmRzPXRoYXQubXlGcmllbmRzO1xyXG4gICAgICAgY29uc3QgdW5pcXVlRnJpZW5kcz1bXTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTxzb3J0ZWQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICBsZXQgdW5pcXVlPXRydWU7XHJcbiAgICAgICAgICBmb3IgKGxldCB4PTA7eDxteUZyaWVuZHMubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgIGlmIChzb3J0ZWRbaV1bMF09PT1teUZyaWVuZHNbeF1bMF0pe1xyXG4gICAgICAgICAgICAgIHVuaXF1ZT1mYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVuaXF1ZSl7XHJcbiAgICAgICAgICAgIHVuaXF1ZUZyaWVuZHMucHVzaChzb3J0ZWRbaV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJGTk1CXCIsXHJcbiAgICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOnVuaXF1ZUZyaWVuZHNcclxuICAgICAgfSlcclxuXHJcbiAgIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuXHJcbiAgY2hhbmdlVmlldygpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OlwiU2lnblVwXCIgXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgc2V0Q3VycmVudFVzZXIodXNlcm5hbWUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsaW5nIHNldEN1cnJlbnRVc2VyJyk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgY3VycmVudFVzZXI6IHVzZXJuYW1lXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZW50ZXJOZXdVc2VyKG5hbWUscGFzc3dvcmQpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKG5hbWUscGFzc3dvcmQpO1xyXG4gICAgJC5wb3N0KFVybCArICcvc2lnbnVwJyx7bmFtZTpuYW1lLHBhc3N3b3JkOnBhc3N3b3JkfSkudGhlbigoKT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTsgXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3VzZXJuYW1lOiBuYW1lLCB2aWV3OiBcIkhvbWVcIn0pXHJcbiAgICB9KS5jYXRjaCgoKT0+IHtjb25zb2xlLmxvZygnZXJyb3InKX0pXHJcbiAgfVxyXG5cclxuICBnZXRGcmllbmRNb3ZpZVJhdGluZ3MoKSB7XHJcbiAgICBsZXQgbW92aWVOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb3ZpZVRvVmlld1wiKS52YWx1ZVxyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kUmF0aW5ncycsIHsgbmFtZTogbW92aWVOYW1lIH0pLnRoZW4ocmVzcG9uc2U9PiB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OlwiSG9tZVwiLFxyXG4gICAgICBmcmllbmRzUmF0aW5nczpyZXNwb25zZVxyXG4gICAgfSlcclxuICAgIC8vIGNvbnNvbGUubG9nKCdvdXIgcmVzcG9uc2UnLHRoaXMuc3RhdGUuZnJpZW5kc1JhdGluZ3MpXHJcbiAgICB9KS5jYXRjaChlcnI9PiB7Y29uc29sZS5sb2coZXJyKX0pO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgbG9nb3V0KCkge1xyXG4gICAgJC5wb3N0KFVybCArICcvbG9nb3V0JykudGhlbihyZXNwb25zZT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHN0YXJ0aW5nU3RhdGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kV2F0Y2hSZXF1ZXN0KGZyaWVuZCkge1xyXG4gICAgY29uc3QgbW92aWU9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZTtcclxuICAgIGNvbnN0IHRvU2VuZD17cmVxdWVzdGVlOmZyaWVuZCwgbW92aWU6bW92aWV9O1xyXG4gICAgaWYgKG1vdmllLmxlbmd0aCkge1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kV2F0Y2hSZXF1ZXN0JywgdG9TZW5kLCAocmVzcCwgZXJyKT0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwLCBlcnIpO1xyXG4gICAgICB9KTtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlPScnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3lvdSBuZWVkIHRvIGVudGVyIGEgbW92aWUgdG8gc2VuZCBhIHdhdGNoIHJlcXVlc3QhISEhJylcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL21vdmllIHJlbmRlclxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vY2FsbCBzZWFyY2htb3ZpZSBmdW5jdGlvblxyXG4gIC8vd2hpY2ggZ2V0cyBwYXNzZWQgZG93biB0byB0aGUgTW92aWUgU2VhcmNoIFxyXG4gIGdldE1vdmllKHF1ZXJ5KSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBxdWVyeTogcXVlcnlcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRoaXMucHJvcHMuc2VhcmNoTW92aWUob3B0aW9ucywgbW92aWUgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhtb3ZpZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJNb3ZpZVNlYXJjaFZpZXdcIixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG4gIC8vc2hvdyB0aGUgbW92aWUgc2VhcmNoZWQgaW4gZnJpZW5kIG1vdmllIGxpc3RcclxuICAvL29udG8gdGhlIHN0YXRldmlldyBvZiBtb3ZpZXNlYXJjaHZpZXdcclxuICBzaG93TW92aWUobW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtb3ZpZTogbW92aWVcclxuICAgIH0pO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL05hdiBjaGFuZ2VcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICBjaGFuZ2VWaWV3cyh0YXJnZXRTdGF0ZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0ZyaWVuZHMnKXtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3lvdSBzd2l0Y2hlZCB0byBmcmllbmRzISEnKVxyXG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcclxuICAgICAgLy90aGlzLnNlbmRSZXF1ZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0hvbWUnKXtcclxuICAgICAgLy8gdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAgaWYgKHRhcmdldFN0YXRlPT09XCJJbmJveFwiKXtcclxuICAgICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpXHJcbiAgICAgfVxyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGNoYW5nZVZpZXdzTW92aWUodGFyZ2V0U3RhdGUsIG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VWaWV3c0ZyaWVuZHModGFyZ2V0U3RhdGUsIGZyaWVuZCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxyXG4gICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgYnVkZHlSZXF1ZXN0KHBlcnNvbiwgaWR4KSB7XHJcbiAgICBjb25zb2xlLmxvZyhwZXJzb24sIGlkeCk7XHJcbiAgICB0aGlzLnNlbmRSZXF1ZXN0KHBlcnNvbiwgaWR4KTtcclxuICB9XHJcblxyXG5cclxuICBzZW5kUmVxdWVzdChhLCBpZHgpIHtcclxuICAgIGNvbnNvbGUubG9nKHR5cGVvZiBhKTtcclxuICAgIGlmICh0eXBlb2YgYT09PVwib2JqZWN0XCIpe1xyXG4gICAgICB2YXIgcGVyc29uPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWU7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdwYXJ0IDEnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdwYXJ0IDInKTtcclxuICAgICAgdmFyIHBlcnNvbiA9IGEgfHwgJ3Rlc3QnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGN1cnJGcmllbmRzPXRoaXMuc3RhdGUubXlGcmllbmRzO1xyXG4gICAgY29uc3QgZnJpZW5kczE9Y3VyckZyaWVuZHMubWFwKGZyaWVuZEluZm89PihmcmllbmRJbmZvWzBdKSk7XHJcbiAgICB0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlci5mb3JFYWNoKHJlcT0+e1xyXG4gICAgICBmcmllbmRzMS5wdXNoKHJlcSk7XHJcbiAgICB9KVxyXG4gICAgXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGFsc28gYmUgbXkgZnJpZW5kcycscGVyc29uLCBjdXJyRnJpZW5kcyxmcmllbmRzMSxmcmllbmRzMilcclxuICAgIGNvbnNvbGUubG9nKCd0aGVzZSBzaG91bGQgYmUgbXkgY3VycmVudCBmcmllbmRzIGFuZCBpbk1lbSByZXF1ZXN0cyBhbmQgSSBzaG91bGQgbm90IGJlIGFibGUgb3Qgc2VuZCB0byB0aGVtJywgZnJpZW5kczEpO1xyXG4gICAgaWYgKGZyaWVuZHMxLmluZGV4T2YocGVyc29uKSE9PSAtMSAmJiBmcmllbmRzMS5sZW5ndGghPT0wKXtcclxuICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApXHJcbiAgICAgIGNvbnNvbGUubG9nKCdjYXNlIGNhdWdodCAyNTQnKTtcclxuICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICBcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXMgcGVyc29uIGlzIGFscmVhZHkgaW4gdGhlcmUhIScpXHJcbiAgICB9IGVsc2UgaWYgKCFwZXJzb24ubGVuZ3RoKSB7XHJcbiAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMClcclxuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmQsI2VudGVyUmVhbEZyaWVuZDJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZCwjZW50ZXJSZWFsRnJpZW5kMlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuLy8gY29uc29sZS5sb2coJ3BlcnNvbiBpcyBkZWZpbmVkPycscGVyc29uKTtcclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFJlcXVlc3QnLHtuYW1lOnBlcnNvbn0sIChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAgXHJcbiAgICAgICBjb25zb2xlLmxvZygnc2hvdWxkIGluY2x1ZGUgZXZlcnlib2R5IHRvIHdob20gYSByZXEgaGFzIGV2ZXIgYmVlbiBzZW50LCBzaG9ydCBvZiBtb3N0IHJlY2VudCcsIHJlc3ApO1xyXG4gICAgICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApO1xyXG4gICAgICAgICAgaWYgKHJlc3AuaW5kZXhPZihwZXJzb24pPi0xKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2Nhc2UgY2F1Z2h0IDI3MicpXHJcbiAgICAgICAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKFwiI3JlcVNlbnQsI3JlcVNlbnQyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgICAgICAgJChcIiNyZXFTZW50LCNyZXFTZW50MlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6cmVzcC5jb25jYXQoW3BlcnNvbl0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKSE9PW51bGwpe1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWUgPSAnJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpIHtcclxuICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBmcmllbmQgcmVxcycpXHJcbiAgICAkLnBvc3QoVXJsICsgJy9saXN0UmVxdWVzdHMnLCAocmVzcG9uc2UsIGVycm9yKT0+IHtcclxuICAgICAgY29uc3QgcEZSPVtdO1xyXG4gICAgICBjb25zdCByUj1bXTtcclxuICAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSB0byBscGZyJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaT0wO2k8cmVzcG9uc2VbMF0ubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdG9yPXJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXTtcclxuICAgICAgICBjb25zdCByZXNwb25zZVRVPSByZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXTtcclxuICAgICAgICBpZiAocmVxdWVzdG9yIT09cmVzcG9uc2VbMV0gJiYgcmVzcG9uc2VUVT09PW51bGwgKXtcclxuICAgICAgICAgIHBGUi5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcXVlc3Rvcj09PXJlc3BvbnNlWzFdICYmcmVzcG9uc2VUVSE9PW51bGwgJiYgcmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RlZSddIT09J3Rlc3QnKXtcclxuICAgICAgICAgIHJSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvL1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdGFsaXR5IG9mIGluYm94XCIscEZSLCByUik7XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBwZW5kaW5nRnJpZW5kUmVxdWVzdHM6cEZSLFxyXG4gICAgICAgIHJlcXVlc3RSZXNwb25zZXM6clJcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGZvY3VzT25GcmllbmQoZnJpZW5kKSB7XHJcbiAgICAvL1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OidzaW5nbGVGcmllbmQnLFxyXG4gICAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJC5nZXQoVXJsICsgJy9nZXRGcmllbmRVc2VyUmF0aW5ncycsIHtmcmllbmROYW1lOiBmcmllbmR9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBpbmRpdmlkdWFsRnJpZW5kc01vdmllczogcmVzcG9uc2VcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIHJlbW92ZVJlcXVlc3QocGVyc29uLCBzZWxmLCBtb3ZpZSkge1xyXG4gICAgY29uc29sZS5sb2coJ3RyeWluZyB0byByZW0gcmVxJyk7XHJcbiAgICB2YXIgdGhhdD0gdGhpcztcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogVXJsICsgJy9yZW1vdmVSZXF1ZXN0JyxcclxuICAgICAgdHlwZTogJ0RFTEVURScsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICByZXF1ZXN0b3I6IHNlbGYsXHJcbiAgICAgICAgcmVxdWVzdGVlOiBwZXJzb24sXHJcbiAgICAgICAgbW92aWU6IG1vdmllXHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdSRVFVRVNUIFJFTU9WRUQhIE1vdmllIGlzOiAnLCBtb3ZpZSk7XHJcbiAgICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgbmF2PTxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzfVxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSBcclxuICAgICAgICAgICAgLz5cclxuXHJcbiAgICBpZiAodGhpcy5zdGF0ZS52aWV3PT09J0xvZ2luJykge1xyXG4gICAgICByZXR1cm4gKDxMb2dJbiBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3c30gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXJ9Lz4pO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT1cIlNpZ25VcFwiKSB7XHJcbiAgICAgIHJldHVybiAoPFNpZ25VcCBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3c30gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXJ9IC8+KTtcclxuICAgIH0gXHJcbiAgICAvL3RoaXMgdmlldyBpcyBhZGRlZCBmb3IgbW92aWVzZWFyY2ggcmVuZGVyaW5nXHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTW92aWVTZWFyY2hWaWV3XCIpIHtcclxuICAgICAgcmV0dXJuICggXHJcbiAgICAgICAgPGRpdj4gXHJcbiAgICAgICAgICA8ZGl2PntuYXZ9PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPE1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBoYW5kbGVTZWFyY2hNb3ZpZT17dGhpcy5nZXRNb3ZpZX1cclxuICAgICAgICAgICAgbW92aWU9e3RoaXMuc3RhdGUubW92aWV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkluYm94XCIgKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllc31cclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9XHJcbiAgICAgICAgICAgICAgSG9tZT17dHJ1ZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPEluYm94IFxyXG4gICAgICAgICAgICAgIHJlcXVlc3RzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0c31cclxuICAgICAgICAgICAgICByZXNwb25zZXNBbnN3ZXJlZD17dGhpcy5zdGF0ZS5yZXF1ZXN0UmVzcG9uc2VzfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9ICBcclxuICAgICAgICAgICAgICBhY2NlcHQ9IHt0aGlzLmFjY2VwdEZyaWVuZH0gXHJcbiAgICAgICAgICAgICAgZGVjbGluZT17dGhpcy5kZWNsaW5lRnJpZW5kfSBcclxuICAgICAgICAgICAgICBsaXN0UmVxdWVzdHM9e3RoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0c30gXHJcbiAgICAgICAgICAgICAgcHBsV2hvV2FudFRvQmVGcmllbmRzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cy5tYXAoXHJcbiAgICAgICAgICAgICAgICBhPT4oIFthLnJlcXVlc3RvcixhLnJlcXVlc3RUeXAsYS5tb3ZpZT09PW51bGw/XCJcIjogYS5tb3ZpZSxcIk1lc3NhZ2U6XCIrIGEubWVzc2FnZT09PSdudWxsJz9cIm5vbmVcIjphLm1lc3NhZ2VdKSl9IFxyXG4gICAgICAgICAgICAgIHJlbW92ZT17dGhpcy5yZW1vdmVSZXF1ZXN0fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRnJpZW5kc1wiICkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8RnJpZW5kcyBcclxuICAgICAgICAgICAgc2VuZFdhdGNoUmVxdWVzdD17dGhpcy5zZW5kV2F0Y2hSZXF1ZXN0fSBcclxuICAgICAgICAgICAgZm9mPSB7dGhpcy5mb2N1c09uRnJpZW5kfSBcclxuICAgICAgICAgICAgZ2V0RnJpZW5kcz17dGhpcy5nZXRDdXJyZW50RnJpZW5kc30gXHJcbiAgICAgICAgICAgIG15RnJpZW5kcz17dGhpcy5zdGF0ZS5teUZyaWVuZHN9IFxyXG4gICAgICAgICAgICBsaXN0UG90ZW50aWFscz17dGhpcy5saXN0UG90ZW50aWFsc30gXHJcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9ICBcclxuICAgICAgICAgICAgc2VuZFJlcXVlc3Q9e3RoaXMuc2VuZFJlcXVlc3R9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkhvbWVcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8SG9tZSBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiU2luZ2xlTW92aWVcIikge1xyXG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBvbkNsaWNrPXsoKT0+Y29uc29sZS5sb2codGhhdC5zdGF0ZSl9PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBjb21wYXRpYmlsaXR5PXt0aGlzLnN0YXRlLm15RnJpZW5kc31cclxuICAgICAgICAgICAgY3VycmVudE1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NGcmllbmRzfVxyXG4gICAgICAgICAgICBmb2Y9e3RoaXMuZm9jdXNPbkZyaWVuZH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PSdzaW5nbGVGcmllbmQnKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxTaW5nbGVGcmllbmQgXHJcbiAgICAgICAgICAgIG1vdmllc09mRnJpZW5kPXt0aGlzLnN0YXRlLmluZGl2aWR1YWxGcmllbmRzTW92aWVzfSBcclxuICAgICAgICAgICAgZnJpZW5kTmFtZT17dGhpcy5zdGF0ZS5mcmllbmRUb0ZvY3VzT259IFxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGTk1CXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEZpbmRNb3ZpZUJ1ZGR5IFxyXG4gICAgICAgICAgICBidWRkeWZ1bmM9e3RoaXMuYnVkZHlSZXF1ZXN0fSBcclxuICAgICAgICAgICAgYnVkZGllcz17dGhpcy5zdGF0ZS5wb3RlbnRpYWxNb3ZpZUJ1ZGRpZXN9IFxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk15UmF0aW5nc1wiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxNeVJhdGluZ3MgXHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5BcHAgPSBBcHA7XHJcblxyXG52YXIgVXJsID0gJ2h0dHBzOi8vcmVlbGZyaWVuZHouaGVyb2t1YXBwLmNvbSc7XHJcbi8vIHZhciBVcmwgPSAnaHR0cDovLzEyNy4wLjAuMTozMDAwJztcclxud2luZG93LlVybCA9IFVybFxyXG4iXX0=