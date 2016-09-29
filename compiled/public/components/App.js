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

        _this3.setState({ pendingFriendRequests: l });


        g.listPendingFriendRequests();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRpbmdTdGF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJiaW5kIiwiZ2V0RnJpZW5kcyIsImdldEN1cnJlbnRGcmllbmRzIiwibXlGcmllbmRzIiwibG9nb3V0Iiwic2VuZFJlcXVlc3QiLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiZ2V0TW92aWUiLCJhY2NlcHRGcmllbmQiLCJkZWNsaW5lRnJpZW5kIiwiY2hhbmdlVmlld3NNb3ZpZSIsImNoYW5nZVZpZXdzRnJpZW5kcyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJidWRkeVJlcXVlc3QiLCJsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzIiwiZm9jdXNPbkZyaWVuZCIsInJlbW92ZVJlcXVlc3QiLCIkIiwicG9zdCIsIlVybCIsInRlc3QiLCJhIiwiYiIsImkiLCJsZW5ndGgiLCJmaW5hbCIsInNvcnQiLCJzZXRTdGF0ZSIsInBlcnNvblRvQWNjZXB0IiwibW92aWUiLCJ0aGF0IiwicmVzcCIsImVyciIsInBlbmRpbmciLCJwZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJuZXdTZXRPZlJlcXMiLCJzcGxpY2UiLCJpbmRleE9mIiwicGVyc29uVG9EZWNsaW5lIiwiZHVtbXkiLCJzb3J0ZWQiLCJ1bmlxdWVGcmllbmRzIiwidW5pcXVlIiwieCIsInB1c2giLCJ2aWV3IiwicG90ZW50aWFsTW92aWVCdWRkaWVzIiwidXNlcm5hbWUiLCJjdXJyZW50VXNlciIsIm5hbWUiLCJwYXNzd29yZCIsInRoZW4iLCJjYXRjaCIsIm1vdmllTmFtZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ2YWx1ZSIsImZyaWVuZHNSYXRpbmdzIiwicmVzcG9uc2UiLCJmcmllbmQiLCJ0b1NlbmQiLCJyZXF1ZXN0ZWUiLCJxdWVyeSIsIm9wdGlvbnMiLCJzZWFyY2hNb3ZpZSIsInRhcmdldFN0YXRlIiwiZnJpZW5kVG9Gb2N1c09uIiwicGVyc29uIiwiaWR4IiwiY3VyckZyaWVuZHMiLCJmcmllbmRzMSIsIm1hcCIsImZyaWVuZEluZm8iLCJyZXF1ZXN0c09mQ3VycmVudFVzZXIiLCJmb3JFYWNoIiwicmVxIiwic2Nyb2xsVG9wIiwiZmFkZUluIiwiZmFkZU91dCIsImNvbmNhdCIsImVycm9yIiwicEZSIiwiclIiLCJyZXF1ZXN0b3IiLCJyZXNwb25zZVRVIiwicmVxdWVzdFJlc3BvbnNlcyIsImdldCIsImZyaWVuZE5hbWUiLCJpbmRpdmlkdWFsRnJpZW5kc01vdmllcyIsInNlbGYiLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGEiLCJzdWNjZXNzIiwibmF2IiwicmVxdWVzdFR5cCIsIm1lc3NhZ2UiLCJsaXN0UG90ZW50aWFscyIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFDTUEsRzs7O0FBQ0osYUFBWUMsQ0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYQSxDQURXOztBQUVqQixNQUFLQyxLQUFMLEdBQWFDLGFBQWI7QUFDQSxNQUFLQyxnQkFBTCxHQUFzQixFQUFLQSxnQkFBTCxDQUFzQkMsSUFBdEIsR0FBdEI7QUFDQSxNQUFLQyxVQUFMLEdBQWdCLEVBQUtDLGlCQUFMLENBQXVCRixJQUF2QixHQUFoQjtBQUNBLE1BQUtHLFNBQUwsR0FBZSxFQUFLTixLQUFMLENBQVdNLFNBQTFCO0FBQ0EsTUFBS0MsTUFBTCxHQUFZLEVBQUtBLE1BQUwsQ0FBWUosSUFBWixHQUFaO0FBQ0EsTUFBS0ssV0FBTCxHQUFpQixFQUFLQSxXQUFMLENBQWlCTCxJQUFqQixHQUFqQjtBQUNBLE1BQUtNLFdBQUwsR0FBaUIsRUFBS0EsV0FBTCxDQUFpQk4sSUFBakIsR0FBakI7QUFDQSxNQUFLTyxjQUFMLEdBQW9CLEVBQUtBLGNBQUwsQ0FBb0JQLElBQXBCLEdBQXBCO0FBQ0EsTUFBS1EsUUFBTCxHQUFjLEVBQUtBLFFBQUwsQ0FBY1IsSUFBZCxHQUFk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QSxJQUFJLEtBQUtuQixLQUFMLENBQVdpRCxJQUFYLEtBQWtCLGNBQXRCLEVBQXNDO0FBQzNDLGlCQUNFO0FBQUE7QUFBQTtBQUNLa0QsYUFETDtBQUVFLGdDQUFDLFlBQUQ7QUFDRSw4QkFBZ0IsS0FBS25HLEtBQUwsQ0FBVzRGLHVCQUQ3QjtBQUVFLDBCQUFZLEtBQUs1RixLQUFMLENBQVdzRSxlQUZ6QjtBQUdFLHVCQUFTLEtBQUs3RCxXQUhoQjtBQUlFLHNCQUFRLEtBQUtLO0FBSmY7QUFGRixXQURGO0FBV0QsU0FaTSxNQVlBLElBQUksS0FBS2QsS0FBTCxDQUFXaUQsSUFBWCxLQUFvQixNQUF4QixFQUFnQztBQUNyQyxpQkFDRTtBQUFBO0FBQUE7QUFDS2tELGFBREw7QUFFRSxnQ0FBQyxjQUFEO0FBQ0UseUJBQVcsS0FBS2xGLFlBRGxCO0FBRUUsdUJBQVMsS0FBS2pCLEtBQUwsQ0FBV2tEO0FBRnRCO0FBRkYsV0FERjtBQVNELFNBVk0sTUFVQSxJQUFJLEtBQUtsRCxLQUFMLENBQVdpRCxJQUFYLEtBQW9CLFdBQXhCLEVBQXFDO0FBQzFDLGlCQUNFO0FBQUE7QUFBQTtBQUNLa0QsYUFETDtBQUVFLGdDQUFDLFNBQUQ7QUFDRSxzQkFBUSxLQUFLckY7QUFEZjtBQUZGLFdBREY7QUFRRDtBQUNGOzs7O0VBcGRleUYsTUFBTUMsUzs7QUF1ZHhCQyxPQUFPM0csR0FBUCxHQUFhQSxHQUFiOztBQUVBLElBQUl5QixNQUFNLG1DQUFWO0FBQ0E7QUFDQWtGLE9BQU9sRixHQUFQLEdBQWFBLEdBQWIiLCJmaWxlIjoiQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSBzdGFydGluZ1N0YXRlO1xyXG4gICAgdGhpcy5zZW5kV2F0Y2hSZXF1ZXN0PXRoaXMuc2VuZFdhdGNoUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRGcmllbmRzPXRoaXMuZ2V0Q3VycmVudEZyaWVuZHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubXlGcmllbmRzPXRoaXMuc3RhdGUubXlGcmllbmRzO1xyXG4gICAgdGhpcy5sb2dvdXQ9dGhpcy5sb2dvdXQuYmluZCh0aGlzKSAgXHJcbiAgICB0aGlzLnNlbmRSZXF1ZXN0PXRoaXMuc2VuZFJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hhbmdlVmlld3M9dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZXRDdXJyZW50VXNlcj10aGlzLnNldEN1cnJlbnRVc2VyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldE1vdmllPXRoaXMuZ2V0TW92aWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYWNjZXB0RnJpZW5kPSB0aGlzLmFjY2VwdEZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZWNsaW5lRnJpZW5kPXRoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3c01vdmllPXRoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHM9dGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZmluZE1vdmllQnVkZGllcz10aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYnVkZHlSZXF1ZXN0PXRoaXMuYnVkZHlSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHM9dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmZvY3VzT25GcmllbmQ9dGhpcy5mb2N1c09uRnJpZW5kLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlbW92ZVJlcXVlc3Q9dGhpcy5yZW1vdmVSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0Q3VycmVudEZyaWVuZHMoKSB7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3Rlc3RpbmdnZycpO1xyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kcycse3Rlc3Q6J2luZm8nfSwgKGEsIGIpID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3doYXQgeW91IGdldCBiYWNrIGZyb20gc2VydmVyIGZvciBnZXQgZnJpZW5kcycsYSxiKTtcclxuICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPGEubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoYVtpXVsxXT09PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICBhW2ldWzFdID0gXCJObyBjb21wYXJpc29uIHRvIGJlIG1hZGVcIjtcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICBjb25zdCBmaW5hbD0gYS5zb3J0KChhLGIpPT57cmV0dXJuIGJbMV0tYVsxXX0pO1xyXG4gICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgd2hhdCBHQ0YgaXMgc2V0dGluZyBhcyBhbGwgZnJpZW5kcycsIGZpbmFsKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbXlGcmllbmRzOmZpbmFsXHJcbiAgICAgIH0pXHJcbiAgICAgICBjb25zb2xlLmxvZygndGhlcyBhcmUgbXkgZnJpZW5kcyEhISEhISEhISEhISEhISEhJyx0aGlzLnN0YXRlLm15RnJpZW5kcyk7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcblxyXG4gIGFjY2VwdEZyaWVuZChwZXJzb25Ub0FjY2VwdCwgbW92aWUpIHtcclxuICBcclxuICAgIGNvbnNvbGUubG9nKCdjYWxsaW5nIGFGJyk7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvYWNjZXB0Jyx7cGVyc29uVG9BY2NlcHQ6cGVyc29uVG9BY2NlcHQsIG1vdmllOiBtb3ZpZX0sKHJlc3AsZXJyKT0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ2l0IGNhbWUgYmFjayEnLCB0aGF0KTtcclxuICAgICAgbGV0IHBlbmRpbmc9dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHM7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZygnYmVmb3JlJywgcGVuZGluZyk7XHJcbiAgICAgIGNvbnN0IG5ld1NldE9mUmVxcz1wZW5kaW5nLnNwbGljZShwZW5kaW5nLmluZGV4T2YocGVyc29uVG9BY2NlcHQpLDEpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtwZW5kaW5nRnJpZW5kUmVxdWVzdHM6bmV3U2V0T2ZSZXFzfSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdhZnRlcicsIHBlbmRpbmcpO1xyXG5cclxuICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICAvLyBjb25zb2xlLmxvZygncmVmcmVzaGVkIGluYm94LCBzaG91bGQgZGVsZXRlIGZyaWVuZCByZXF1ZXN0IG9uIHRoZSBzcG90IGluc3RlYWQgb2YgbW92aW5nJylcclxuICB9XHJcblxyXG4gIGRlY2xpbmVGcmllbmQocGVyc29uVG9EZWNsaW5lLCBtb3ZpZSkge1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2RlY2xpbmUnLHtwZXJzb25Ub0RlY2xpbmU6cGVyc29uVG9EZWNsaW5lLCBtb3ZpZTogbW92aWV9LChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3RhdGUgYWZ0ZXIgZGVjbGluaW5nIGZyaWVuZCwgJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmaW5kTW92aWVCdWRkaWVzKCkge1xyXG4gICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZmluZE1vdmllQnVkZGllcycse2R1bW15OidpbmZvJ30sKHJlc3AsIGVycik9PiB7XHJcbiAgICAgIGNvbnN0IHNvcnRlZD1yZXNwLnNvcnQoKGEsYik9PihiWzFdLWFbMV0pKTtcclxuICAgICAgY29uc3QgbXlGcmllbmRzPXRoYXQubXlGcmllbmRzO1xyXG4gICAgICAgY29uc3QgdW5pcXVlRnJpZW5kcz1bXTtcclxuICAgICAgICBmb3IgKGxldCBpPTA7aTxzb3J0ZWQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICBsZXQgdW5pcXVlPXRydWU7XHJcbiAgICAgICAgICBmb3IgKGxldCB4PTA7eDxteUZyaWVuZHMubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgIGlmIChzb3J0ZWRbaV1bMF09PT1teUZyaWVuZHNbeF1bMF0pe1xyXG4gICAgICAgICAgICAgIHVuaXF1ZT1mYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHVuaXF1ZSl7XHJcbiAgICAgICAgICAgIHVuaXF1ZUZyaWVuZHMucHVzaChzb3J0ZWRbaV0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJGTk1CXCIsXHJcbiAgICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOnVuaXF1ZUZyaWVuZHNcclxuICAgICAgfSlcclxuXHJcbiAgIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuXHJcbiAgY2hhbmdlVmlldygpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OlwiU2lnblVwXCIgXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgc2V0Q3VycmVudFVzZXIodXNlcm5hbWUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsaW5nIHNldEN1cnJlbnRVc2VyJyk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgY3VycmVudFVzZXI6IHVzZXJuYW1lXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZW50ZXJOZXdVc2VyKG5hbWUscGFzc3dvcmQpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKG5hbWUscGFzc3dvcmQpO1xyXG4gICAgJC5wb3N0KFVybCArICcvc2lnbnVwJyx7bmFtZTpuYW1lLHBhc3N3b3JkOnBhc3N3b3JkfSkudGhlbigoKT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTsgXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3VzZXJuYW1lOiBuYW1lLCB2aWV3OiBcIkhvbWVcIn0pXHJcbiAgICB9KS5jYXRjaCgoKT0+IHtjb25zb2xlLmxvZygnZXJyb3InKX0pXHJcbiAgfVxyXG5cclxuICBnZXRGcmllbmRNb3ZpZVJhdGluZ3MoKSB7XHJcbiAgICBsZXQgbW92aWVOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb3ZpZVRvVmlld1wiKS52YWx1ZVxyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kUmF0aW5ncycsIHsgbmFtZTogbW92aWVOYW1lIH0pLnRoZW4ocmVzcG9uc2U9PiB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OlwiSG9tZVwiLFxyXG4gICAgICBmcmllbmRzUmF0aW5nczpyZXNwb25zZVxyXG4gICAgfSlcclxuICAgIC8vIGNvbnNvbGUubG9nKCdvdXIgcmVzcG9uc2UnLHRoaXMuc3RhdGUuZnJpZW5kc1JhdGluZ3MpXHJcbiAgICB9KS5jYXRjaChlcnI9PiB7Y29uc29sZS5sb2coZXJyKX0pO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgbG9nb3V0KCkge1xyXG4gICAgJC5wb3N0KFVybCArICcvbG9nb3V0JykudGhlbihyZXNwb25zZT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHN0YXJ0aW5nU3RhdGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kV2F0Y2hSZXF1ZXN0KGZyaWVuZCkge1xyXG4gICAgY29uc3QgbW92aWU9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZTtcclxuICAgIGNvbnN0IHRvU2VuZD17cmVxdWVzdGVlOmZyaWVuZCwgbW92aWU6bW92aWV9O1xyXG4gICAgaWYgKG1vdmllLmxlbmd0aCkge1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kV2F0Y2hSZXF1ZXN0JywgdG9TZW5kLCAocmVzcCwgZXJyKT0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwLCBlcnIpO1xyXG4gICAgICB9KTtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlPScnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3lvdSBuZWVkIHRvIGVudGVyIGEgbW92aWUgdG8gc2VuZCBhIHdhdGNoIHJlcXVlc3QhISEhJylcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL21vdmllIHJlbmRlclxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vY2FsbCBzZWFyY2htb3ZpZSBmdW5jdGlvblxyXG4gIC8vd2hpY2ggZ2V0cyBwYXNzZWQgZG93biB0byB0aGUgTW92aWUgU2VhcmNoIFxyXG4gIGdldE1vdmllKHF1ZXJ5KSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBxdWVyeTogcXVlcnlcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRoaXMucHJvcHMuc2VhcmNoTW92aWUob3B0aW9ucywgbW92aWUgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhtb3ZpZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJNb3ZpZVNlYXJjaFZpZXdcIixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG4gIC8vc2hvdyB0aGUgbW92aWUgc2VhcmNoZWQgaW4gZnJpZW5kIG1vdmllIGxpc3RcclxuICAvL29udG8gdGhlIHN0YXRldmlldyBvZiBtb3ZpZXNlYXJjaHZpZXdcclxuICBzaG93TW92aWUobW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtb3ZpZTogbW92aWVcclxuICAgIH0pO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL05hdiBjaGFuZ2VcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICBjaGFuZ2VWaWV3cyh0YXJnZXRTdGF0ZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0ZyaWVuZHMnKXtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3lvdSBzd2l0Y2hlZCB0byBmcmllbmRzISEnKVxyXG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcclxuICAgICAgLy90aGlzLnNlbmRSZXF1ZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0hvbWUnKXtcclxuICAgICAgLy8gdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAgaWYgKHRhcmdldFN0YXRlPT09XCJJbmJveFwiKXtcclxuICAgICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpXHJcbiAgICAgfVxyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGNoYW5nZVZpZXdzTW92aWUodGFyZ2V0U3RhdGUsIG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VWaWV3c0ZyaWVuZHModGFyZ2V0U3RhdGUsIGZyaWVuZCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxyXG4gICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgYnVkZHlSZXF1ZXN0KHBlcnNvbiwgaWR4KSB7XHJcbiAgICBjb25zb2xlLmxvZyhwZXJzb24sIGlkeCk7XHJcbiAgICB0aGlzLnNlbmRSZXF1ZXN0KHBlcnNvbiwgaWR4KTtcclxuICB9XHJcblxyXG5cclxuICBzZW5kUmVxdWVzdChhLCBpZHgpIHtcclxuICAgIGNvbnNvbGUubG9nKHR5cGVvZiBhKTtcclxuICAgIGlmICh0eXBlb2YgYT09PVwib2JqZWN0XCIpe1xyXG4gICAgICB2YXIgcGVyc29uPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWU7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdwYXJ0IDEnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdwYXJ0IDInKTtcclxuICAgICAgdmFyIHBlcnNvbiA9IGEgfHwgJ3Rlc3QnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGN1cnJGcmllbmRzPXRoaXMuc3RhdGUubXlGcmllbmRzO1xyXG4gICAgY29uc3QgZnJpZW5kczE9Y3VyckZyaWVuZHMubWFwKGZyaWVuZEluZm89PihmcmllbmRJbmZvWzBdKSk7XHJcbiAgICB0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlci5mb3JFYWNoKHJlcT0+e1xyXG4gICAgICBmcmllbmRzMS5wdXNoKHJlcSk7XHJcbiAgICB9KVxyXG4gICAgXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGFsc28gYmUgbXkgZnJpZW5kcycscGVyc29uLCBjdXJyRnJpZW5kcyxmcmllbmRzMSxmcmllbmRzMilcclxuICAgIGNvbnNvbGUubG9nKCd0aGVzZSBzaG91bGQgYmUgbXkgY3VycmVudCBmcmllbmRzIGFuZCBpbk1lbSByZXF1ZXN0cyBhbmQgSSBzaG91bGQgbm90IGJlIGFibGUgb3Qgc2VuZCB0byB0aGVtJywgZnJpZW5kczEpO1xyXG4gICAgaWYgKGZyaWVuZHMxLmluZGV4T2YocGVyc29uKSE9PSAtMSAmJiBmcmllbmRzMS5sZW5ndGghPT0wKXtcclxuICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApXHJcbiAgICAgIGNvbnNvbGUubG9nKCdjYXNlIGNhdWdodCAyNTQnKTtcclxuICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICBcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXMgcGVyc29uIGlzIGFscmVhZHkgaW4gdGhlcmUhIScpXHJcbiAgICB9IGVsc2UgaWYgKCFwZXJzb24ubGVuZ3RoKSB7XHJcbiAgICAgICAkKGRvY3VtZW50KS5zY3JvbGxUb3AoMClcclxuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmQsI2VudGVyUmVhbEZyaWVuZDJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZCwjZW50ZXJSZWFsRnJpZW5kMlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuLy8gY29uc29sZS5sb2coJ3BlcnNvbiBpcyBkZWZpbmVkPycscGVyc29uKTtcclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFJlcXVlc3QnLHtuYW1lOnBlcnNvbn0sIChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAgXHJcbiAgICAgICBjb25zb2xlLmxvZygnc2hvdWxkIGluY2x1ZGUgZXZlcnlib2R5IHRvIHdob20gYSByZXEgaGFzIGV2ZXIgYmVlbiBzZW50LCBzaG9ydCBvZiBtb3N0IHJlY2VudCcsIHJlc3ApO1xyXG4gICAgICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApO1xyXG4gICAgICAgICAgaWYgKHJlc3AuaW5kZXhPZihwZXJzb24pPi0xKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2Nhc2UgY2F1Z2h0IDI3MicpXHJcbiAgICAgICAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKFwiI3JlcVNlbnQsI3JlcVNlbnQyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgICAgICAgJChcIiNyZXFTZW50LCNyZXFTZW50MlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6cmVzcC5jb25jYXQoW3BlcnNvbl0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKSE9PW51bGwpe1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWUgPSAnJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpIHtcclxuICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBmcmllbmQgcmVxcycpXHJcbiAgICAkLnBvc3QoVXJsICsgJy9saXN0UmVxdWVzdHMnLCAocmVzcG9uc2UsIGVycm9yKT0+IHtcclxuICAgICAgY29uc3QgcEZSPVtdO1xyXG4gICAgICBjb25zdCByUj1bXTtcclxuICAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSB0byBscGZyJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaT0wO2k8cmVzcG9uc2VbMF0ubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdG9yPXJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXTtcclxuICAgICAgICBjb25zdCByZXNwb25zZVRVPSByZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXTtcclxuICAgICAgICBpZiAocmVxdWVzdG9yIT09cmVzcG9uc2VbMV0gJiYgcmVzcG9uc2VUVT09PW51bGwgKXtcclxuICAgICAgICAgIHBGUi5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcXVlc3Rvcj09PXJlc3BvbnNlWzFdICYmcmVzcG9uc2VUVSE9PW51bGwgJiYgcmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RlZSddIT09J3Rlc3QnKXtcclxuICAgICAgICAgIHJSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvL1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlRvdGFsaXR5IG9mIGluYm94XCIscEZSLCByUik7XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBwZW5kaW5nRnJpZW5kUmVxdWVzdHM6cEZSLFxyXG4gICAgICAgIHJlcXVlc3RSZXNwb25zZXM6clJcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGZvY3VzT25GcmllbmQoZnJpZW5kKSB7XHJcbiAgICAvL1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OidzaW5nbGVGcmllbmQnLFxyXG4gICAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJC5nZXQoVXJsICsgJy9nZXRGcmllbmRVc2VyUmF0aW5ncycsIHtmcmllbmROYW1lOiBmcmllbmR9LCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBpbmRpdmlkdWFsRnJpZW5kc01vdmllczogcmVzcG9uc2VcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIHJlbW92ZVJlcXVlc3QocGVyc29uLCBzZWxmLCBtb3ZpZSkge1xyXG4gICAgY29uc29sZS5sb2coJ3RyeWluZyB0byByZW0gcmVxJyk7XHJcbiAgICB2YXIgdGhhdD0gdGhpcztcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogVXJsICsgJy9yZW1vdmVSZXF1ZXN0JyxcclxuICAgICAgdHlwZTogJ0RFTEVURScsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICByZXF1ZXN0b3I6IHNlbGYsXHJcbiAgICAgICAgcmVxdWVzdGVlOiBwZXJzb24sXHJcbiAgICAgICAgbW92aWU6IG1vdmllXHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdSRVFVRVNUIFJFTU9WRUQhIE1vdmllIGlzOiAnLCBtb3ZpZSk7XHJcbiAgICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgbmF2PTxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzfVxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSBcclxuICAgICAgICAgICAgLz5cclxuXHJcbiAgICBpZiAodGhpcy5zdGF0ZS52aWV3PT09J0xvZ2luJykge1xyXG4gICAgICByZXR1cm4gKDxMb2dJbiBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3c30gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXJ9Lz4pO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT1cIlNpZ25VcFwiKSB7XHJcbiAgICAgIHJldHVybiAoPFNpZ25VcCBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3c30gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXJ9IC8+KTtcclxuICAgIH0gXHJcbiAgICAvL3RoaXMgdmlldyBpcyBhZGRlZCBmb3IgbW92aWVzZWFyY2ggcmVuZGVyaW5nXHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTW92aWVTZWFyY2hWaWV3XCIpIHtcclxuICAgICAgcmV0dXJuICggXHJcbiAgICAgICAgPGRpdj4gXHJcbiAgICAgICAgICA8ZGl2PntuYXZ9PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPE1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBoYW5kbGVTZWFyY2hNb3ZpZT17dGhpcy5nZXRNb3ZpZX1cclxuICAgICAgICAgICAgbW92aWU9e3RoaXMuc3RhdGUubW92aWV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkluYm94XCIgKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllc31cclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9XHJcbiAgICAgICAgICAgICAgSG9tZT17dHJ1ZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPEluYm94IFxyXG4gICAgICAgICAgICAgIHJlcXVlc3RzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0c31cclxuICAgICAgICAgICAgICByZXNwb25zZXNBbnN3ZXJlZD17dGhpcy5zdGF0ZS5yZXF1ZXN0UmVzcG9uc2VzfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9ICBcclxuICAgICAgICAgICAgICBhY2NlcHQ9IHt0aGlzLmFjY2VwdEZyaWVuZH0gXHJcbiAgICAgICAgICAgICAgZGVjbGluZT17dGhpcy5kZWNsaW5lRnJpZW5kfSBcclxuICAgICAgICAgICAgICBsaXN0UmVxdWVzdHM9e3RoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0c30gXHJcbiAgICAgICAgICAgICAgcHBsV2hvV2FudFRvQmVGcmllbmRzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cy5tYXAoXHJcbiAgICAgICAgICAgICAgICBhPT4oIFthLnJlcXVlc3RvcixhLnJlcXVlc3RUeXAsYS5tb3ZpZT09PW51bGw/XCJcIjogYS5tb3ZpZSxcIk1lc3NhZ2U6XCIrIGEubWVzc2FnZT09PSdudWxsJz9cIm5vbmVcIjphLm1lc3NhZ2VdKSl9IFxyXG4gICAgICAgICAgICAgIHJlbW92ZT17dGhpcy5yZW1vdmVSZXF1ZXN0fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRnJpZW5kc1wiICkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8RnJpZW5kcyBcclxuICAgICAgICAgICAgc2VuZFdhdGNoUmVxdWVzdD17dGhpcy5zZW5kV2F0Y2hSZXF1ZXN0fSBcclxuICAgICAgICAgICAgZm9mPSB7dGhpcy5mb2N1c09uRnJpZW5kfSBcclxuICAgICAgICAgICAgZ2V0RnJpZW5kcz17dGhpcy5nZXRDdXJyZW50RnJpZW5kc30gXHJcbiAgICAgICAgICAgIG15RnJpZW5kcz17dGhpcy5zdGF0ZS5teUZyaWVuZHN9IFxyXG4gICAgICAgICAgICBsaXN0UG90ZW50aWFscz17dGhpcy5saXN0UG90ZW50aWFsc30gXHJcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXR9ICBcclxuICAgICAgICAgICAgc2VuZFJlcXVlc3Q9e3RoaXMuc2VuZFJlcXVlc3R9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkhvbWVcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8SG9tZSBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiU2luZ2xlTW92aWVcIikge1xyXG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBvbkNsaWNrPXsoKT0+Y29uc29sZS5sb2codGhhdC5zdGF0ZSl9PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBjb21wYXRpYmlsaXR5PXt0aGlzLnN0YXRlLm15RnJpZW5kc31cclxuICAgICAgICAgICAgY3VycmVudE1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NGcmllbmRzfVxyXG4gICAgICAgICAgICBmb2Y9e3RoaXMuZm9jdXNPbkZyaWVuZH1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PSdzaW5nbGVGcmllbmQnKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxTaW5nbGVGcmllbmQgXHJcbiAgICAgICAgICAgIG1vdmllc09mRnJpZW5kPXt0aGlzLnN0YXRlLmluZGl2aWR1YWxGcmllbmRzTW92aWVzfSBcclxuICAgICAgICAgICAgZnJpZW5kTmFtZT17dGhpcy5zdGF0ZS5mcmllbmRUb0ZvY3VzT259IFxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGTk1CXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEZpbmRNb3ZpZUJ1ZGR5IFxyXG4gICAgICAgICAgICBidWRkeWZ1bmM9e3RoaXMuYnVkZHlSZXF1ZXN0fSBcclxuICAgICAgICAgICAgYnVkZGllcz17dGhpcy5zdGF0ZS5wb3RlbnRpYWxNb3ZpZUJ1ZGRpZXN9IFxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk15UmF0aW5nc1wiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxNeVJhdGluZ3MgXHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5BcHAgPSBBcHA7XHJcblxyXG52YXIgVXJsID0gJ2h0dHBzOi8vcmVlbGZyaWVuZHouaGVyb2t1YXBwLmNvbSc7XHJcbi8vIHZhciBVcmwgPSAnaHR0cDovLzEyNy4wLjAuMTozMDAwJztcclxud2luZG93LlVybCA9IFVybFxyXG4iXX0=