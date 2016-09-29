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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwic3RhcnRpbmdTdGF0ZSIsInNlbmRXYXRjaFJlcXVlc3QiLCJiaW5kIiwiZ2V0RnJpZW5kcyIsImdldEN1cnJlbnRGcmllbmRzIiwibXlGcmllbmRzIiwibG9nb3V0Iiwic2VuZFJlcXVlc3QiLCJjaGFuZ2VWaWV3cyIsInNldEN1cnJlbnRVc2VyIiwiZ2V0TW92aWUiLCJhY2NlcHRGcmllbmQiLCJkZWNsaW5lRnJpZW5kIiwiY2hhbmdlVmlld3NNb3ZpZSIsImNoYW5nZVZpZXdzRnJpZW5kcyIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJidWRkeVJlcXVlc3QiLCJsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzIiwiZm9jdXNPbkZyaWVuZCIsInJlbW92ZVJlcXVlc3QiLCIkIiwicG9zdCIsIlVybCIsInRlc3QiLCJhIiwiYiIsImkiLCJsZW5ndGgiLCJmaW5hbCIsInNvcnQiLCJzZXRTdGF0ZSIsInBlcnNvblRvQWNjZXB0IiwibW92aWUiLCJ0aGF0IiwicmVzcCIsImVyciIsInBlbmRpbmciLCJwZW5kaW5nRnJpZW5kUmVxdWVzdHMiLCJyZXFzIiwibWFwIiwicmVxdWVzdG9yIiwic3BsaWNlIiwiaW5kZXhPZiIsInBlcnNvblRvRGVjbGluZSIsImR1bW15Iiwic29ydGVkIiwidW5pcXVlRnJpZW5kcyIsInVuaXF1ZSIsIngiLCJwdXNoIiwidmlldyIsInBvdGVudGlhbE1vdmllQnVkZGllcyIsInVzZXJuYW1lIiwiY3VycmVudFVzZXIiLCJuYW1lIiwicGFzc3dvcmQiLCJ0aGVuIiwiY2F0Y2giLCJtb3ZpZU5hbWUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwidmFsdWUiLCJmcmllbmRzUmF0aW5ncyIsInJlc3BvbnNlIiwiZnJpZW5kIiwidG9TZW5kIiwicmVxdWVzdGVlIiwicXVlcnkiLCJvcHRpb25zIiwic2VhcmNoTW92aWUiLCJ0YXJnZXRTdGF0ZSIsImZyaWVuZFRvRm9jdXNPbiIsInBlcnNvbiIsImlkeCIsImN1cnJGcmllbmRzIiwiZnJpZW5kczEiLCJmcmllbmRJbmZvIiwicmVxdWVzdHNPZkN1cnJlbnRVc2VyIiwiZm9yRWFjaCIsInJlcSIsInNjcm9sbFRvcCIsImZhZGVJbiIsImZhZGVPdXQiLCJjb25jYXQiLCJlcnJvciIsInBGUiIsInJSIiwicmVzcG9uc2VUVSIsInJlcXVlc3RSZXNwb25zZXMiLCJnZXQiLCJmcmllbmROYW1lIiwiaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXMiLCJzZWxmIiwiYWpheCIsInVybCIsInR5cGUiLCJkYXRhIiwic3VjY2VzcyIsIm5hdiIsInJlcXVlc3RUeXAiLCJtZXNzYWdlIiwibGlzdFBvdGVudGlhbHMiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQ01BLEc7OztBQUNKLGFBQVlDLENBQVosRUFBbUI7QUFBQTs7QUFBQSxrR0FDWEEsQ0FEVzs7QUFFakIsTUFBS0MsS0FBTCxHQUFhQyxhQUFiO0FBQ0EsTUFBS0MsZ0JBQUwsR0FBc0IsRUFBS0EsZ0JBQUwsQ0FBc0JDLElBQXRCLEdBQXRCO0FBQ0EsTUFBS0MsVUFBTCxHQUFnQixFQUFLQyxpQkFBTCxDQUF1QkYsSUFBdkIsR0FBaEI7QUFDQSxNQUFLRyxTQUFMLEdBQWUsRUFBS04sS0FBTCxDQUFXTSxTQUExQjtBQUNBLE1BQUtDLE1BQUwsR0FBWSxFQUFLQSxNQUFMLENBQVlKLElBQVosR0FBWjtBQUNBLE1BQUtLLFdBQUwsR0FBaUIsRUFBS0EsV0FBTCxDQUFpQkwsSUFBakIsR0FBakI7QUFDQSxNQUFLTSxXQUFMLEdBQWlCLEVBQUtBLFdBQUwsQ0FBaUJOLElBQWpCLEdBQWpCO0FBQ0EsTUFBS08sY0FBTCxHQUFvQixFQUFLQSxjQUFMLENBQW9CUCxJQUFwQixHQUFwQjtBQUNBLE1BQUtRLFFBQUwsR0FBYyxFQUFLQSxRQUFMLENBQWNSLElBQWQsR0FBZDtBQUNBLE1B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RSxtQkFBSyxLQUFLSTtBQUpaO0FBRkYsV0FERjtBQVdELFNBYk0sTUFhQSxJQUFJLEtBQUtuQixLQUFMLENBQVdtRCxJQUFYLEtBQWtCLGNBQXRCLEVBQXNDO0FBQzNDLGlCQUNFO0FBQUE7QUFBQTtBQUNLZ0QsYUFETDtBQUVFLGdDQUFDLFlBQUQ7QUFDRSw4QkFBZ0IsS0FBS25HLEtBQUwsQ0FBVzRGLHVCQUQ3QjtBQUVFLDBCQUFZLEtBQUs1RixLQUFMLENBQVd3RSxlQUZ6QjtBQUdFLHVCQUFTLEtBQUsvRCxXQUhoQjtBQUlFLHNCQUFRLEtBQUtLO0FBSmY7QUFGRixXQURGO0FBV0QsU0FaTSxNQVlBLElBQUksS0FBS2QsS0FBTCxDQUFXbUQsSUFBWCxLQUFvQixNQUF4QixFQUFnQztBQUNyQyxpQkFDRTtBQUFBO0FBQUE7QUFDS2dELGFBREw7QUFFRSxnQ0FBQyxjQUFEO0FBQ0UseUJBQVcsS0FBS2xGLFlBRGxCO0FBRUUsdUJBQVMsS0FBS2pCLEtBQUwsQ0FBV29EO0FBRnRCO0FBRkYsV0FERjtBQVNELFNBVk0sTUFVQSxJQUFJLEtBQUtwRCxLQUFMLENBQVdtRCxJQUFYLEtBQW9CLFdBQXhCLEVBQXFDO0FBQzFDLGlCQUNFO0FBQUE7QUFBQTtBQUNLZ0QsYUFETDtBQUVFLGdDQUFDLFNBQUQ7QUFDRSxzQkFBUSxLQUFLckY7QUFEZjtBQUZGLFdBREY7QUFRRDtBQUNGOzs7O0VBeGRleUYsTUFBTUMsUzs7QUEyZHhCQyxPQUFPM0csR0FBUCxHQUFhQSxHQUFiOztBQUVBLElBQUl5QixNQUFNLG1DQUFWO0FBQ0E7QUFDQWtGLE9BQU9sRixHQUFQLEdBQWFBLEdBQWIiLCJmaWxlIjoiQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSBzdGFydGluZ1N0YXRlO1xyXG4gICAgdGhpcy5zZW5kV2F0Y2hSZXF1ZXN0PXRoaXMuc2VuZFdhdGNoUmVxdWVzdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5nZXRGcmllbmRzPXRoaXMuZ2V0Q3VycmVudEZyaWVuZHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMubXlGcmllbmRzPXRoaXMuc3RhdGUubXlGcmllbmRzO1xyXG4gICAgdGhpcy5sb2dvdXQ9dGhpcy5sb2dvdXQuYmluZCh0aGlzKSAgXHJcbiAgICB0aGlzLnNlbmRSZXF1ZXN0PXRoaXMuc2VuZFJlcXVlc3QuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuY2hhbmdlVmlld3M9dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5zZXRDdXJyZW50VXNlcj10aGlzLnNldEN1cnJlbnRVc2VyLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmdldE1vdmllPXRoaXMuZ2V0TW92aWUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYWNjZXB0RnJpZW5kPSB0aGlzLmFjY2VwdEZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5kZWNsaW5lRnJpZW5kPXRoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3c01vdmllPXRoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHM9dGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuZmluZE1vdmllQnVkZGllcz10aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuYnVkZHlSZXF1ZXN0PXRoaXMuYnVkZHlSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHM9dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLmZvY3VzT25GcmllbmQ9dGhpcy5mb2N1c09uRnJpZW5kLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLnJlbW92ZVJlcXVlc3Q9dGhpcy5yZW1vdmVSZXF1ZXN0LmJpbmQodGhpcyk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0Q3VycmVudEZyaWVuZHMoKSB7XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coJ3Rlc3RpbmdnZycpO1xyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kcycse3Rlc3Q6J2luZm8nfSwgKGEsIGIpID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3doYXQgeW91IGdldCBiYWNrIGZyb20gc2VydmVyIGZvciBnZXQgZnJpZW5kcycsYSxiKTtcclxuICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPGEubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoYVtpXVsxXT09PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICBhW2ldWzFdID0gXCJObyBjb21wYXJpc29uIHRvIGJlIG1hZGVcIjtcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICBjb25zdCBmaW5hbD0gYS5zb3J0KChhLGIpPT57cmV0dXJuIGJbMV0tYVsxXX0pO1xyXG4gICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgd2hhdCBHQ0YgaXMgc2V0dGluZyBhcyBhbGwgZnJpZW5kcycsIGZpbmFsKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbXlGcmllbmRzOmZpbmFsXHJcbiAgICAgIH0pXHJcbiAgICAgICBjb25zb2xlLmxvZygndGhlcyBhcmUgbXkgZnJpZW5kcyEhISEhISEhISEhISEhISEhJyx0aGlzLnN0YXRlLm15RnJpZW5kcyk7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcblxyXG4gIGFjY2VwdEZyaWVuZChwZXJzb25Ub0FjY2VwdCwgbW92aWUpIHtcclxuICBcclxuICAgIGNvbnNvbGUubG9nKCdjYWxsaW5nIGFGJyk7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvYWNjZXB0Jyx7cGVyc29uVG9BY2NlcHQ6cGVyc29uVG9BY2NlcHQsIG1vdmllOiBtb3ZpZX0sKHJlc3AsZXJyKT0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ2l0IGNhbWUgYmFjayEnLCB0aGF0KTtcclxuICAgICAgbGV0IHBlbmRpbmc9dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHM7XHJcblxyXG5cclxuICAgICAgbGV0IHJlcXMgPSBwZW5kaW5nLm1hcCgoYSk9PihhLnJlcXVlc3RvcikpO1xyXG5cclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCdiZWZvcmUnLCBwZW5kaW5nLCByZXFzLCBwZXJzb25Ub0FjY2VwdCk7XHJcbiAgICAgIHBlbmRpbmcuc3BsaWNlKHJlcXMuaW5kZXhPZihwZXJzb25Ub0FjY2VwdCksMSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3BlbmRpbmdGcmllbmRSZXF1ZXN0czpwZW5kaW5nfSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdhZnRlcicsbmV3U2V0T2ZSZXFzLCB0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cyk7XHJcblxyXG4gICAgICAvL3RoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgfSlcclxuICAgIFxyXG4gICAgLy8gY29uc29sZS5sb2coJ3JlZnJlc2hlZCBpbmJveCwgc2hvdWxkIGRlbGV0ZSBmcmllbmQgcmVxdWVzdCBvbiB0aGUgc3BvdCBpbnN0ZWFkIG9mIG1vdmluZycpXHJcbiAgfVxyXG5cclxuICBkZWNsaW5lRnJpZW5kKHBlcnNvblRvRGVjbGluZSwgbW92aWUpIHtcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9kZWNsaW5lJyx7cGVyc29uVG9EZWNsaW5lOnBlcnNvblRvRGVjbGluZSwgbW92aWU6IG1vdmllfSwocmVzcCwgZXJyKT0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHN0YXRlIGFmdGVyIGRlY2xpbmluZyBmcmllbmQsICcsIHRoaXMuc3RhdGUpO1xyXG4gICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZmluZE1vdmllQnVkZGllcygpIHtcclxuICAgdmFyIHRoYXQ9dGhpcztcclxuICAgICQucG9zdChVcmwgKyAnL2ZpbmRNb3ZpZUJ1ZGRpZXMnLHtkdW1teTonaW5mbyd9LChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICBjb25zdCBzb3J0ZWQ9cmVzcC5zb3J0KChhLGIpPT4oYlsxXS1hWzFdKSk7XHJcbiAgICAgIGNvbnN0IG15RnJpZW5kcz10aGF0Lm15RnJpZW5kcztcclxuICAgICAgIGNvbnN0IHVuaXF1ZUZyaWVuZHM9W107XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8c29ydGVkLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgbGV0IHVuaXF1ZT10cnVlO1xyXG4gICAgICAgICAgZm9yIChsZXQgeD0wO3g8bXlGcmllbmRzLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICBpZiAoc29ydGVkW2ldWzBdPT09bXlGcmllbmRzW3hdWzBdKXtcclxuICAgICAgICAgICAgICB1bmlxdWU9ZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1bmlxdWUpe1xyXG4gICAgICAgICAgICB1bmlxdWVGcmllbmRzLnB1c2goc29ydGVkW2ldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OlwiRk5NQlwiLFxyXG4gICAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczp1bmlxdWVGcmllbmRzXHJcbiAgICAgIH0pXHJcblxyXG4gICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKCk7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcblxyXG4gIGNoYW5nZVZpZXcoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzpcIlNpZ25VcFwiIFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHNldEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnY2FsbGluZyBzZXRDdXJyZW50VXNlcicpO1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGN1cnJlbnRVc2VyOiB1c2VybmFtZVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGVudGVyTmV3VXNlcihuYW1lLHBhc3N3b3JkKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhuYW1lLHBhc3N3b3JkKTtcclxuICAgICQucG9zdChVcmwgKyAnL3NpZ251cCcse25hbWU6bmFtZSxwYXNzd29yZDpwYXNzd29yZH0pLnRoZW4oKCk9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWNjZXNzJyk7IFxyXG4gICAgICB0aGlzLnNldFN0YXRlKHt1c2VybmFtZTogbmFtZSwgdmlldzogXCJIb21lXCJ9KVxyXG4gICAgfSkuY2F0Y2goKCk9PiB7Y29uc29sZS5sb2coJ2Vycm9yJyl9KVxyXG4gIH1cclxuXHJcbiAgZ2V0RnJpZW5kTW92aWVSYXRpbmdzKCkge1xyXG4gICAgbGV0IG1vdmllTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW92aWVUb1ZpZXdcIikudmFsdWVcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZFJhdGluZ3MnLCB7IG5hbWU6IG1vdmllTmFtZSB9KS50aGVuKHJlc3BvbnNlPT4ge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzpcIkhvbWVcIixcclxuICAgICAgZnJpZW5kc1JhdGluZ3M6cmVzcG9uc2VcclxuICAgIH0pXHJcbiAgICAvLyBjb25zb2xlLmxvZygnb3VyIHJlc3BvbnNlJyx0aGlzLnN0YXRlLmZyaWVuZHNSYXRpbmdzKVxyXG4gICAgfSkuY2F0Y2goZXJyPT4ge2NvbnNvbGUubG9nKGVycil9KTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIGxvZ291dCgpIHtcclxuICAgICQucG9zdChVcmwgKyAnL2xvZ291dCcpLnRoZW4ocmVzcG9uc2U9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZShzdGFydGluZ1N0YXRlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VuZFdhdGNoUmVxdWVzdChmcmllbmQpIHtcclxuICAgIGNvbnN0IG1vdmllPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU7XHJcbiAgICBjb25zdCB0b1NlbmQ9e3JlcXVlc3RlZTpmcmllbmQsIG1vdmllOm1vdmllfTtcclxuICAgIGlmIChtb3ZpZS5sZW5ndGgpIHtcclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFdhdGNoUmVxdWVzdCcsIHRvU2VuZCwgKHJlc3AsIGVycik9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcCwgZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZT0nJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd5b3UgbmVlZCB0byBlbnRlciBhIG1vdmllIHRvIHNlbmQgYSB3YXRjaCByZXF1ZXN0ISEhIScpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9tb3ZpZSByZW5kZXJcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvL2NhbGwgc2VhcmNobW92aWUgZnVuY3Rpb25cclxuICAvL3doaWNoIGdldHMgcGFzc2VkIGRvd24gdG8gdGhlIE1vdmllIFNlYXJjaCBcclxuICBnZXRNb3ZpZShxdWVyeSkge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgcXVlcnk6IHF1ZXJ5XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB0aGlzLnByb3BzLnNlYXJjaE1vdmllKG9wdGlvbnMsIG1vdmllID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2cobW92aWUpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OlwiTW92aWVTZWFyY2hWaWV3XCIsXHJcbiAgICAgICAgbW92aWU6IG1vdmllXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuICAvL3Nob3cgdGhlIG1vdmllIHNlYXJjaGVkIGluIGZyaWVuZCBtb3ZpZSBsaXN0XHJcbiAgLy9vbnRvIHRoZSBzdGF0ZXZpZXcgb2YgbW92aWVzZWFyY2h2aWV3XHJcbiAgc2hvd01vdmllKG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgbW92aWU6IG1vdmllXHJcbiAgICB9KTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9OYXYgY2hhbmdlXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgY2hhbmdlVmlld3ModGFyZ2V0U3RhdGUpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xyXG5cclxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdGcmllbmRzJyl7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd5b3Ugc3dpdGNoZWQgdG8gZnJpZW5kcyEhJylcclxuICAgICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIC8vdGhpcy5zZW5kUmVxdWVzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdIb21lJyl7XHJcbiAgICAgIC8vIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKVxyXG4gICAgICB0aGlzLnNlbmRSZXF1ZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgIGlmICh0YXJnZXRTdGF0ZT09PVwiSW5ib3hcIil7XHJcbiAgICAgICB0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKVxyXG4gICAgIH1cclxuXHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICBjaGFuZ2VWaWV3c01vdmllKHRhcmdldFN0YXRlLCBtb3ZpZSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxyXG4gICAgICBtb3ZpZTogbW92aWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlVmlld3NGcmllbmRzKHRhcmdldFN0YXRlLCBmcmllbmQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZSxcclxuICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGJ1ZGR5UmVxdWVzdChwZXJzb24sIGlkeCkge1xyXG4gICAgY29uc29sZS5sb2cocGVyc29uLCBpZHgpO1xyXG4gICAgdGhpcy5zZW5kUmVxdWVzdChwZXJzb24sIGlkeCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgc2VuZFJlcXVlc3QoYSwgaWR4KSB7XHJcbiAgICBjb25zb2xlLmxvZyh0eXBlb2YgYSk7XHJcbiAgICBpZiAodHlwZW9mIGE9PT1cIm9iamVjdFwiKXtcclxuICAgICAgdmFyIHBlcnNvbj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlO1xyXG4gICAgICBjb25zb2xlLmxvZygncGFydCAxJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygncGFydCAyJyk7XHJcbiAgICAgIHZhciBwZXJzb24gPSBhIHx8ICd0ZXN0JztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjdXJyRnJpZW5kcz10aGlzLnN0YXRlLm15RnJpZW5kcztcclxuICAgIGNvbnN0IGZyaWVuZHMxPWN1cnJGcmllbmRzLm1hcChmcmllbmRJbmZvPT4oZnJpZW5kSW5mb1swXSkpO1xyXG4gICAgdGhpcy5zdGF0ZS5yZXF1ZXN0c09mQ3VycmVudFVzZXIuZm9yRWFjaChyZXE9PntcclxuICAgICAgZnJpZW5kczEucHVzaChyZXEpO1xyXG4gICAgfSlcclxuICAgIFxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBhbHNvIGJlIG15IGZyaWVuZHMnLHBlcnNvbiwgY3VyckZyaWVuZHMsZnJpZW5kczEsZnJpZW5kczIpXHJcbiAgICBjb25zb2xlLmxvZygndGhlc2Ugc2hvdWxkIGJlIG15IGN1cnJlbnQgZnJpZW5kcyBhbmQgaW5NZW0gcmVxdWVzdHMgYW5kIEkgc2hvdWxkIG5vdCBiZSBhYmxlIG90IHNlbmQgdG8gdGhlbScsIGZyaWVuZHMxKTtcclxuICAgIGlmIChmcmllbmRzMS5pbmRleE9mKHBlcnNvbikhPT0gLTEgJiYgZnJpZW5kczEubGVuZ3RoIT09MCl7XHJcbiAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKVxyXG4gICAgICBjb25zb2xlLmxvZygnY2FzZSBjYXVnaHQgMjU0Jyk7XHJcbiAgICAgICQoXCIjQWxyZWFkeVJlcSwjQWxyZWFkeVJlcTJcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgICAgXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzIHBlcnNvbiBpcyBhbHJlYWR5IGluIHRoZXJlISEnKVxyXG4gICAgfSBlbHNlIGlmICghcGVyc29uLmxlbmd0aCkge1xyXG4gICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKDApXHJcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kLCNlbnRlclJlYWxGcmllbmQyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmQsI2VudGVyUmVhbEZyaWVuZDJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuXHJcbi8vIGNvbnNvbGUubG9nKCdwZXJzb24gaXMgZGVmaW5lZD8nLHBlcnNvbik7XHJcbiAgICAgICQucG9zdChVcmwgKyAnL3NlbmRSZXF1ZXN0Jyx7bmFtZTpwZXJzb259LCAocmVzcCwgZXJyKT0+IHtcclxuICAgICAgIFxyXG4gICAgICAgY29uc29sZS5sb2coJ3Nob3VsZCBpbmNsdWRlIGV2ZXJ5Ym9keSB0byB3aG9tIGEgcmVxIGhhcyBldmVyIGJlZW4gc2VudCwgc2hvcnQgb2YgbW9zdCByZWNlbnQnLCByZXNwKTtcclxuICAgICAgICAgICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgwKTtcclxuICAgICAgICAgIGlmIChyZXNwLmluZGV4T2YocGVyc29uKT4tMSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYXNlIGNhdWdodCAyNzInKVxyXG4gICAgICAgICAgICAkKFwiI0FscmVhZHlSZXEsI0FscmVhZHlSZXEyXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgICAgICAgJChcIiNBbHJlYWR5UmVxLCNBbHJlYWR5UmVxMlwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJChcIiNyZXFTZW50LCNyZXFTZW50MlwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgICAgICQoXCIjcmVxU2VudCwjcmVxU2VudDJcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOnJlc3AuY29uY2F0KFtwZXJzb25dKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykhPT1udWxsKXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlID0gJyc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKSB7XHJcbiAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgZnJpZW5kIHJlcXMnKVxyXG4gICAgJC5wb3N0KFVybCArICcvbGlzdFJlcXVlc3RzJywgKHJlc3BvbnNlLCBlcnJvcik9PiB7XHJcbiAgICAgIGNvbnN0IHBGUj1bXTtcclxuICAgICAgY29uc3QgclI9W107XHJcbiAgICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgdG8gbHBmcicsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgIGZvciAodmFyIGk9MDtpPHJlc3BvbnNlWzBdLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGNvbnN0IHJlcXVlc3Rvcj1yZXNwb25zZVswXVtpXVsncmVxdWVzdG9yJ107XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VUVT0gcmVzcG9uc2VbMF1baV1bJ3Jlc3BvbnNlJ107XHJcbiAgICAgICAgaWYgKHJlcXVlc3RvciE9PXJlc3BvbnNlWzFdICYmIHJlc3BvbnNlVFU9PT1udWxsICl7XHJcbiAgICAgICAgICBwRlIucHVzaChyZXNwb25zZVswXVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXF1ZXN0b3I9PT1yZXNwb25zZVsxXSAmJnJlc3BvbnNlVFUhPT1udWxsICYmIHJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0ZWUnXSE9PSd0ZXN0Jyl7XHJcbiAgICAgICAgICByUi5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgLy9cclxuICAgICAgY29uc29sZS5sb2coXCJUb3RhbGl0eSBvZiBpbmJveFwiLHBGUiwgclIpO1xyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOnBGUixcclxuICAgICAgICByZXF1ZXN0UmVzcG9uc2VzOnJSXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBmb2N1c09uRnJpZW5kKGZyaWVuZCkge1xyXG4gICAgLy9cclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzonc2luZ2xlRnJpZW5kJyxcclxuICAgICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICQuZ2V0KFVybCArICcvZ2V0RnJpZW5kVXNlclJhdGluZ3MnLCB7ZnJpZW5kTmFtZTogZnJpZW5kfSwgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6IHJlc3BvbnNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICByZW1vdmVSZXF1ZXN0KHBlcnNvbiwgc2VsZiwgbW92aWUpIHtcclxuICAgIGNvbnNvbGUubG9nKCd0cnlpbmcgdG8gcmVtIHJlcScpO1xyXG4gICAgdmFyIHRoYXQ9IHRoaXM7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IFVybCArICcvcmVtb3ZlUmVxdWVzdCcsXHJcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgcmVxdWVzdG9yOiBzZWxmLFxyXG4gICAgICAgIHJlcXVlc3RlZTogcGVyc29uLFxyXG4gICAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICBjb25zb2xlLmxvZygnUkVRVUVTVCBSRU1PVkVEISBNb3ZpZSBpczogJywgbW92aWUpO1xyXG4gICAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IG5hdj08TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllc31cclxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3c31cclxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dH0gXHJcbiAgICAgICAgICAgIC8+XHJcblxyXG4gICAgaWYgKHRoaXMuc3RhdGUudmlldz09PSdMb2dpbicpIHtcclxuICAgICAgcmV0dXJuICg8TG9nSW4gY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3N9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyfS8+KTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09XCJTaWduVXBcIikge1xyXG4gICAgICByZXR1cm4gKDxTaWduVXAgY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3N9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyfSAvPik7XHJcbiAgICB9IFxyXG4gICAgLy90aGlzIHZpZXcgaXMgYWRkZWQgZm9yIG1vdmllc2VhcmNoIHJlbmRlcmluZ1xyXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk1vdmllU2VhcmNoVmlld1wiKSB7XHJcbiAgICAgIHJldHVybiAoIFxyXG4gICAgICAgIDxkaXY+IFxyXG4gICAgICAgICAgPGRpdj57bmF2fTwvZGl2PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxNb3ZpZVJhdGluZyBcclxuICAgICAgICAgICAgaGFuZGxlU2VhcmNoTW92aWU9e3RoaXMuZ2V0TW92aWV9XHJcbiAgICAgICAgICAgIG1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJJbmJveFwiICkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXN9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3c31cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fVxyXG4gICAgICAgICAgICAgIEhvbWU9e3RydWV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxJbmJveCBcclxuICAgICAgICAgICAgICByZXF1ZXN0cz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHN9XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2VzQW5zd2VyZWQ9e3RoaXMuc3RhdGUucmVxdWVzdFJlc3BvbnNlc31cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSAgXHJcbiAgICAgICAgICAgICAgYWNjZXB0PSB7dGhpcy5hY2NlcHRGcmllbmR9IFxyXG4gICAgICAgICAgICAgIGRlY2xpbmU9e3RoaXMuZGVjbGluZUZyaWVuZH0gXHJcbiAgICAgICAgICAgICAgbGlzdFJlcXVlc3RzPXt0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHN9IFxyXG4gICAgICAgICAgICAgIHBwbFdob1dhbnRUb0JlRnJpZW5kcz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHMubWFwKFxyXG4gICAgICAgICAgICAgICAgYT0+KCBbYS5yZXF1ZXN0b3IsYS5yZXF1ZXN0VHlwLGEubW92aWU9PT1udWxsP1wiXCI6IGEubW92aWUsXCJNZXNzYWdlOlwiKyBhLm1lc3NhZ2U9PT0nbnVsbCc/XCJub25lXCI6YS5tZXNzYWdlXSkpfSBcclxuICAgICAgICAgICAgICByZW1vdmU9e3RoaXMucmVtb3ZlUmVxdWVzdH1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZyaWVuZHNcIiApIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEZyaWVuZHMgXHJcbiAgICAgICAgICAgIHNlbmRXYXRjaFJlcXVlc3Q9e3RoaXMuc2VuZFdhdGNoUmVxdWVzdH0gXHJcbiAgICAgICAgICAgIGZvZj0ge3RoaXMuZm9jdXNPbkZyaWVuZH0gXHJcbiAgICAgICAgICAgIGdldEZyaWVuZHM9e3RoaXMuZ2V0Q3VycmVudEZyaWVuZHN9IFxyXG4gICAgICAgICAgICBteUZyaWVuZHM9e3RoaXMuc3RhdGUubXlGcmllbmRzfSBcclxuICAgICAgICAgICAgbGlzdFBvdGVudGlhbHM9e3RoaXMubGlzdFBvdGVudGlhbHN9IFxyXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0fSAgXHJcbiAgICAgICAgICAgIHNlbmRSZXF1ZXN0PXt0aGlzLnNlbmRSZXF1ZXN0fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJIb21lXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICB7bmF2fVxyXG4gICAgICAgICAgPEhvbWUgXHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIlNpbmdsZU1vdmllXCIpIHtcclxuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgb25DbGljaz17KCk9PmNvbnNvbGUubG9nKHRoYXQuc3RhdGUpfT5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxTaW5nbGVNb3ZpZVJhdGluZyBcclxuICAgICAgICAgICAgY29tcGF0aWJpbGl0eT17dGhpcy5zdGF0ZS5teUZyaWVuZHN9XHJcbiAgICAgICAgICAgIGN1cnJlbnRNb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzRnJpZW5kc31cclxuICAgICAgICAgICAgZm9mPXt0aGlzLmZvY3VzT25GcmllbmR9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nc2luZ2xlRnJpZW5kJykge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8U2luZ2xlRnJpZW5kIFxyXG4gICAgICAgICAgICBtb3ZpZXNPZkZyaWVuZD17dGhpcy5zdGF0ZS5pbmRpdmlkdWFsRnJpZW5kc01vdmllc30gXHJcbiAgICAgICAgICAgIGZyaWVuZE5hbWU9e3RoaXMuc3RhdGUuZnJpZW5kVG9Gb2N1c09ufSBcclxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3c31cclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRk5NQlwiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge25hdn1cclxuICAgICAgICAgIDxGaW5kTW92aWVCdWRkeSBcclxuICAgICAgICAgICAgYnVkZHlmdW5jPXt0aGlzLmJ1ZGR5UmVxdWVzdH0gXHJcbiAgICAgICAgICAgIGJ1ZGRpZXM9e3RoaXMuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzfSBcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNeVJhdGluZ3NcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtuYXZ9XHJcbiAgICAgICAgICA8TXlSYXRpbmdzIFxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuQXBwID0gQXBwO1xyXG5cclxudmFyIFVybCA9ICdodHRwczovL3JlZWxmcmllbmR6Lmhlcm9rdWFwcC5jb20nO1xyXG4vLyB2YXIgVXJsID0gJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMCc7XHJcbndpbmRvdy5VcmwgPSBVcmxcclxuIl19