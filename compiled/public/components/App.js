'use strict';

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (c) { return typeof c; } : function (c) { return c && typeof Symbol === "function" && c.constructor === Symbol && c !== Symbol.prototype ? "symbol" : typeof c; };

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
        var k = _this4.state.pendingFriendRequests,
            l = k.map(function (a) {
          return a.requestor;
        });

        k.splice(l.indexOf(e), 1);


        //that.listPendingFriendRequests();//
        _this4.setState({ pendingFriendRequests: k });
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

exports.default = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qc3giXSwibmFtZXMiOlsiQXBwIiwicHJvcHMiLCJzdGF0ZSIsInN0YXJ0aW5nU3RhdGUiLCJzZW5kV2F0Y2hSZXF1ZXN0IiwiYmluZCIsImdldEZyaWVuZHMiLCJnZXRDdXJyZW50RnJpZW5kcyIsIm15RnJpZW5kcyIsImxvZ291dCIsInNlbmRSZXF1ZXN0IiwiY2hhbmdlVmlld3MiLCJzZXRDdXJyZW50VXNlciIsImdldE1vdmllIiwiYWNjZXB0RnJpZW5kIiwiZGVjbGluZUZyaWVuZCIsImNoYW5nZVZpZXdzTW92aWUiLCJjaGFuZ2VWaWV3c0ZyaWVuZHMiLCJmaW5kTW92aWVCdWRkaWVzIiwiYnVkZHlSZXF1ZXN0IiwibGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cyIsImZvY3VzT25GcmllbmQiLCJyZW1vdmVSZXF1ZXN0IiwiJCIsInBvc3QiLCJVcmwiLCJ0ZXN0IiwiYSIsImIiLCJpIiwibGVuZ3RoIiwiZmluYWwiLCJzb3J0Iiwic2V0U3RhdGUiLCJwZXJzb25Ub0FjY2VwdCIsIm1vdmllIiwidGhhdCIsInJlc3AiLCJlcnIiLCJwZW5kaW5nIiwicGVuZGluZ0ZyaWVuZFJlcXVlc3RzIiwicmVxcyIsIm1hcCIsInJlcXVlc3RvciIsInNwbGljZSIsImluZGV4T2YiLCJwZXJzb25Ub0RlY2xpbmUiLCJkdW1teSIsInNvcnRlZCIsInVuaXF1ZUZyaWVuZHMiLCJ1bmlxdWUiLCJ4IiwicHVzaCIsInZpZXciLCJwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXMiLCJ1c2VybmFtZSIsImN1cnJlbnRVc2VyIiwibmFtZSIsInBhc3N3b3JkIiwidGhlbiIsImNhdGNoIiwibW92aWVOYW1lIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInZhbHVlIiwiZnJpZW5kc1JhdGluZ3MiLCJyZXNwb25zZSIsImZyaWVuZCIsInRvU2VuZCIsInJlcXVlc3RlZSIsInF1ZXJ5Iiwib3B0aW9ucyIsInNlYXJjaE1vdmllIiwidGFyZ2V0U3RhdGUiLCJmcmllbmRUb0ZvY3VzT24iLCJwZXJzb24iLCJpZHgiLCJjdXJyRnJpZW5kcyIsImZyaWVuZHMxIiwiZnJpZW5kSW5mbyIsInJlcXVlc3RzT2ZDdXJyZW50VXNlciIsImZvckVhY2giLCJyZXEiLCJzY3JvbGxUb3AiLCJmYWRlSW4iLCJmYWRlT3V0IiwiY29uY2F0IiwiZXJyb3IiLCJwRlIiLCJyUiIsInJlc3BvbnNlVFUiLCJyZXF1ZXN0UmVzcG9uc2VzIiwiZ2V0IiwiZnJpZW5kTmFtZSIsImluZGl2aWR1YWxGcmllbmRzTW92aWVzIiwic2VsZiIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YSIsInN1Y2Nlc3MiLCJuYXYiLCJyZXF1ZXN0VHlwIiwibWVzc2FnZSIsImxpc3RQb3RlbnRpYWxzIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFDTUEsRzs7O0FBQ0osYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUVqQixNQUFLQyxLQUFMLEdBQWFDLGFBQWI7QUFDQSxNQUFLQyxnQkFBTCxHQUFzQixFQUFLQSxnQkFBTCxDQUFzQkMsSUFBdEIsR0FBdEI7QUFDQSxNQUFLQyxVQUFMLEdBQWdCLEVBQUtDLGlCQUFMLENBQXVCRixJQUF2QixHQUFoQjtBQUNBLE1BQUtHLFNBQUwsR0FBZSxFQUFLTixLQUFMLENBQVdNLFNBQTFCO0FBQ0EsTUFBS0MsTUFBTCxHQUFZLEVBQUtBLE1BQUwsQ0FBWUosSUFBWixHQUFaO0FBQ0EsTUFBS0ssV0FBTCxHQUFpQixFQUFLQSxXQUFMLENBQWlCTCxJQUFqQixHQUFqQjtBQUNBLE1BQUtNLFdBQUwsR0FBaUIsRUFBS0EsV0FBTCxDQUFpQk4sSUFBakIsR0FBakI7QUFDQSxNQUFLTyxjQUFMLEdBQW9CLEVBQUtBLGNBQUwsQ0FBb0JQLElBQXBCLEdBQXBCO0FBQ0EsTUFBS1EsUUFBTCxHQUFjLEVBQUtBLFFBQUwsQ0FBY1IsSUFBZCxHQUFkO0FB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QUl5QixNQUFNLG1DQUFWO0FBQ0E7QUFDQWtGLE9BQU9sRixHQUFQLEdBQWFBLEdBQWI7O2tCQUVlekIsRyIsImZpbGUiOiJBcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHN0YXJ0aW5nU3RhdGU7XHJcbiAgICB0aGlzLnNlbmRXYXRjaFJlcXVlc3Q9dGhpcy5zZW5kV2F0Y2hSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldEZyaWVuZHM9dGhpcy5nZXRDdXJyZW50RnJpZW5kcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5teUZyaWVuZHM9dGhpcy5zdGF0ZS5teUZyaWVuZHM7XHJcbiAgICB0aGlzLmxvZ291dD10aGlzLmxvZ291dC5iaW5kKHRoaXMpICBcclxuICAgIHRoaXMuc2VuZFJlcXVlc3Q9dGhpcy5zZW5kUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3cz10aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnNldEN1cnJlbnRVc2VyPXRoaXMuc2V0Q3VycmVudFVzZXIuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0TW92aWU9dGhpcy5nZXRNb3ZpZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5hY2NlcHRGcmllbmQ9IHRoaXMuYWNjZXB0RnJpZW5kLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmRlY2xpbmVGcmllbmQ9dGhpcy5kZWNsaW5lRnJpZW5kLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzTW92aWU9dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzRnJpZW5kcz10aGlzLmNoYW5nZVZpZXdzRnJpZW5kcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5maW5kTW92aWVCdWRkaWVzPXRoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5idWRkeVJlcXVlc3Q9dGhpcy5idWRkeVJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cz10aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZm9jdXNPbkZyaWVuZD10aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMucmVtb3ZlUmVxdWVzdD10aGlzLnJlbW92ZVJlcXVlc3QuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG5cclxuICBnZXRDdXJyZW50RnJpZW5kcygpIHtcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygndGVzdGluZ2dnJyk7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRzJyx7dGVzdDonaW5mbyd9LCAoYSwgYikgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnd2hhdCB5b3UgZ2V0IGJhY2sgZnJvbSBzZXJ2ZXIgZm9yIGdldCBmcmllbmRzJyxhLGIpO1xyXG4gICAgICAgICAgICAgZm9yIChsZXQgaT0wO2k8YS5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIGlmIChhW2ldWzFdPT09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgIGFbaV1bMV0gPSBcIk5vIGNvbXBhcmlzb24gdG8gYmUgbWFkZVwiO1xyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgIGNvbnN0IGZpbmFsPSBhLnNvcnQoKGEsYik9PntyZXR1cm4gYlsxXS1hWzFdfSk7XHJcbiAgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyB3aGF0IEdDRiBpcyBzZXR0aW5nIGFzIGFsbCBmcmllbmRzJywgZmluYWwpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBteUZyaWVuZHM6ZmluYWxcclxuICAgICAgfSlcclxuICAgICAgIGNvbnNvbGUubG9nKCd0aGVzIGFyZSBteSBmcmllbmRzISEhISEhISEhISEhISEhISEnLHRoaXMuc3RhdGUubXlGcmllbmRzKTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuXHJcbiAgYWNjZXB0RnJpZW5kKHBlcnNvblRvQWNjZXB0LCBtb3ZpZSkge1xyXG4gIFxyXG4gICAgY29uc29sZS5sb2coJ2NhbGxpbmcgYUYnKTtcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9hY2NlcHQnLHtwZXJzb25Ub0FjY2VwdDpwZXJzb25Ub0FjY2VwdCwgbW92aWU6IG1vdmllfSwocmVzcCxlcnIpPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnaXQgY2FtZSBiYWNrIScsIHRoYXQpO1xyXG4gICAgICBsZXQgcGVuZGluZz10aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cztcclxuXHJcblxyXG4gICAgICBsZXQgcmVxcyA9IHBlbmRpbmcubWFwKChhKT0+KGEucmVxdWVzdG9yKSk7XHJcblxyXG5cclxuICAgICAgY29uc29sZS5sb2coJ2JlZm9yZScsIHBlbmRpbmcsIHJlcXMsIHBlcnNvblRvQWNjZXB0KTtcclxuICAgICAgcGVuZGluZy5zcGxpY2UocmVxcy5pbmRleE9mKHBlcnNvblRvQWNjZXB0KSwxKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7cGVuZGluZ0ZyaWVuZFJlcXVlc3RzOnBlbmRpbmd9KTtcclxuICAgICAgY29uc29sZS5sb2coJ2FmdGVyJywgdGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHMpO1xyXG5cclxuICAgICAgLy90aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgIH0pXHJcbiAgICBcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWZyZXNoZWQgaW5ib3gsIHNob3VsZCBkZWxldGUgZnJpZW5kIHJlcXVlc3Qgb24gdGhlIHNwb3QgaW5zdGVhZCBvZiBtb3ZpbmcnKVxyXG4gIH1cclxuXHJcbiAgZGVjbGluZUZyaWVuZChwZXJzb25Ub0RlY2xpbmUsIG1vdmllKSB7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZGVjbGluZScse3BlcnNvblRvRGVjbGluZTpwZXJzb25Ub0RlY2xpbmUsIG1vdmllOiBtb3ZpZX0sKHJlc3AsIGVycik9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzdGF0ZSBhZnRlciBkZWNsaW5pbmcgZnJpZW5kLCAnLCB0aGlzLnN0YXRlKTtcclxuICAgICAgICBsZXQgcGVuZGluZz10aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cztcclxuICAgICAgICBsZXQgcmVxcyA9IHBlbmRpbmcubWFwKChhKT0+KGEucmVxdWVzdG9yKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2JlZm9yZScsIHBlbmRpbmcsIHJlcXMsIHBlcnNvblRvRGVjbGluZSk7XHJcbiAgICAgICAgcGVuZGluZy5zcGxpY2UocmVxcy5pbmRleE9mKHBlcnNvblRvRGVjbGluZSksMSk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cGVuZGluZ0ZyaWVuZFJlcXVlc3RzOnBlbmRpbmd9KTtcclxuICAgICAgICBjb25zb2xlLmxvZygnYWZ0ZXInLCB0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cyk7XHJcblxyXG4gICAgICAvL3RoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpOy8vXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZpbmRNb3ZpZUJ1ZGRpZXMoKSB7XHJcbiAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9maW5kTW92aWVCdWRkaWVzJyx7ZHVtbXk6J2luZm8nfSwocmVzcCwgZXJyKT0+IHtcclxuICAgICAgY29uc3Qgc29ydGVkPXJlc3Auc29ydCgoYSxiKT0+KGJbMV0tYVsxXSkpO1xyXG4gICAgICBjb25zdCBteUZyaWVuZHM9dGhhdC5teUZyaWVuZHM7XHJcbiAgICAgICBjb25zdCB1bmlxdWVGcmllbmRzPVtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHNvcnRlZC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgIGxldCB1bmlxdWU9dHJ1ZTtcclxuICAgICAgICAgIGZvciAobGV0IHg9MDt4PG15RnJpZW5kcy5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgaWYgKHNvcnRlZFtpXVswXT09PW15RnJpZW5kc1t4XVswXSl7XHJcbiAgICAgICAgICAgICAgdW5pcXVlPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodW5pcXVlKXtcclxuICAgICAgICAgICAgdW5pcXVlRnJpZW5kcy5wdXNoKHNvcnRlZFtpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzpcIkZOTUJcIixcclxuICAgICAgICBwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXM6dW5pcXVlRnJpZW5kc1xyXG4gICAgICB9KVxyXG5cclxuICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG5cclxuICBjaGFuZ2VWaWV3KCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6XCJTaWduVXBcIiBcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBzZXRDdXJyZW50VXNlcih1c2VybmFtZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2NhbGxpbmcgc2V0Q3VycmVudFVzZXInKTtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBjdXJyZW50VXNlcjogdXNlcm5hbWVcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBlbnRlck5ld1VzZXIobmFtZSxwYXNzd29yZCkge1xyXG4gICAgLy8gY29uc29sZS5sb2cobmFtZSxwYXNzd29yZCk7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9zaWdudXAnLHtuYW1lOm5hbWUscGFzc3dvcmQ6cGFzc3dvcmR9KS50aGVuKCgpPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcycpOyBcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7dXNlcm5hbWU6IG5hbWUsIHZpZXc6IFwiSG9tZVwifSlcclxuICAgIH0pLmNhdGNoKCgpPT4ge2NvbnNvbGUubG9nKCdlcnJvcicpfSlcclxuICB9XHJcblxyXG4gIGdldEZyaWVuZE1vdmllUmF0aW5ncygpIHtcclxuICAgIGxldCBtb3ZpZU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vdmllVG9WaWV3XCIpLnZhbHVlXHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRSYXRpbmdzJywgeyBuYW1lOiBtb3ZpZU5hbWUgfSkudGhlbihyZXNwb25zZT0+IHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6XCJIb21lXCIsXHJcbiAgICAgIGZyaWVuZHNSYXRpbmdzOnJlc3BvbnNlXHJcbiAgICB9KVxyXG4gICAgLy8gY29uc29sZS5sb2coJ291ciByZXNwb25zZScsdGhpcy5zdGF0ZS5mcmllbmRzUmF0aW5ncylcclxuICAgIH0pLmNhdGNoKGVycj0+IHtjb25zb2xlLmxvZyhlcnIpfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICBsb2dvdXQoKSB7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9sb2dvdXQnKS50aGVuKHJlc3BvbnNlPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoc3RhcnRpbmdTdGF0ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlbmRXYXRjaFJlcXVlc3QoZnJpZW5kKSB7XHJcbiAgICBjb25zdCBtb3ZpZT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlO1xyXG4gICAgY29uc3QgdG9TZW5kPXtyZXF1ZXN0ZWU6ZnJpZW5kLCBtb3ZpZTptb3ZpZX07XHJcbiAgICBpZiAobW92aWUubGVuZ3RoKSB7XHJcbiAgICAgICQucG9zdChVcmwgKyAnL3NlbmRXYXRjaFJlcXVlc3QnLCB0b1NlbmQsIChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3AsIGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU9Jyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygneW91IG5lZWQgdG8gZW50ZXIgYSBtb3ZpZSB0byBzZW5kIGEgd2F0Y2ggcmVxdWVzdCEhISEnKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vLy8vbW92aWUgcmVuZGVyXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy9jYWxsIHNlYXJjaG1vdmllIGZ1bmN0aW9uXHJcbiAgLy93aGljaCBnZXRzIHBhc3NlZCBkb3duIHRvIHRoZSBNb3ZpZSBTZWFyY2ggXHJcbiAgZ2V0TW92aWUocXVlcnkpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIHF1ZXJ5OiBxdWVyeVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGhpcy5wcm9wcy5zZWFyY2hNb3ZpZShvcHRpb25zLCBtb3ZpZSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKG1vdmllKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzpcIk1vdmllU2VhcmNoVmlld1wiLFxyXG4gICAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcbiAgLy9zaG93IHRoZSBtb3ZpZSBzZWFyY2hlZCBpbiBmcmllbmQgbW92aWUgbGlzdFxyXG4gIC8vb250byB0aGUgc3RhdGV2aWV3IG9mIG1vdmllc2VhcmNodmlld1xyXG4gIHNob3dNb3ZpZShtb3ZpZSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vLy8vTmF2IGNoYW5nZVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIGNoYW5nZVZpZXdzKHRhcmdldFN0YXRlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcclxuXHJcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nRnJpZW5kcycpe1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygneW91IHN3aXRjaGVkIHRvIGZyaWVuZHMhIScpXHJcbiAgICAgIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKVxyXG4gICAgICAvL3RoaXMuc2VuZFJlcXVlc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nSG9tZScpe1xyXG4gICAgICAvLyB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcclxuICAgICAgdGhpcy5zZW5kUmVxdWVzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgICBpZiAodGFyZ2V0U3RhdGU9PT1cIkluYm94XCIpe1xyXG4gICAgICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKClcclxuICAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuXHJcbiAgY2hhbmdlVmlld3NNb3ZpZSh0YXJnZXRTdGF0ZSwgbW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZSxcclxuICAgICAgbW92aWU6IG1vdmllXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoYW5nZVZpZXdzRnJpZW5kcyh0YXJnZXRTdGF0ZSwgZnJpZW5kKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICBidWRkeVJlcXVlc3QocGVyc29uLCBpZHgpIHtcclxuICAgIGNvbnNvbGUubG9nKHBlcnNvbiwgaWR4KTtcclxuICAgIHRoaXMuc2VuZFJlcXVlc3QocGVyc29uLCBpZHgpO1xyXG4gIH1cclxuXHJcblxyXG4gIHNlbmRSZXF1ZXN0KGEsIGlkeCkge1xyXG4gICAgY29uc29sZS5sb2codHlwZW9mIGEpO1xyXG4gICAgaWYgKHR5cGVvZiBhPT09XCJvYmplY3RcIil7XHJcbiAgICAgIHZhciBwZXJzb249ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZTtcclxuICAgICAgY29uc29sZS5sb2coJ3BhcnQgMScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ3BhcnQgMicpO1xyXG4gICAgICB2YXIgcGVyc29uID0gYSB8fCAndGVzdCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3VyckZyaWVuZHM9dGhpcy5zdGF0ZS5teUZyaWVuZHM7XHJcbiAgICBjb25zdCBmcmllbmRzMT1jdXJyRnJpZW5kcy5tYXAoZnJpZW5kSW5mbz0+KGZyaWVuZEluZm9bMF0pKTtcclxuICAgIHRoaXMuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyLmZvckVhY2gocmVxPT57XHJcbiAgICAgIGZyaWVuZHMxLnB1c2gocmVxKTtcclxuICAgIH0pXHJcbiAgICBcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYWxzbyBiZSBteSBmcmllbmRzJyxwZXJzb24sIGN1cnJGcmllbmRzLGZyaWVuZHMxLGZyaWVuZHMyKVxyXG4gICAgY29uc29sZS5sb2coJ3RoZXNlIHNob3VsZCBiZSBteSBjdXJyZW50IGZyaWVuZHMgYW5kIGluTWVtIHJlcXVlc3RzIGFuZCBJIHNob3VsZCBub3QgYmUgYWJsZSBvdCBzZW5kIHRvIHRoZW0nLCBmcmllbmRzMSk7XHJcbiAgICBpZiAoZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xICYmIGZyaWVuZHMxLmxlbmd0aCE9PTApe1xyXG4gICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMClcclxuICAgICAgY29uc29sZS5sb2coJ2Nhc2UgY2F1Z2h0IDI1NCcpO1xyXG4gICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgIFxyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhpcyBwZXJzb24gaXMgYWxyZWFkeSBpbiB0aGVyZSEhJylcclxuICAgIH0gZWxzZSBpZiAoIXBlcnNvbi5sZW5ndGgpIHtcclxuICAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKVxyXG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZCwjZW50ZXJSZWFsRnJpZW5kMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kLCNlbnRlclJlYWxGcmllbmQyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcblxyXG4vLyBjb25zb2xlLmxvZygncGVyc29uIGlzIGRlZmluZWQ/JyxwZXJzb24pO1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kUmVxdWVzdCcse25hbWU6cGVyc29ufSwgKHJlc3AsIGVycik9PiB7XHJcbiAgICAgICBcclxuICAgICAgIGNvbnNvbGUubG9nKCdzaG91bGQgaW5jbHVkZSBldmVyeWJvZHkgdG8gd2hvbSBhIHJlcSBoYXMgZXZlciBiZWVuIHNlbnQsIHNob3J0IG9mIG1vc3QgcmVjZW50JywgcmVzcCk7XHJcbiAgICAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMCk7XHJcbiAgICAgICAgICBpZiAocmVzcC5pbmRleE9mKHBlcnNvbik+LTEpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2FzZSBjYXVnaHQgMjcyJylcclxuICAgICAgICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoXCIjcmVxU2VudCwjcmVxU2VudDJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICAgICAkKFwiI3JlcVNlbnQsI3JlcVNlbnQyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIHJlcXVlc3RzT2ZDdXJyZW50VXNlcjpyZXNwLmNvbmNhdChbcGVyc29uXSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpIT09bnVsbCl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZSA9ICcnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCkge1xyXG4gICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBsaXN0IGZyaWVuZCByZXFzJylcclxuICAgICQucG9zdChVcmwgKyAnL2xpc3RSZXF1ZXN0cycsIChyZXNwb25zZSwgZXJyb3IpPT4ge1xyXG4gICAgICBjb25zdCBwRlI9W107XHJcbiAgICAgIGNvbnN0IHJSPVtdO1xyXG4gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIHRvIGxwZnInLCByZXNwb25zZSk7XHJcblxyXG4gICAgICBmb3IgKHZhciBpPTA7aTxyZXNwb25zZVswXS5sZW5ndGg7aSsrKXtcclxuICAgICAgICBjb25zdCByZXF1ZXN0b3I9cmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RvciddO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlVFU9IHJlc3BvbnNlWzBdW2ldWydyZXNwb25zZSddO1xyXG4gICAgICAgIGlmIChyZXF1ZXN0b3IhPT1yZXNwb25zZVsxXSAmJiByZXNwb25zZVRVPT09bnVsbCApe1xyXG4gICAgICAgICAgcEZSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVxdWVzdG9yPT09cmVzcG9uc2VbMV0gJiZyZXNwb25zZVRVIT09bnVsbCAmJiByZXNwb25zZVswXVtpXVsncmVxdWVzdGVlJ10hPT0ndGVzdCcpe1xyXG4gICAgICAgICAgclIucHVzaChyZXNwb25zZVswXVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVG90YWxpdHkgb2YgaW5ib3hcIixwRlIsIHJSKTtcclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czpwRlIsXHJcbiAgICAgICAgcmVxdWVzdFJlc3BvbnNlczpyUlxyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZm9jdXNPbkZyaWVuZChmcmllbmQpIHtcclxuICAgIC8vXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6J3NpbmdsZUZyaWVuZCcsXHJcbiAgICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZFVzZXJSYXRpbmdzJywge2ZyaWVuZE5hbWU6IGZyaWVuZH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOiByZXNwb25zZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgcmVtb3ZlUmVxdWVzdChwZXJzb24sIHNlbGYsIG1vdmllKSB7XHJcbiAgICBjb25zb2xlLmxvZygndHJ5aW5nIHRvIHJlbSByZXEnKTtcclxuICAgIHZhciB0aGF0PSB0aGlzO1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiBVcmwgKyAnL3JlbW92ZVJlcXVlc3QnLFxyXG4gICAgICB0eXBlOiAnREVMRVRFJyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHJlcXVlc3Rvcjogc2VsZixcclxuICAgICAgICByZXF1ZXN0ZWU6IHBlcnNvbixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgY29uc29sZS5sb2coJ1JFUVVFU1QgUkVNT1ZFRCEgTW92aWUgaXM6ICcsIG1vdmllKTtcclxuICAgICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCBuYXY9PE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXN9XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3N9XHJcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9IFxyXG4gICAgICAgICAgICAvPlxyXG5cclxuICAgIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nTG9naW4nKSB7XHJcbiAgICAgIHJldHVybiAoPExvZ0luIGNoYW5nZVZpZXdzPXt0aGlzLmNoYW5nZVZpZXdzfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlcn0vPik7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PVwiU2lnblVwXCIpIHtcclxuICAgICAgcmV0dXJuICg8U2lnblVwIGNoYW5nZVZpZXdzPXt0aGlzLmNoYW5nZVZpZXdzfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlcn0gLz4pO1xyXG4gICAgfSBcclxuICAgIC8vdGhpcyB2aWV3IGlzIGFkZGVkIGZvciBtb3ZpZXNlYXJjaCByZW5kZXJpbmdcclxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNb3ZpZVNlYXJjaFZpZXdcIikge1xyXG4gICAgICByZXR1cm4gKCBcclxuICAgICAgICA8ZGl2PiBcclxuICAgICAgICAgIDxkaXY+e25hdn08L2Rpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8TW92aWVSYXRpbmcgXHJcbiAgICAgICAgICAgIGhhbmRsZVNlYXJjaE1vdmllPXt0aGlzLmdldE1vdmllfVxyXG4gICAgICAgICAgICBtb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiSW5ib3hcIiApIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzfVxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3N9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH1cclxuICAgICAgICAgICAgICBIb21lPXt0cnVlfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8SW5ib3ggXHJcbiAgICAgICAgICAgICAgcmVxdWVzdHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzfVxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlc0Fuc3dlcmVkPXt0aGlzLnN0YXRlLnJlcXVlc3RSZXNwb25zZXN9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH0gIFxyXG4gICAgICAgICAgICAgIGFjY2VwdD0ge3RoaXMuYWNjZXB0RnJpZW5kfSBcclxuICAgICAgICAgICAgICBkZWNsaW5lPXt0aGlzLmRlY2xpbmVGcmllbmR9IFxyXG4gICAgICAgICAgICAgIGxpc3RSZXF1ZXN0cz17dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzfSBcclxuICAgICAgICAgICAgICBwcGxXaG9XYW50VG9CZUZyaWVuZHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzLm1hcChcclxuICAgICAgICAgICAgICAgIGE9PiggW2EucmVxdWVzdG9yLGEucmVxdWVzdFR5cCxhLm1vdmllPT09bnVsbD9cIlwiOiBhLm1vdmllLFwiTWVzc2FnZTpcIisgYS5tZXNzYWdlPT09J251bGwnP1wibm9uZVwiOmEubWVzc2FnZV0pKX0gXHJcbiAgICAgICAgICAgICAgcmVtb3ZlPXt0aGlzLnJlbW92ZVJlcXVlc3R9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGcmllbmRzXCIgKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxGcmllbmRzIFxyXG4gICAgICAgICAgICBzZW5kV2F0Y2hSZXF1ZXN0PXt0aGlzLnNlbmRXYXRjaFJlcXVlc3R9IFxyXG4gICAgICAgICAgICBmb2Y9IHt0aGlzLmZvY3VzT25GcmllbmR9IFxyXG4gICAgICAgICAgICBnZXRGcmllbmRzPXt0aGlzLmdldEN1cnJlbnRGcmllbmRzfSBcclxuICAgICAgICAgICAgbXlGcmllbmRzPXt0aGlzLnN0YXRlLm15RnJpZW5kc30gXHJcbiAgICAgICAgICAgIGxpc3RQb3RlbnRpYWxzPXt0aGlzLmxpc3RQb3RlbnRpYWxzfSBcclxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH0gIFxyXG4gICAgICAgICAgICBzZW5kUmVxdWVzdD17dGhpcy5zZW5kUmVxdWVzdH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiSG9tZVwiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxIb21lIFxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJTaW5nbGVNb3ZpZVwiKSB7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IG9uQ2xpY2s9eygpPT5jb25zb2xlLmxvZyh0aGF0LnN0YXRlKX0+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8U2luZ2xlTW92aWVSYXRpbmcgXHJcbiAgICAgICAgICAgIGNvbXBhdGliaWxpdHk9e3RoaXMuc3RhdGUubXlGcmllbmRzfVxyXG4gICAgICAgICAgICBjdXJyZW50TW92aWU9e3RoaXMuc3RhdGUubW92aWV9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHN9XHJcbiAgICAgICAgICAgIGZvZj17dGhpcy5mb2N1c09uRnJpZW5kfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09J3NpbmdsZUZyaWVuZCcpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPFNpbmdsZUZyaWVuZCBcclxuICAgICAgICAgICAgbW92aWVzT2ZGcmllbmQ9e3RoaXMuc3RhdGUuaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXN9IFxyXG4gICAgICAgICAgICBmcmllbmROYW1lPXt0aGlzLnN0YXRlLmZyaWVuZFRvRm9jdXNPbn0gXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3N9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZOTUJcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8RmluZE1vdmllQnVkZHkgXHJcbiAgICAgICAgICAgIGJ1ZGR5ZnVuYz17dGhpcy5idWRkeVJlcXVlc3R9IFxyXG4gICAgICAgICAgICBidWRkaWVzPXt0aGlzLnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllc30gXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTXlSYXRpbmdzXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPE15UmF0aW5ncyBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LkFwcCA9IEFwcDtcclxuXHJcbnZhciBVcmwgPSAnaHR0cHM6Ly9yZWVsZnJpZW5kei5oZXJva3VhcHAuY29tJztcclxuLy8gdmFyIFVybCA9ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAnO1xyXG53aW5kb3cuVXJsID0gVXJsXHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcHAiXX0=