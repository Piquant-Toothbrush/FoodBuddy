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
            l = k.splice(k.indexOf(e), 1);

        //that.listPendingFriendRequests();
        _this3.setState({ pendingFriendRequests: l });
      });

      // console.log('refreshed inbox, should delete friend request on the spot instead of moving')
    }
  }, {
    key: 'declineFriend',
    value: function declineFriend(e, f) {
      var g = this;
      $.post(Url + '/decline', { personToDecline: e, movie: f }, function (h, j) {
        // console.log('this is the state after declining friend, ', this.state);
        g.listPendingFriendRequests();
      });
    }
  }, {
    key: 'findMovieBuddies',
    value: function findMovieBuddies() {
      var _this4 = this,
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

        _this4.setState({
          view: "FNMB",
          potentialMovieBuddies: k
        });

        _this4.getCurrentFriends();
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
      var _this5 = this;

      // console.log(name,password);
      $.post(Url + '/signup', { name: e, password: f }).then(function () {
        // console.log('success'); 
        _this5.setState({ username: e, view: "Home" });
      }).catch(function () {});
    }
  }, {
    key: 'getFriendMovieRatings',
    value: function getFriendMovieRatings() {
      var _this6 = this,
          e = document.getElementById("movieToView").value;

      $.post(Url + '/getFriendRatings', { name: e }).then(function (f) {
        _this6.setState({
          view: "Home",
          friendsRatings: f
        });
        // console.log('our response',this.state.friendsRatings)
      }).catch(function (f) {});
    }
  }, {
    key: 'logout',
    value: function logout() {
      var _this7 = this;

      $.post(Url + '/logout').then(function (e) {
        // console.log(response);
        _this7.setState(startingState);
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
      var _this8 = this,
          f = {
        query: e
      };

      this.props.searchMovie(f, function (g) {
        // console.log(movie);
        _this8.setState({
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
      var _this9 = this;

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

          _this9.setState({
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
      var _this10 = this;

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


        _this10.setState({
          pendingFriendRequests: g,
          requestResponses: h
        });
      });
    }
  }, {
    key: 'focusOnFriend',
    value: function focusOnFriend(e) {
      var _this11 = this;

      //
      this.setState({
        view: 'singleFriend',
        friendToFocusOn: e
      });

      $.get(Url + '/getFriendUserRatings', { friendName: e }, function (f) {
        _this11.setState({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRpbmdTdGF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJiaW5kIiwiZ2V0RnJpZW5kcyIsImdldEN1cnJlbnRGcmllbmRzIiwibXlGcmllbmRzIiwibG9nb3V0Iiwic2VuZFJlcXVlc3QiLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiZ2V0TW92aWUiLCJhY2NlcHRGcmllbmQiLCJkZWNsaW5lRnJpZW5kIiwiY2hhbmdlVmlld3NNb3ZpZSIsImNoYW5nZVZpZXdzRnJpZW5kcyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJidWRkeVJlcXVlc3QiLCJsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzIiwiZm9jdXNPbkZyaWVuZCIsInJlbW92ZVJlcXVlc3QiLCIkIiwicG9zdCIsIlVybCIsInRlc3QiLCJhIiwiYiIsImkiLCJsZW5ndGgiLCJmaW5hbCIsInNvcnQiLCJzZXRTdGF0ZSIsInBlcnNvblRvQWNjZXB0IiwibW92aWUiLCJ0aGF0IiwicmVzcCIsImVyciIsInBlbmRpbmciLCJwZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJuZXdTZXRPZlJlcXMiLCJzcGxpY2UiLCJpbmRleE9mIiwicGVyc29uVG9EZWNsaW5lIiwiZHVtbXkiLCJzb3J0ZWQiLCJ1bmlxdWVGcmllbmRzIiwidW5pcXVlIiwieCIsInB1c2giLCJ2aWV3IiwicG90ZW50aWFsTW92aWVCdWRkaWVzIiwidXNlcm5hbWUiLCJjdXJyZW50VXNlciIsIm5hbWUiLCJwYXNzd29yZCIsInRoZW4iLCJjYXRjaCIsIm1vdmllTmFtZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ2YWx1ZSIsImZyaWVuZHNSYXRpbmdzIiwicmVzcG9uc2UiLCJmcmllbmQiLCJ0b1NlbmQiLCJyZXF1ZXN0ZWUiLCJxdWVyeSIsIm9wdGlvbnMiLCJzZWFyY2hNb3ZpZSIsInRhcmdldFN0YXRlIiwiZnJpZW5kVG9Gb2N1c09uIiwicGVyc29uIiwiaWR4IiwiY3VyckZyaWVuZHMiLCJmcmllbmRzMSIsIm1hcCIsImZyaWVuZEluZm8iLCJyZXF1ZXN0c09mQ3VycmVudFVzZXIiLCJmb3JFYWNoIiwicmVxIiwic2Nyb2xsVG9wIiwiZmFkZUluIiwiZmFkZU91dCIsImNvbmNhdCIsImVycm9yIiwicEZSIiwiclIiLCJyZXF1ZXN0b3IiLCJyZXNwb25zZVRVIiwicmVxdWVzdFJlc3BvbnNlcyIsImdldCIsImZyaWVuZE5hbWUiLCJpbmRpdmlkdWFsRnJpZW5kc01vdmllcyIsInNlbGYiLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGEiLCJzdWNjZXNzIiwibmF2IiwicmVxdWVzdFR5cCIsIm1lc3NhZ2UiLCJsaXN0UG90ZW50aWFscyIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFDTUEsRzs7O0FBQ0osYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUVqQixNQUFLQyxLQUFMLEdBQWFDLGFBQWI7QUFDQSxNQUFLQyxnQkFBTCxHQUFzQixFQUFLQSxnQkFBTCxDQUFzQkMsSUFBdEIsR0FBdEI7QUFDQSxNQUFLQyxVQUFMLEdBQWdCLEVBQUtDLGlCQUFMLENBQXVCRixJQUF2QixHQUFoQjtBQUNBLE1BQUtHLFNBQUwsR0FBZSxFQUFLTixLQUFMLENBQVdNLFNBQTFCO0FBQ0EsTUFBS0MsTUFBTCxHQUFZLEVBQUtBLE1BQUwsQ0FBWUosSUFBWixHQUFaO0FBQ0EsTUFBS0ssV0FBTCxHQUFpQixFQUFLQSxXQUFMLENBQWlCTCxJQUFqQixHQUFqQjtBQUNBLE1BQUtNLFdBQUwsR0FBaUIsRUFBS0EsV0FBTCxDQUFpQk4sSUFBakIsR0FBakI7QUFDQSxNQUFLTyxjQUFMLEdBQW9CLEVBQUtBLGNBQUwsQ0FBb0JQLElBQXBCLEdBQXBCO0FBQ0EsTUFBS1EsUUFBTCxHQUFjLEVBQUtBLFFBQUwsQ0FBY1IsSUFBZCxHQUFkO0FBQ0EsTUFBS1MsWUFBTCxHQUFtQixFQUFLQSxZQUFMLENBQWtCVCxJQUFsQixHQUFuQjtBQUNBLE1BQUtVLGFBQUwsR0FBbUIsRUFBS0EsYUFBTCxDQUFtQlYsSUFBbkIsR0FBbkI7QUFDQSxNQUFLVyxnQkFBTCxHQUFzQixFQUFLQSxnQkFBTCxDQUFzQlgsSUFBdEIsR0FBdEI7QUFDQSxNQUFLWSxrQkFBTCxHQUF3QixFQUFLQSxrQkFBTCxDQUF3QlosSUFBeEIsR0FBeEI7QUFDQSxNQUFLYSxnQkFBTCxHQUFzQixFQUFLQSxnQkFBTCxDQUFzQmIsSUFBdEIsR0FBdEI7QUFDQSxNQUFLYyxZQUFMLEdBQWtCLEVBQUtBLFlBQUwsQ0FBa0JkLElBQWxCLEdBQWxCO0FBQ0EsTUFBS2UseUJBQUwsR0FBK0IsRUFBS0EseUJBQUwsQ0FBK0JmLElBQS9CLEdBQS9CO0FBQ0EsTUFBS2dCLGFBQUwsR0FBbUIsRUFBS0EsYUFBTCxDQUFtQmhCLElBQW5CLEdBQW5CO0FBQ0EsTUFBS2lCLGFBQUwsR0FBbUIsRUFBS0EsYUFBTCxDQUFtQmpCLElBQW5CLEdBQW5CO0FBbkJpQjtBQW9CbEI7Ozs7d0NBR21CO0FBQUE7O0FBRWxCO0FBQ0FrQixRQUFFQyxJQUFGLENBQU9DLE1BQU0sYUFBYixFQUEyQixFQUFDQyxNQUFLLE1BQU4sRUFBM0IsRUFBMEMsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKLEVBQVU7QUFDbEQ7QUFDTyxhQUFLLElBQUlDLElBQUUsQ0FBWCxFQUFhQSxJQUFFRixFQUFFRyxNQUFqQixFQUF3QkQsR0FBeEIsRUFBNEI7QUFDekIsY0FBSUYsRUFBRUUsQ0FBRixFQUFLLENBQUwsTUFBVSxJQUFkLEVBQW1CO0FBQ2pCRixjQUFFRSxDQUFGLEVBQUssQ0FBTCxJQUFVLDBCQUFWO0FBQ0Q7QUFDRjs7QUFFUixZQUFNRSxJQUFPSixFQUFFSyxJQUFGLENBQU8sVUFBQ0wsQ0FBRCxFQUFHQyxDQUFILEVBQU87QUFBQyxpQkFBT0EsRUFBRSxDQUFGLElBQUtELEVBQUUsQ0FBRixDQUFaO0FBQWlCLFNBQWhDLENBQWI7O0FBRUQsZUFBS00sUUFBTCxDQUFjO0FBQ1p6QixxQkFBVXVCO0FBREUsU0FBZDtBQUlELE9BZEQ7QUFlRDs7O2lDQUdZRyxDLEVBQWdCQyxDLEVBQU87QUFBQTtBQUFBLFVBRzlCQyxJQUFLLElBSHlCOztBQUlsQ2IsUUFBRUMsSUFBRixDQUFPQyxNQUFNLFNBQWIsRUFBdUIsRUFBQ1MsZ0JBQWVBLENBQWhCLEVBQWdDQyxPQUFPQSxDQUF2QyxFQUF2QixFQUFxRSxVQUFDRSxDQUFELEVBQU1DLENBQU4sRUFBYTtBQUVoRixZQUFJQyxJQUFRLE9BQUtyQyxLQUFMLENBQVdzQyxxQkFBdkI7QUFBQSxZQUdNQyxJQUFhRixFQUFRRyxNQUFSLENBQWVILEVBQVFJLE9BQVIsQ0FBZ0JULENBQWhCLENBQWYsRUFBK0MsQ0FBL0MsQ0FIbkI7O0FBT0E7QUFIQSxlQUFLRCxRQUFMLENBQWMsRUFBQ08sdUJBQXNCQyxDQUF2QixFQUFkO0FBSUQsT0FWRDs7QUFZQTtBQUNEOzs7a0NBRWFHLEMsRUFBaUJULEMsRUFBTztBQUNwQyxVQUFJQyxJQUFLLElBQVQ7QUFDQWIsUUFBRUMsSUFBRixDQUFPQyxNQUFNLFVBQWIsRUFBd0IsRUFBQ21CLGlCQUFnQkEsQ0FBakIsRUFBa0NULE9BQU9BLENBQXpDLEVBQXhCLEVBQXdFLFVBQUNFLENBQUQsRUFBT0MsQ0FBUCxFQUFjO0FBQ3BGO0FBQ0FGLFVBQUtoQix5QkFBTDtBQUNELE9BSEQ7QUFJRDs7O3VDQUVrQjtBQUFBO0FBQUEsVUFDZGdCLElBQUssSUFEUzs7QUFFakJiLFFBQUVDLElBQUYsQ0FBT0MsTUFBTSxtQkFBYixFQUFpQyxFQUFDb0IsT0FBTSxNQUFQLEVBQWpDLEVBQWdELFVBQUNSLENBQUQsRUFBT0MsQ0FBUCxFQUFjO0FBQzVELFlBQU1RLElBQU9ULEVBQUtMLElBQUwsQ0FBVSxVQUFDTCxDQUFELEVBQUdDLENBQUg7QUFBQSxpQkFBUUEsRUFBRSxDQUFGLElBQUtELEVBQUUsQ0FBRixDQUFiO0FBQUEsU0FBVixDQUFiO0FBQUEsWUFDTW5CLElBQVU0QixFQUFLNUIsU0FEckI7QUFBQSxZQUVPdUMsSUFBYyxFQUZyQjs7QUFHRSxhQUFLLElBQUlsQixJQUFFLENBQVgsRUFBYUEsSUFBRWlCLEVBQU9oQixNQUF0QixFQUE2QkQsR0FBN0IsRUFBaUM7QUFDL0IsY0FBSW1CLE1BQUo7QUFDQSxlQUFLLElBQUlDLElBQUUsQ0FBWCxFQUFhQSxJQUFFekMsRUFBVXNCLE1BQXpCLEVBQWdDbUIsR0FBaEMsRUFBb0M7QUFDbEMsZ0JBQUlILEVBQU9qQixDQUFQLEVBQVUsQ0FBVixNQUFlckIsRUFBVXlDLENBQVYsRUFBYSxDQUFiLENBQW5CLEVBQW1DO0FBQ2pDRDtBQUNEO0FBQ0Y7QUFDRCxjQUFJQSxDQUFKLEVBQVc7QUFDVEQsY0FBY0csSUFBZCxDQUFtQkosRUFBT2pCLENBQVAsQ0FBbkI7QUFDRDtBQUNGOztBQUVILGVBQUtJLFFBQUwsQ0FBYztBQUNaa0IsZ0JBQUssTUFETztBQUVaQyxpQ0FBc0JMO0FBRlYsU0FBZDs7QUFLSCxlQUFLeEMsaUJBQUw7QUFDRSxPQXRCRDtBQXVCRDs7O2lDQUdZO0FBQ1gsV0FBSzBCLFFBQUwsQ0FBYztBQUNaa0IsY0FBSztBQURPLE9BQWQ7QUFHRDs7O21DQUVjRSxDLEVBQVU7QUFDdkI7QUFDQSxXQUFLcEIsUUFBTCxDQUFjO0FBQ1pxQixxQkFBYUQ7QUFERCxPQUFkO0FBR0Q7OztpQ0FFWUUsQyxFQUFLQyxDLEVBQVU7QUFBQTs7QUFDMUI7QUFDQWpDLFFBQUVDLElBQUYsQ0FBT0MsTUFBTSxTQUFiLEVBQXVCLEVBQUM4QixNQUFLQSxDQUFOLEVBQVdDLFVBQVNBLENBQXBCLEVBQXZCLEVBQXNEQyxJQUF0RCxDQUEyRCxZQUFLO0FBQzlEO0FBQ0EsZUFBS3hCLFFBQUwsQ0FBYyxFQUFDb0IsVUFBVUUsQ0FBWCxFQUFpQkosTUFBTSxNQUF2QixFQUFkO0FBQ0QsT0FIRCxFQUdHTyxLQUhILENBR1MsWUFBSyxDQUFzQixDQUhwQztBQUlEOzs7NENBRXVCO0FBQUE7QUFBQSxVQUNsQkMsSUFBWUMsU0FBU0MsY0FBVCxDQUF3QixhQUF4QixFQUF1Q0MsS0FEakM7O0FBRXRCdkMsUUFBRUMsSUFBRixDQUFPQyxNQUFNLG1CQUFiLEVBQWtDLEVBQUU4QixNQUFNSSxDQUFSLEVBQWxDLEVBQXVERixJQUF2RCxDQUE0RCxhQUFXO0FBQ3JFLGVBQUt4QixRQUFMLENBQWM7QUFDZGtCLGdCQUFLLE1BRFM7QUFFZFksMEJBQWVDO0FBRkQsU0FBZDtBQUlGO0FBQ0MsT0FORCxFQU1HTixLQU5ILENBTVMsYUFBTSxDQUFrQixDQU5qQztBQU9EOzs7NkJBS1E7QUFBQTs7QUFDUG5DLFFBQUVDLElBQUYsQ0FBT0MsTUFBTSxTQUFiLEVBQXdCZ0MsSUFBeEIsQ0FBNkIsYUFBVztBQUN0QztBQUNBLGVBQUt4QixRQUFMLENBQWM5QixhQUFkO0FBQ0QsT0FIRDtBQUlEOzs7cUNBRWdCOEQsQyxFQUFRO0FBQ3ZCLFVBQU05QixJQUFPeUIsU0FBU0MsY0FBVCxDQUF3QixjQUF4QixFQUF3Q0MsS0FBckQ7QUFBQSxVQUNNSSxJQUFPLEVBQUNDLFdBQVVGLENBQVgsRUFBbUI5QixPQUFNQSxDQUF6QixFQURiOztBQUVBLFVBQUlBLEVBQU1MLE1BQVYsRUFBa0I7QUFDaEJQLFVBQUVDLElBQUYsQ0FBT0MsTUFBTSxtQkFBYixFQUFrQ3lDLENBQWxDLEVBQTBDLFVBQUM3QixDQUFELEVBQU9DLENBQVAsRUFBYztBQUN0RDtBQUNELFNBRkQ7QUFHQXNCLGlCQUFTQyxjQUFULENBQXdCLGNBQXhCLEVBQXdDQyxLQUF4QyxHQUE4QyxFQUE5QztBQUNELE9BTEQsTUFLTztBQUNMO0FBQ0Q7QUFDRjs7QUFHRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OzZCQUNTTSxDLEVBQU87QUFBQTtBQUFBLFVBQ1JDLElBQVU7QUFDZEQsZUFBT0E7QUFETyxPQURGOztBQUtkLFdBQUtuRSxLQUFMLENBQVdxRSxXQUFYLENBQXVCRCxDQUF2QixFQUFnQyxhQUFTO0FBQ3ZDO0FBQ0EsZUFBS3BDLFFBQUwsQ0FBYztBQUNaa0IsZ0JBQUssaUJBRE87QUFFWmhCLGlCQUFPQTtBQUZLLFNBQWQ7QUFJRCxPQU5EO0FBT0Q7QUFDRDtBQUNBOzs7OzhCQUNVQSxDLEVBQU87QUFDZixXQUFLRixRQUFMLENBQWM7QUFDWkUsZUFBT0E7QUFESyxPQUFkO0FBR0Q7QUFDRDtBQUNBO0FBQ0E7Ozs7Z0NBQ1lvQyxDLEVBQWE7QUFDdkI7O0FBRUEsVUFBSUEsTUFBYyxTQUFsQixFQUE0QjtBQUMxQjtBQUNBLGFBQUtoRSxpQkFBTDtBQUNBO0FBQ0Q7O0FBRUQsVUFBSWdFLE1BQWMsTUFBbEIsRUFBeUI7QUFDdkI7QUFDQSxhQUFLN0QsV0FBTDtBQUNEOztBQUVBLFVBQUk2RCxNQUFjLE9BQWxCLEVBQTBCO0FBQ3hCLGFBQUtuRCx5QkFBTDtBQUNEOztBQUVGLFdBQUthLFFBQUwsQ0FBYztBQUNaa0IsY0FBTW9CO0FBRE0sT0FBZDtBQUdEOzs7cUNBSWdCQSxDLEVBQWFwQyxDLEVBQU87QUFDbkMsV0FBS0YsUUFBTCxDQUFjO0FBQ1prQixjQUFNb0IsQ0FETTtBQUVacEMsZUFBT0E7QUFGSyxPQUFkO0FBSUQ7Ozt1Q0FFa0JvQyxDLEVBQWFOLEMsRUFBUTtBQUN0QyxXQUFLaEMsUUFBTCxDQUFjO0FBQ1prQixjQUFNb0IsQ0FETTtBQUVaQyx5QkFBaUJQO0FBRkwsT0FBZDtBQUlEOzs7aUNBR1lRLEMsRUFBUUMsQyxFQUFLO0FBRXhCLFdBQUtoRSxXQUFMLENBQWlCK0QsQ0FBakIsRUFBeUJDLENBQXpCO0FBQ0Q7OztnQ0FHVy9DLEMsRUFBRytDLEMsRUFBSztBQUFBOztBQUVsQixVQUFJLFFBQU8vQyxDQUFQLHlDQUFPQSxDQUFQLE9BQVcsUUFBZixFQUF3QjtBQUN0QixZQUFJOEMsSUFBT2IsU0FBU0MsY0FBVCxDQUF3QixrQkFBeEIsRUFBNENDLEtBQXZEO0FBRUQsT0FIRCxNQUdPO0FBRUwsWUFBSVcsSUFBUzlDLEtBQUssTUFBbEI7QUFDRDs7QUFFRCxVQUFNZ0QsSUFBWSxLQUFLekUsS0FBTCxDQUFXTSxTQUE3QjtBQUFBLFVBQ01vRSxJQUFTRCxFQUFZRSxHQUFaLENBQWdCO0FBQUEsZUFBYUMsRUFBVyxDQUFYLENBQWI7QUFBQSxPQUFoQixDQURmOztBQUVBLFdBQUs1RSxLQUFMLENBQVc2RSxxQkFBWCxDQUFpQ0MsT0FBakMsQ0FBeUMsYUFBSztBQUM1Q0osVUFBUzFCLElBQVQsQ0FBYytCLENBQWQ7QUFDRCxPQUZEOztBQUtBOztBQUVBLFVBQUlMLEVBQVNqQyxPQUFULENBQWlCOEIsQ0FBakIsTUFBNEIsQ0FBQyxDQUE3QixJQUFrQ0csRUFBUzlDLE1BQVQsS0FBa0IsQ0FBeEQsRUFBMEQ7QUFDeERQLFVBQUVxQyxRQUFGLEVBQVlzQixTQUFaLENBQXNCLENBQXRCOztBQUVBM0QsVUFBRSwwQkFBRixFQUE4QjRELE1BQTlCLENBQXFDLElBQXJDO0FBQ0E1RCxVQUFFLDBCQUFGLEVBQThCNkQsT0FBOUIsQ0FBc0MsSUFBdEM7O0FBRUE7QUFDRCxPQVBELE1BT08sSUFBSSxDQUFDWCxFQUFPM0MsTUFBWixFQUFvQjtBQUN4QlAsVUFBRXFDLFFBQUYsRUFBWXNCLFNBQVosQ0FBc0IsQ0FBdEI7QUFDRDNELFVBQUUsb0NBQUYsRUFBd0M0RCxNQUF4QyxDQUErQyxJQUEvQztBQUNBNUQsVUFBRSxvQ0FBRixFQUF3QzZELE9BQXhDLENBQWdELElBQWhEO0FBRUQsT0FMTSxNQUtBOztBQUVYO0FBQ003RCxVQUFFQyxJQUFGLENBQU9DLE1BQU0sY0FBYixFQUE0QixFQUFDOEIsTUFBS2tCLENBQU4sRUFBNUIsRUFBMkMsVUFBQ3BDLENBQUQsRUFBT0MsQ0FBUCxFQUFjO0FBR3JEZixZQUFFcUMsUUFBRixFQUFZc0IsU0FBWixDQUFzQixDQUF0QjtBQUNBLGNBQUk3QyxFQUFLTSxPQUFMLENBQWE4QixDQUFiLElBQXFCLENBQUMsQ0FBMUIsRUFBNEI7QUFFMUJsRCxjQUFFLDBCQUFGLEVBQThCNEQsTUFBOUIsQ0FBcUMsSUFBckM7QUFDQTVELGNBQUUsMEJBQUYsRUFBOEI2RCxPQUE5QixDQUFzQyxJQUF0QztBQUNELFdBSkQsTUFJTztBQUNMN0QsY0FBRSxvQkFBRixFQUF3QjRELE1BQXhCLENBQStCLElBQS9CO0FBQ0E1RCxjQUFFLG9CQUFGLEVBQXdCNkQsT0FBeEIsQ0FBZ0MsSUFBaEM7QUFDRDs7QUFFRCxpQkFBS25ELFFBQUwsQ0FBYztBQUNaOEMsbUNBQXNCMUMsRUFBS2dELE1BQUwsQ0FBWSxDQUFDWixDQUFELENBQVo7QUFEVixXQUFkO0FBR0gsU0FoQkQ7O0FBbUJBLFlBQUliLFNBQVNDLGNBQVQsQ0FBd0Isa0JBQXhCLE1BQThDLElBQWxELEVBQXVEO0FBQ3JERCxtQkFBU0MsY0FBVCxDQUF3QixrQkFBeEIsRUFBNENDLEtBQTVDLEdBQW9ELEVBQXBEO0FBQ0Q7QUFDRjtBQUNGOzs7Z0RBRTJCO0FBQUE7O0FBRTFCdkMsUUFBRUMsSUFBRixDQUFPQyxNQUFNLGVBQWIsRUFBOEIsVUFBQ3VDLENBQUQsRUFBV3NCLENBQVgsRUFBb0I7QUFDaEQsWUFBTUMsSUFBSSxFQUFWO0FBQUEsWUFDTUMsSUFBRyxFQURUOzs7QUFJQSxhQUFLLElBQUkzRCxJQUFFLENBQVgsRUFBYUEsSUFBRW1DLEVBQVMsQ0FBVCxFQUFZbEMsTUFBM0IsRUFBa0NELEdBQWxDLEVBQXNDO0FBQ3BDLGNBQU00RCxJQUFVekIsRUFBUyxDQUFULEVBQVluQyxDQUFaLFdBQWhCO0FBQUEsY0FDTTZELElBQVkxQixFQUFTLENBQVQsRUFBWW5DLENBQVosVUFEbEI7O0FBRUEsY0FBSTRELE1BQVl6QixFQUFTLENBQVQsQ0FBWixJQUEyQjBCLE1BQWEsSUFBNUMsRUFBa0Q7QUFDaERILGNBQUlyQyxJQUFKLENBQVNjLEVBQVMsQ0FBVCxFQUFZbkMsQ0FBWixDQUFUO0FBQ0Q7QUFDRCxjQUFJNEQsTUFBWXpCLEVBQVMsQ0FBVCxDQUFaLElBQTBCMEIsTUFBYSxJQUF2QyxJQUErQzFCLEVBQVMsQ0FBVCxFQUFZbkMsQ0FBWixnQkFBOEIsTUFBakYsRUFBd0Y7QUFDdEYyRCxjQUFHdEMsSUFBSCxDQUFRYyxFQUFTLENBQVQsRUFBWW5DLENBQVosQ0FBUjtBQUNEO0FBQ0Y7QUFDRDs7O0FBR0EsZ0JBQUtJLFFBQUwsQ0FBYztBQUNaTyxpQ0FBc0IrQyxDQURWO0FBRVpJLDRCQUFpQkg7QUFGTCxTQUFkO0FBSUQsT0F0QkQ7QUF1QkQ7OztrQ0FFYXZCLEMsRUFBUTtBQUFBOztBQUNwQjtBQUNFLFdBQUtoQyxRQUFMLENBQWM7QUFDWmtCLGNBQUssY0FETztBQUVacUIseUJBQWlCUDtBQUZMLE9BQWQ7O0FBS0ExQyxRQUFFcUUsR0FBRixDQUFNbkUsTUFBTSx1QkFBWixFQUFxQyxFQUFDb0UsWUFBWTVCLENBQWIsRUFBckMsRUFBMkQsYUFBWTtBQUNyRSxnQkFBS2hDLFFBQUwsQ0FBYztBQUNaNkQsbUNBQXlCOUI7QUFEYixTQUFkO0FBR0QsT0FKRDtBQUtEOzs7a0NBRVdTLEMsRUFBUXNCLEMsRUFBTTVELEMsRUFBTztBQUVqQyxVQUFJQyxJQUFNLElBQVY7QUFDQWIsUUFBRXlFLElBQUYsQ0FBTztBQUNMQyxhQUFLeEUsTUFBTSxnQkFETjtBQUVMeUUsY0FBTSxRQUZEO0FBR0xDLGNBQU07QUFDSlYscUJBQVdNLENBRFA7QUFFSjVCLHFCQUFXTSxDQUZQO0FBR0p0QyxpQkFBT0E7QUFISCxTQUhEO0FBUUxpRSxpQkFBUyxpQkFBU3BDLENBQVQsRUFBbUI7QUFFMUI1QixZQUFLaEIseUJBQUw7QUFDRCxTQVhJO0FBWUxrRSxlQUFPLGVBQVNBLENBQVQsRUFBZ0IsQ0FFdEI7QUFkSSxPQUFQO0FBZ0JEOzs7NkJBRVE7QUFDUCxVQUFNZSxJQUFJLG9CQUFDLEdBQUQsSUFBSyxNQUFNLEtBQUtuRyxLQUFMLENBQVdvRCxXQUF0QjtBQUNGLGNBQU0sS0FBS3BDLGdCQURUO0FBRUYsaUJBQVMsS0FBS1AsV0FGWjtBQUdGLGdCQUFRLEtBQUtGO0FBSFgsUUFBVjs7QUFNQSxVQUFJLEtBQUtQLEtBQUwsQ0FBV2lELElBQVgsS0FBa0IsT0FBdEIsRUFBK0I7QUFDN0IsZUFBUSxvQkFBQyxLQUFELElBQU8sYUFBYSxLQUFLeEMsV0FBekIsRUFBc0MsZ0JBQWdCLEtBQUtDLGNBQTNELEdBQVI7QUFDRCxPQUZELE1BRU8sSUFBSSxLQUFLVixLQUFMLENBQVdpRCxJQUFYLEtBQWtCLFFBQXRCLEVBQWdDO0FBQ3JDLGVBQVEsb0JBQUMsTUFBRCxJQUFRLGFBQWEsS0FBS3hDLFdBQTFCLEVBQXVDLGdCQUFnQixLQUFLQyxjQUE1RCxHQUFSO0FBQ0Q7QUFDRDtBQUhPLFdBSUYsSUFBSSxLQUFLVixLQUFMLENBQVdpRCxJQUFYLEtBQW9CLGlCQUF4QixFQUEyQztBQUM5QyxpQkFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBTWtEO0FBQU4sYUFERjtBQUVFO0FBQUE7QUFBQTtBQUNBLGtDQUFDLFdBQUQ7QUFDRSxtQ0FBbUIsS0FBS3hGLFFBRDFCO0FBRUUsdUJBQU8sS0FBS1gsS0FBTCxDQUFXaUM7QUFGcEI7QUFEQTtBQUZGLFdBREY7QUFXRCxTQVpJLE1BWUUsSUFBSSxLQUFLakMsS0FBTCxDQUFXaUQsSUFBWCxLQUFvQixPQUF4QixFQUFrQztBQUN2QyxpQkFDRTtBQUFBO0FBQUE7QUFDSSxnQ0FBQyxHQUFELElBQUssTUFBTSxLQUFLakQsS0FBTCxDQUFXb0QsV0FBdEI7QUFDRSxvQkFBTSxLQUFLcEMsZ0JBRGI7QUFFRSx1QkFBUyxLQUFLUCxXQUZoQjtBQUdFLHNCQUFRLEtBQUtGLE1BSGY7QUFJRTtBQUpGLGNBREo7QUFPSSxnQ0FBQyxLQUFEO0FBQ0Usd0JBQVUsS0FBS1AsS0FBTCxDQUFXc0MscUJBRHZCO0FBRUUsaUNBQW1CLEtBQUt0QyxLQUFMLENBQVd5RixnQkFGaEM7QUFHRSxzQkFBUSxLQUFLbEYsTUFIZjtBQUlFLHNCQUFTLEtBQUtLLFlBSmhCO0FBS0UsdUJBQVMsS0FBS0MsYUFMaEI7QUFNRSw0QkFBYyxLQUFLSyx5QkFOckI7QUFPRSxxQ0FBdUIsS0FBS2xCLEtBQUwsQ0FBV3NDLHFCQUFYLENBQWlDcUMsR0FBakMsQ0FDckI7QUFBQSx1QkFBSyxDQUFDbEQsRUFBRThELFNBQUgsRUFBYTlELEVBQUUyRSxVQUFmLEVBQTBCM0UsRUFBRVEsS0FBRixLQUFVLElBQVYsR0FBZSxFQUFmLEdBQW1CUixFQUFFUSxLQUEvQyxFQUFxRCxhQUFZUixFQUFFNEUsT0FBZCxLQUF3QixNQUF4QixHQUErQixNQUEvQixHQUFzQzVFLEVBQUU0RSxPQUE3RixDQUFMO0FBQUEsZUFEcUIsQ0FQekI7QUFTRSxzQkFBUSxLQUFLakY7QUFUZjtBQVBKLFdBREY7QUFxQkQsU0F0Qk0sTUFzQkEsSUFBSSxLQUFLcEIsS0FBTCxDQUFXaUQsSUFBWCxLQUFvQixTQUF4QixFQUFvQztBQUN6QyxpQkFDRTtBQUFBO0FBQUE7QUFDS2tELGFBREw7QUFFRSxnQ0FBQyxPQUFEO0FBQ0UsZ0NBQWtCLEtBQUtqRyxnQkFEekI7QUFFRSxtQkFBTSxLQUFLaUIsYUFGYjtBQUdFLDBCQUFZLEtBQUtkLGlCQUhuQjtBQUlFLHlCQUFXLEtBQUtMLEtBQUwsQ0FBV00sU0FKeEI7QUFLRSw4QkFBZ0IsS0FBS2dHLGNBTHZCO0FBTUUsc0JBQVEsS0FBSy9GLE1BTmY7QUFPRSwyQkFBYSxLQUFLQztBQVBwQjtBQUZGLFdBREY7QUFjRCxTQWZNLE1BZ0JGLElBQUksS0FBS1IsS0FBTCxDQUFXaUQsSUFBWCxLQUFvQixNQUF4QixFQUFnQztBQUNuQyxpQkFDRTtBQUFBO0FBQUE7QUFDS2tELGFBREw7QUFFRSxnQ0FBQyxJQUFEO0FBQ0Usc0JBQVEsS0FBS3JGO0FBRGY7QUFGRixXQURGO0FBUUQsU0FUSSxNQVNFLElBQUksS0FBS2QsS0FBTCxDQUFXaUQsSUFBWCxLQUFvQixhQUF4QixFQUF1QztBQUM1QyxjQUFJZixJQUFPLElBQVg7QUFDQSxpQkFDRTtBQUFBO0FBQUEsY0FBSyxTQUFTO0FBQUE7QUFBQSxlQUFkO0FBQ0tpRSxhQURMO0FBRUUsZ0NBQUMsaUJBQUQ7QUFDRSw2QkFBZSxLQUFLbkcsS0FBTCxDQUFXTSxTQUQ1QjtBQUVFLDRCQUFjLEtBQUtOLEtBQUwsQ0FBV2lDLEtBRjNCO0FBR0Usc0JBQVEsS0FBS2xCLGtCQUhmO0FBSUUsbUJBQUssS0FBS0k7QUFKWjtBQUZGLFdBREY7QUFXRCxTQWJNLE1BYUEsSUFBSSxLQUFLbkIsS0FBTCxDQUFXaUQsSUFBWCxLQUFrQixjQUF0QixFQUFzQztBQUMzQyxpQkFDRTtBQUFBO0FBQUE7QUFDS2tELGFBREw7QUFFRSxnQ0FBQyxZQUFEO0FBQ0UsOEJBQWdCLEtBQUtuRyxLQUFMLENBQVc0Rix1QkFEN0I7QUFFRSwwQkFBWSxLQUFLNUYsS0FBTCxDQUFXc0UsZUFGekI7QUFHRSx1QkFBUyxLQUFLN0QsV0FIaEI7QUFJRSxzQkFBUSxLQUFLSztBQUpmO0FBRkYsV0FERjtBQVdELFNBWk0sTUFZQSxJQUFJLEtBQUtkLEtBQUwsQ0FBV2lELElBQVgsS0FBb0IsTUFBeEIsRUFBZ0M7QUFDckMsaUJBQ0U7QUFBQTtBQUFBO0FBQ0trRCxhQURMO0FBRUUsZ0NBQUMsY0FBRDtBQUNFLHlCQUFXLEtBQUtsRixZQURsQjtBQUVFLHVCQUFTLEtBQUtqQixLQUFMLENBQVdrRDtBQUZ0QjtBQUZGLFdBREY7QUFTRCxTQVZNLE1BVUEsSUFBSSxLQUFLbEQsS0FBTCxDQUFXaUQsSUFBWCxLQUFvQixXQUF4QixFQUFxQztBQUMxQyxpQkFDRTtBQUFBO0FBQUE7QUFDS2tELGFBREw7QUFFRSxnQ0FBQyxTQUFEO0FBQ0Usc0JBQVEsS0FBS3JGO0FBRGY7QUFGRixXQURGO0FBUUQ7QUFDRjs7OztFQXBkZXlGLE1BQU1DLFM7O0FBdWR4QkMsT0FBTzNHLEdBQVAsR0FBYUEsR0FBYjs7QUFFQSxJQUFJeUIsTUFBTSxtQ0FBVjtBQUNBO0FBQ0FrRixPQUFPbEYsR0FBUCxHQUFhQSxHQUFiIiwiZmlsZSI6IkFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5jbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB0aGlzLnN0YXRlID0gc3RhcnRpbmdTdGF0ZTtcclxuICAgIHRoaXMuc2VuZFdhdGNoUmVxdWVzdD10aGlzLnNlbmRXYXRjaFJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZ2V0RnJpZW5kcz10aGlzLmdldEN1cnJlbnRGcmllbmRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLm15RnJpZW5kcz10aGlzLnN0YXRlLm15RnJpZW5kcztcclxuICAgIHRoaXMubG9nb3V0PXRoaXMubG9nb3V0LmJpbmQodGhpcykgIFxyXG4gICAgdGhpcy5zZW5kUmVxdWVzdD10aGlzLnNlbmRSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmNoYW5nZVZpZXdzPXRoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuc2V0Q3VycmVudFVzZXI9dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRNb3ZpZT10aGlzLmdldE1vdmllLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmFjY2VwdEZyaWVuZD0gdGhpcy5hY2NlcHRGcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZGVjbGluZUZyaWVuZD10aGlzLmRlY2xpbmVGcmllbmQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hhbmdlVmlld3NNb3ZpZT10aGlzLmNoYW5nZVZpZXdzTW92aWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hhbmdlVmlld3NGcmllbmRzPXRoaXMuY2hhbmdlVmlld3NGcmllbmRzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXM9dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmJ1ZGR5UmVxdWVzdD10aGlzLmJ1ZGR5UmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzPXRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5mb2N1c09uRnJpZW5kPXRoaXMuZm9jdXNPbkZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5yZW1vdmVSZXF1ZXN0PXRoaXMucmVtb3ZlUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcblxyXG4gIGdldEN1cnJlbnRGcmllbmRzKCkge1xyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCd0ZXN0aW5nZ2cnKTtcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZHMnLHt0ZXN0OidpbmZvJ30sIChhLCBiKSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd3aGF0IHlvdSBnZXQgYmFjayBmcm9tIHNlcnZlciBmb3IgZ2V0IGZyaWVuZHMnLGEsYik7XHJcbiAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxhLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYgKGFbaV1bMV09PT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgYVtpXVsxXSA9IFwiTm8gY29tcGFyaXNvbiB0byBiZSBtYWRlXCI7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgY29uc3QgZmluYWw9IGEuc29ydCgoYSxiKT0+e3JldHVybiBiWzFdLWFbMV19KTtcclxuICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIHdoYXQgR0NGIGlzIHNldHRpbmcgYXMgYWxsIGZyaWVuZHMnLCBmaW5hbCk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG15RnJpZW5kczpmaW5hbFxyXG4gICAgICB9KVxyXG4gICAgICAgY29uc29sZS5sb2coJ3RoZXMgYXJlIG15IGZyaWVuZHMhISEhISEhISEhISEhISEhIScsdGhpcy5zdGF0ZS5teUZyaWVuZHMpO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG5cclxuICBhY2NlcHRGcmllbmQocGVyc29uVG9BY2NlcHQsIG1vdmllKSB7XHJcbiAgXHJcbiAgICBjb25zb2xlLmxvZygnY2FsbGluZyBhRicpO1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2FjY2VwdCcse3BlcnNvblRvQWNjZXB0OnBlcnNvblRvQWNjZXB0LCBtb3ZpZTogbW92aWV9LChyZXNwLGVycik9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdpdCBjYW1lIGJhY2shJywgdGhhdCk7XHJcbiAgICAgIGxldCBwZW5kaW5nPXRoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzO1xyXG5cclxuICAgICAgY29uc29sZS5sb2coJ2JlZm9yZScsIHBlbmRpbmcsIHBlcnNvblRvQWNjZXB0KTtcclxuICAgICAgY29uc3QgbmV3U2V0T2ZSZXFzPXBlbmRpbmcuc3BsaWNlKHBlbmRpbmcuaW5kZXhPZihwZXJzb25Ub0FjY2VwdCksMSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3BlbmRpbmdGcmllbmRSZXF1ZXN0czpuZXdTZXRPZlJlcXN9KTtcclxuICAgICAgY29uc29sZS5sb2coJ2FmdGVyJywgdGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHMpO1xyXG5cclxuICAgICAgLy90aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgIH0pXHJcbiAgICBcclxuICAgIC8vIGNvbnNvbGUubG9nKCdyZWZyZXNoZWQgaW5ib3gsIHNob3VsZCBkZWxldGUgZnJpZW5kIHJlcXVlc3Qgb24gdGhlIHNwb3QgaW5zdGVhZCBvZiBtb3ZpbmcnKVxyXG4gIH1cclxuXHJcbiAgZGVjbGluZUZyaWVuZChwZXJzb25Ub0RlY2xpbmUsIG1vdmllKSB7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZGVjbGluZScse3BlcnNvblRvRGVjbGluZTpwZXJzb25Ub0RlY2xpbmUsIG1vdmllOiBtb3ZpZX0sKHJlc3AsIGVycik9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzdGF0ZSBhZnRlciBkZWNsaW5pbmcgZnJpZW5kLCAnLCB0aGlzLnN0YXRlKTtcclxuICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZpbmRNb3ZpZUJ1ZGRpZXMoKSB7XHJcbiAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9maW5kTW92aWVCdWRkaWVzJyx7ZHVtbXk6J2luZm8nfSwocmVzcCwgZXJyKT0+IHtcclxuICAgICAgY29uc3Qgc29ydGVkPXJlc3Auc29ydCgoYSxiKT0+KGJbMV0tYVsxXSkpO1xyXG4gICAgICBjb25zdCBteUZyaWVuZHM9dGhhdC5teUZyaWVuZHM7XHJcbiAgICAgICBjb25zdCB1bmlxdWVGcmllbmRzPVtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHNvcnRlZC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgIGxldCB1bmlxdWU9dHJ1ZTtcclxuICAgICAgICAgIGZvciAobGV0IHg9MDt4PG15RnJpZW5kcy5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgaWYgKHNvcnRlZFtpXVswXT09PW15RnJpZW5kc1t4XVswXSl7XHJcbiAgICAgICAgICAgICAgdW5pcXVlPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodW5pcXVlKXtcclxuICAgICAgICAgICAgdW5pcXVlRnJpZW5kcy5wdXNoKHNvcnRlZFtpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzpcIkZOTUJcIixcclxuICAgICAgICBwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXM6dW5pcXVlRnJpZW5kc1xyXG4gICAgICB9KVxyXG5cclxuICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG5cclxuICBjaGFuZ2VWaWV3KCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6XCJTaWduVXBcIiBcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBzZXRDdXJyZW50VXNlcih1c2VybmFtZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2NhbGxpbmcgc2V0Q3VycmVudFVzZXInKTtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBjdXJyZW50VXNlcjogdXNlcm5hbWVcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBlbnRlck5ld1VzZXIobmFtZSxwYXNzd29yZCkge1xyXG4gICAgLy8gY29uc29sZS5sb2cobmFtZSxwYXNzd29yZCk7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9zaWdudXAnLHtuYW1lOm5hbWUscGFzc3dvcmQ6cGFzc3dvcmR9KS50aGVuKCgpPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnc3VjY2VzcycpOyBcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7dXNlcm5hbWU6IG5hbWUsIHZpZXc6IFwiSG9tZVwifSlcclxuICAgIH0pLmNhdGNoKCgpPT4ge2NvbnNvbGUubG9nKCdlcnJvcicpfSlcclxuICB9XHJcblxyXG4gIGdldEZyaWVuZE1vdmllUmF0aW5ncygpIHtcclxuICAgIGxldCBtb3ZpZU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vdmllVG9WaWV3XCIpLnZhbHVlXHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRSYXRpbmdzJywgeyBuYW1lOiBtb3ZpZU5hbWUgfSkudGhlbihyZXNwb25zZT0+IHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6XCJIb21lXCIsXHJcbiAgICAgIGZyaWVuZHNSYXRpbmdzOnJlc3BvbnNlXHJcbiAgICB9KVxyXG4gICAgLy8gY29uc29sZS5sb2coJ291ciByZXNwb25zZScsdGhpcy5zdGF0ZS5mcmllbmRzUmF0aW5ncylcclxuICAgIH0pLmNhdGNoKGVycj0+IHtjb25zb2xlLmxvZyhlcnIpfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICBsb2dvdXQoKSB7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9sb2dvdXQnKS50aGVuKHJlc3BvbnNlPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoc3RhcnRpbmdTdGF0ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlbmRXYXRjaFJlcXVlc3QoZnJpZW5kKSB7XHJcbiAgICBjb25zdCBtb3ZpZT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlO1xyXG4gICAgY29uc3QgdG9TZW5kPXtyZXF1ZXN0ZWU6ZnJpZW5kLCBtb3ZpZTptb3ZpZX07XHJcbiAgICBpZiAobW92aWUubGVuZ3RoKSB7XHJcbiAgICAgICQucG9zdChVcmwgKyAnL3NlbmRXYXRjaFJlcXVlc3QnLCB0b1NlbmQsIChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3AsIGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU9Jyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygneW91IG5lZWQgdG8gZW50ZXIgYSBtb3ZpZSB0byBzZW5kIGEgd2F0Y2ggcmVxdWVzdCEhISEnKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vLy8vbW92aWUgcmVuZGVyXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy9jYWxsIHNlYXJjaG1vdmllIGZ1bmN0aW9uXHJcbiAgLy93aGljaCBnZXRzIHBhc3NlZCBkb3duIHRvIHRoZSBNb3ZpZSBTZWFyY2ggXHJcbiAgZ2V0TW92aWUocXVlcnkpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIHF1ZXJ5OiBxdWVyeVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGhpcy5wcm9wcy5zZWFyY2hNb3ZpZShvcHRpb25zLCBtb3ZpZSA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKG1vdmllKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzpcIk1vdmllU2VhcmNoVmlld1wiLFxyXG4gICAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcbiAgLy9zaG93IHRoZSBtb3ZpZSBzZWFyY2hlZCBpbiBmcmllbmQgbW92aWUgbGlzdFxyXG4gIC8vb250byB0aGUgc3RhdGV2aWV3IG9mIG1vdmllc2VhcmNodmlld1xyXG4gIHNob3dNb3ZpZShtb3ZpZSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vLy8vTmF2IGNoYW5nZVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIGNoYW5nZVZpZXdzKHRhcmdldFN0YXRlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcclxuXHJcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nRnJpZW5kcycpe1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygneW91IHN3aXRjaGVkIHRvIGZyaWVuZHMhIScpXHJcbiAgICAgIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKVxyXG4gICAgICAvL3RoaXMuc2VuZFJlcXVlc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nSG9tZScpe1xyXG4gICAgICAvLyB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcclxuICAgICAgdGhpcy5zZW5kUmVxdWVzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgICBpZiAodGFyZ2V0U3RhdGU9PT1cIkluYm94XCIpe1xyXG4gICAgICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKClcclxuICAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuXHJcbiAgY2hhbmdlVmlld3NNb3ZpZSh0YXJnZXRTdGF0ZSwgbW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZSxcclxuICAgICAgbW92aWU6IG1vdmllXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoYW5nZVZpZXdzRnJpZW5kcyh0YXJnZXRTdGF0ZSwgZnJpZW5kKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICBidWRkeVJlcXVlc3QocGVyc29uLCBpZHgpIHtcclxuICAgIGNvbnNvbGUubG9nKHBlcnNvbiwgaWR4KTtcclxuICAgIHRoaXMuc2VuZFJlcXVlc3QocGVyc29uLCBpZHgpO1xyXG4gIH1cclxuXHJcblxyXG4gIHNlbmRSZXF1ZXN0KGEsIGlkeCkge1xyXG4gICAgY29uc29sZS5sb2codHlwZW9mIGEpO1xyXG4gICAgaWYgKHR5cGVvZiBhPT09XCJvYmplY3RcIil7XHJcbiAgICAgIHZhciBwZXJzb249ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZTtcclxuICAgICAgY29uc29sZS5sb2coJ3BhcnQgMScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ3BhcnQgMicpO1xyXG4gICAgICB2YXIgcGVyc29uID0gYSB8fCAndGVzdCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3VyckZyaWVuZHM9dGhpcy5zdGF0ZS5teUZyaWVuZHM7XHJcbiAgICBjb25zdCBmcmllbmRzMT1jdXJyRnJpZW5kcy5tYXAoZnJpZW5kSW5mbz0+KGZyaWVuZEluZm9bMF0pKTtcclxuICAgIHRoaXMuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyLmZvckVhY2gocmVxPT57XHJcbiAgICAgIGZyaWVuZHMxLnB1c2gocmVxKTtcclxuICAgIH0pXHJcbiAgICBcclxuXHJcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYWxzbyBiZSBteSBmcmllbmRzJyxwZXJzb24sIGN1cnJGcmllbmRzLGZyaWVuZHMxLGZyaWVuZHMyKVxyXG4gICAgY29uc29sZS5sb2coJ3RoZXNlIHNob3VsZCBiZSBteSBjdXJyZW50IGZyaWVuZHMgYW5kIGluTWVtIHJlcXVlc3RzIGFuZCBJIHNob3VsZCBub3QgYmUgYWJsZSBvdCBzZW5kIHRvIHRoZW0nLCBmcmllbmRzMSk7XHJcbiAgICBpZiAoZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xICYmIGZyaWVuZHMxLmxlbmd0aCE9PTApe1xyXG4gICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMClcclxuICAgICAgY29uc29sZS5sb2coJ2Nhc2UgY2F1Z2h0IDI1NCcpO1xyXG4gICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgIFxyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhpcyBwZXJzb24gaXMgYWxyZWFkeSBpbiB0aGVyZSEhJylcclxuICAgIH0gZWxzZSBpZiAoIXBlcnNvbi5sZW5ndGgpIHtcclxuICAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKVxyXG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZCwjZW50ZXJSZWFsRnJpZW5kMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kLCNlbnRlclJlYWxGcmllbmQyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICBcclxuICAgIH0gZWxzZSB7XHJcblxyXG4vLyBjb25zb2xlLmxvZygncGVyc29uIGlzIGRlZmluZWQ/JyxwZXJzb24pO1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kUmVxdWVzdCcse25hbWU6cGVyc29ufSwgKHJlc3AsIGVycik9PiB7XHJcbiAgICAgICBcclxuICAgICAgIGNvbnNvbGUubG9nKCdzaG91bGQgaW5jbHVkZSBldmVyeWJvZHkgdG8gd2hvbSBhIHJlcSBoYXMgZXZlciBiZWVuIHNlbnQsIHNob3J0IG9mIG1vc3QgcmVjZW50JywgcmVzcCk7XHJcbiAgICAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMCk7XHJcbiAgICAgICAgICBpZiAocmVzcC5pbmRleE9mKHBlcnNvbik+LTEpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2FzZSBjYXVnaHQgMjcyJylcclxuICAgICAgICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoXCIjcmVxU2VudCwjcmVxU2VudDJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICAgICAkKFwiI3JlcVNlbnQsI3JlcVNlbnQyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgIHJlcXVlc3RzT2ZDdXJyZW50VXNlcjpyZXNwLmNvbmNhdChbcGVyc29uXSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpIT09bnVsbCl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZSA9ICcnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCkge1xyXG4gICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBsaXN0IGZyaWVuZCByZXFzJylcclxuICAgICQucG9zdChVcmwgKyAnL2xpc3RSZXF1ZXN0cycsIChyZXNwb25zZSwgZXJyb3IpPT4ge1xyXG4gICAgICBjb25zdCBwRlI9W107XHJcbiAgICAgIGNvbnN0IHJSPVtdO1xyXG4gICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIHRvIGxwZnInLCByZXNwb25zZSk7XHJcblxyXG4gICAgICBmb3IgKHZhciBpPTA7aTxyZXNwb25zZVswXS5sZW5ndGg7aSsrKXtcclxuICAgICAgICBjb25zdCByZXF1ZXN0b3I9cmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RvciddO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlVFU9IHJlc3BvbnNlWzBdW2ldWydyZXNwb25zZSddO1xyXG4gICAgICAgIGlmIChyZXF1ZXN0b3IhPT1yZXNwb25zZVsxXSAmJiByZXNwb25zZVRVPT09bnVsbCApe1xyXG4gICAgICAgICAgcEZSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVxdWVzdG9yPT09cmVzcG9uc2VbMV0gJiZyZXNwb25zZVRVIT09bnVsbCAmJiByZXNwb25zZVswXVtpXVsncmVxdWVzdGVlJ10hPT0ndGVzdCcpe1xyXG4gICAgICAgICAgclIucHVzaChyZXNwb25zZVswXVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vXHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVG90YWxpdHkgb2YgaW5ib3hcIixwRlIsIHJSKTtcclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czpwRlIsXHJcbiAgICAgICAgcmVxdWVzdFJlc3BvbnNlczpyUlxyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZm9jdXNPbkZyaWVuZChmcmllbmQpIHtcclxuICAgIC8vXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6J3NpbmdsZUZyaWVuZCcsXHJcbiAgICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZFVzZXJSYXRpbmdzJywge2ZyaWVuZE5hbWU6IGZyaWVuZH0sIHJlc3BvbnNlID0+IHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOiByZXNwb25zZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgcmVtb3ZlUmVxdWVzdChwZXJzb24sIHNlbGYsIG1vdmllKSB7XHJcbiAgICBjb25zb2xlLmxvZygndHJ5aW5nIHRvIHJlbSByZXEnKTtcclxuICAgIHZhciB0aGF0PSB0aGlzO1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiBVcmwgKyAnL3JlbW92ZVJlcXVlc3QnLFxyXG4gICAgICB0eXBlOiAnREVMRVRFJyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHJlcXVlc3Rvcjogc2VsZixcclxuICAgICAgICByZXF1ZXN0ZWU6IHBlcnNvbixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgY29uc29sZS5sb2coJ1JFUVVFU1QgUkVNT1ZFRCEgTW92aWUgaXM6ICcsIG1vdmllKTtcclxuICAgICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBjb25zdCBuYXY9PE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXN9XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3N9XHJcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9IFxyXG4gICAgICAgICAgICAvPlxyXG5cclxuICAgIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nTG9naW4nKSB7XHJcbiAgICAgIHJldHVybiAoPExvZ0luIGNoYW5nZVZpZXdzPXt0aGlzLmNoYW5nZVZpZXdzfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlcn0vPik7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PVwiU2lnblVwXCIpIHtcclxuICAgICAgcmV0dXJuICg8U2lnblVwIGNoYW5nZVZpZXdzPXt0aGlzLmNoYW5nZVZpZXdzfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlcn0gLz4pO1xyXG4gICAgfSBcclxuICAgIC8vdGhpcyB2aWV3IGlzIGFkZGVkIGZvciBtb3ZpZXNlYXJjaCByZW5kZXJpbmdcclxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNb3ZpZVNlYXJjaFZpZXdcIikge1xyXG4gICAgICByZXR1cm4gKCBcclxuICAgICAgICA8ZGl2PiBcclxuICAgICAgICAgIDxkaXY+e25hdn08L2Rpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8TW92aWVSYXRpbmcgXHJcbiAgICAgICAgICAgIGhhbmRsZVNlYXJjaE1vdmllPXt0aGlzLmdldE1vdmllfVxyXG4gICAgICAgICAgICBtb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiSW5ib3hcIiApIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzfVxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3N9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH1cclxuICAgICAgICAgICAgICBIb21lPXt0cnVlfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8SW5ib3ggXHJcbiAgICAgICAgICAgICAgcmVxdWVzdHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzfVxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlc0Fuc3dlcmVkPXt0aGlzLnN0YXRlLnJlcXVlc3RSZXNwb25zZXN9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH0gIFxyXG4gICAgICAgICAgICAgIGFjY2VwdD0ge3RoaXMuYWNjZXB0RnJpZW5kfSBcclxuICAgICAgICAgICAgICBkZWNsaW5lPXt0aGlzLmRlY2xpbmVGcmllbmR9IFxyXG4gICAgICAgICAgICAgIGxpc3RSZXF1ZXN0cz17dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzfSBcclxuICAgICAgICAgICAgICBwcGxXaG9XYW50VG9CZUZyaWVuZHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzLm1hcChcclxuICAgICAgICAgICAgICAgIGE9PiggW2EucmVxdWVzdG9yLGEucmVxdWVzdFR5cCxhLm1vdmllPT09bnVsbD9cIlwiOiBhLm1vdmllLFwiTWVzc2FnZTpcIisgYS5tZXNzYWdlPT09J251bGwnP1wibm9uZVwiOmEubWVzc2FnZV0pKX0gXHJcbiAgICAgICAgICAgICAgcmVtb3ZlPXt0aGlzLnJlbW92ZVJlcXVlc3R9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGcmllbmRzXCIgKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxGcmllbmRzIFxyXG4gICAgICAgICAgICBzZW5kV2F0Y2hSZXF1ZXN0PXt0aGlzLnNlbmRXYXRjaFJlcXVlc3R9IFxyXG4gICAgICAgICAgICBmb2Y9IHt0aGlzLmZvY3VzT25GcmllbmR9IFxyXG4gICAgICAgICAgICBnZXRGcmllbmRzPXt0aGlzLmdldEN1cnJlbnRGcmllbmRzfSBcclxuICAgICAgICAgICAgbXlGcmllbmRzPXt0aGlzLnN0YXRlLm15RnJpZW5kc30gXHJcbiAgICAgICAgICAgIGxpc3RQb3RlbnRpYWxzPXt0aGlzLmxpc3RQb3RlbnRpYWxzfSBcclxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH0gIFxyXG4gICAgICAgICAgICBzZW5kUmVxdWVzdD17dGhpcy5zZW5kUmVxdWVzdH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiSG9tZVwiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxIb21lIFxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJTaW5nbGVNb3ZpZVwiKSB7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IG9uQ2xpY2s9eygpPT5jb25zb2xlLmxvZyh0aGF0LnN0YXRlKX0+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8U2luZ2xlTW92aWVSYXRpbmcgXHJcbiAgICAgICAgICAgIGNvbXBhdGliaWxpdHk9e3RoaXMuc3RhdGUubXlGcmllbmRzfVxyXG4gICAgICAgICAgICBjdXJyZW50TW92aWU9e3RoaXMuc3RhdGUubW92aWV9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHN9XHJcbiAgICAgICAgICAgIGZvZj17dGhpcy5mb2N1c09uRnJpZW5kfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09J3NpbmdsZUZyaWVuZCcpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPFNpbmdsZUZyaWVuZCBcclxuICAgICAgICAgICAgbW92aWVzT2ZGcmllbmQ9e3RoaXMuc3RhdGUuaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXN9IFxyXG4gICAgICAgICAgICBmcmllbmROYW1lPXt0aGlzLnN0YXRlLmZyaWVuZFRvRm9jdXNPbn0gXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3N9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZOTUJcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8RmluZE1vdmllQnVkZHkgXHJcbiAgICAgICAgICAgIGJ1ZGR5ZnVuYz17dGhpcy5idWRkeVJlcXVlc3R9IFxyXG4gICAgICAgICAgICBidWRkaWVzPXt0aGlzLnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllc30gXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTXlSYXRpbmdzXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPE15UmF0aW5ncyBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LkFwcCA9IEFwcDtcclxuXHJcbnZhciBVcmwgPSAnaHR0cHM6Ly9yZWVsZnJpZW5kei5oZXJva3VhcHAuY29tJztcclxuLy8gdmFyIFVybCA9ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAnO1xyXG53aW5kb3cuVXJsID0gVXJsXHJcbiJdfQ==